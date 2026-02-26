import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { 
  MapPin, Clock, Map, Calendar, ChevronDown, ChevronUp, 
  Navigation, Layers, Eye, Filter, Play, Pause, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const startIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div class="relative">
    <div class="w-6 h-6 bg-green-500 rounded-full border-4 border-green-300"></div>
    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
      <div class="bg-white text-gray-800 text-xs py-1 px-2 rounded shadow-lg font-semibold">Start</div>
    </div>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const endIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div class="relative">
    <div class="w-6 h-6 bg-red-500 rounded-full border-4 border-red-300"></div>
    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
      <div class="bg-white text-gray-800 text-xs py-1 px-2 rounded shadow-lg font-semibold">End</div>
    </div>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const waypointIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div class="relative">
    <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-300"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const selectedIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div class="relative">
    <div class="w-8 h-8 bg-purple-500 rounded-full border-4 border-purple-300 animate-pulse"></div>
    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
      <div class="bg-purple-600 text-white text-xs py-1 px-2 rounded shadow-lg">Selected</div>
    </div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Component to recenter map
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const PastLocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'map', 'list'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.0, 73.8]);
  const [routePoints, setRoutePoints] = useState([]);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Stats
  const [stats, setStats] = useState({
    totalLocations: 0,
    todayLocations: 0,
    uniqueDays: 0,
    totalDistance: 0,
    avgSpeed: 0,
    startTime: null,
    endTime: null
  });

  useEffect(() => {
    const historyRef = ref(db, "location_history/device1");

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Past locations data:", data);
      
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        // Sort by timestamp (oldest first for route)
        const sortedByTime = [...list].sort((a, b) => {
          const timeA = a.timestamp || 0;
          const timeB = b.timestamp || 0;
          return timeA - timeB;
        });

        // Create route points
        const points = sortedByTime
          .filter(p => p.latitude && p.longitude)
          .map(p => [p.latitude, p.longitude]);
        setRoutePoints(points);

        // Sort by timestamp (newest first for display)
        const sortedByNewest = [...list].sort((a, b) => {
          const timeA = a.timestamp || 0;
          const timeB = b.timestamp || 0;
          return timeB - timeA;
        });

        setLocations(sortedByNewest);
        setTotalPages(Math.ceil(sortedByNewest.length / itemsPerPage));
        
        // Set map center to most recent location
        if (sortedByNewest.length > 0) {
          setMapCenter([sortedByNewest[0].latitude, sortedByNewest[0].longitude]);
        }
        
        calculateStats(sortedByNewest, points);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [itemsPerPage]);

  const calculateStats = (locationList, routePoints) => {
    if (locationList.length === 0) return;

    // Count today's locations
    const today = new Date().toDateString();
    const todayCount = locationList.filter(loc => {
      const locDate = new Date(loc.timestamp || loc.time).toDateString();
      return locDate === today;
    }).length;

    // Count unique days
    const uniqueDays = new Set(locationList.map(loc => 
      new Date(loc.timestamp || loc.time).toDateString()
    )).size;

    // Calculate total distance
    let totalDist = 0;
    for (let i = 1; i < routePoints.length; i++) {
      const [lat1, lon1] = routePoints[i-1];
      const [lat2, lon2] = routePoints[i];
      totalDist += calculateDistance(lat1, lon1, lat2, lon2);
    }

    // Calculate average speed if time range available
    let avgSpeed = 0;
    if (locationList.length >= 2) {
      const firstTime = new Date(locationList[locationList.length-1].timestamp || locationList[locationList.length-1].time);
      const lastTime = new Date(locationList[0].timestamp || locationList[0].time);
      const hours = (lastTime - firstTime) / (1000 * 60 * 60);
      if (hours > 0) {
        avgSpeed = totalDist / hours;
      }
    }

    setStats({
      totalLocations: locationList.length,
      todayLocations: todayCount,
      uniqueDays: uniqueDays,
      totalDistance: totalDist.toFixed(2),
      avgSpeed: avgSpeed.toFixed(1),
      startTime: locationList[locationList.length-1]?.timestamp || locationList[locationList.length-1]?.time,
      endTime: locationList[0]?.timestamp || locationList[0]?.time
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openInGoogleMaps = (lat, lng) => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      alert("Invalid coordinates");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return String(timestamp);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return String(timestamp);
    }
  };

  const getFilteredLocations = () => {
    const now = new Date();
    const today = now.toDateString();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

    return locations.filter(loc => {
      const locDate = new Date(loc.timestamp || loc.time);
      
      switch(filter) {
        case 'today':
          return locDate.toDateString() === today;
        case 'week':
          return locDate >= oneWeekAgo;
        default:
          return true;
      }
    });
  };

  // Pagination handlers
  const getCurrentPageItems = () => {
    const filtered = getFilteredLocations();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const filteredTotal = Math.ceil(getFilteredLocations().length / itemsPerPage);
    
    if (filteredTotal <= maxVisiblePages) {
      for (let i = 1; i <= filteredTotal; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= filteredTotal - 2) {
        for (let i = filteredTotal - 4; i <= filteredTotal; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  // Playback controls
  useEffect(() => {
    let interval;
    if (isPlaying && routePoints.length > 0) {
      interval = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= routePoints.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          setMapCenter(routePoints[prev + 1]);
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, routePoints, playbackSpeed]);

  const togglePlayback = () => {
    if (playbackIndex >= routePoints.length - 1) {
      setPlaybackIndex(0);
      setMapCenter(routePoints[0]);
    }
    setIsPlaying(!isPlaying);
  };

  const resetPlayback = () => {
    setPlaybackIndex(0);
    setMapCenter(routePoints[0]);
    setIsPlaying(false);
  };

  const filteredLocations = getFilteredLocations();
  const currentItems = getCurrentPageItems();
  const filteredTotalPages = Math.ceil(filteredLocations.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <MapPin size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Past Locations</h1>
              <p className="text-gray-600">Location history with route tracing</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-600 mb-1">Total Locations</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalLocations}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-600 mb-1">Total Distance</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalDistance} km</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
              <p className="text-sm text-purple-600 mb-1">Avg Speed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.avgSpeed} km/h</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-600 mb-1">Active Days</p>
              <p className="text-2xl font-bold text-gray-800">{stats.uniqueDays}</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'split' 
                      ? 'bg-white shadow-sm text-emerald-600' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white shadow-sm text-emerald-600' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Map Only
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-emerald-600' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  List Only
                </button>
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                </select>
              </div>
            </div>

            {/* Playback Controls */}
            {routePoints.length > 0 && viewMode !== 'list' && (
              <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
                <button
                  onClick={resetPlayback}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Reset"
                >
                  <ChevronsLeft size={18} />
                </button>
                <button
                  onClick={togglePlayback}
                  className={`p-2 rounded-lg transition-colors ${
                    isPlaying ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="px-2 py-1 bg-white border rounded text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
                <span className="text-sm text-gray-600">
                  {playbackIndex + 1}/{routePoints.length}
                </span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading location history...</p>
            </div>
          )}

          {/* Main Content */}
          {!loading && (
            <>
              {/* Map View */}
              {(viewMode === 'map' || viewMode === 'split') && (
                <div className={`${viewMode === 'split' ? 'h-[500px] mb-6' : 'h-[600px]'} w-full rounded-xl overflow-hidden border border-gray-200`}>
                  <MapContainer
                    center={mapCenter}
                    zoom={16}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Route line */}
                    {routePoints.length > 0 && (
                      <Polyline 
                        positions={routePoints} 
                        color="#10b981" 
                        weight={4}
                        opacity={0.7}
                      />
                    )}

                    {/* Start marker */}
                    {routePoints.length > 0 && (
                      <Marker position={routePoints[0]} icon={startIcon} />
                    )}

                    {/* End marker */}
                    {routePoints.length > 0 && (
                      <Marker position={routePoints[routePoints.length - 1]} icon={endIcon} />
                    )}

                    {/* Waypoint markers (limited to avoid clutter) */}
                    {routePoints.length > 2 && routePoints.map((point, index) => {
                      if (index === 0 || index === routePoints.length - 1) return null;
                      if (index % Math.floor(routePoints.length / 10) === 0) {
                        return <Marker key={index} position={point} icon={waypointIcon} />;
                      }
                      return null;
                    })}

                    {/* Selected location marker */}
                    {selectedLocation && (
                      <Marker 
                        position={[selectedLocation.latitude, selectedLocation.longitude]} 
                        icon={selectedIcon}
                      />
                    )}

                    {/* Playback marker */}
                    {isPlaying && routePoints[playbackIndex] && (
                      <Marker position={routePoints[playbackIndex]} icon={waypointIcon} />
                    )}

                    <ChangeMapView center={mapCenter} />
                  </MapContainer>
                </div>
              )}

              {/* List View */}
              {(viewMode === 'list' || viewMode === 'split') && (
                <div className={viewMode === 'split' ? 'mt-6' : ''}>
                  {/* Summary */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Location History
                    </h3>
                    <div className="text-sm text-gray-500">
                      {stats.startTime && stats.endTime && (
                        <span>
                          {formatDate(stats.startTime)} - {formatDate(stats.endTime)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Locations List */}
                  {filteredLocations.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No past locations available</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Check Firebase path: location_history/device1
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 mb-4">
                        {currentItems.map((loc, index) => (
                          <div
                            key={loc.id}
                            className={`p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer ${
                              selectedLocation?.id === loc.id 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedLocation(loc);
                              setMapCenter([loc.latitude, loc.longitude]);
                              if (viewMode === 'list') setViewMode('split');
                            }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  index === 0 ? 'bg-green-100' : 
                                  selectedLocation?.id === loc.id ? 'bg-purple-100' : 'bg-emerald-100'
                                }`}>
                                  <MapPin size={20} className={
                                    index === 0 ? 'text-green-600' :
                                    selectedLocation?.id === loc.id ? 'text-purple-600' : 'text-emerald-600'
                                  } />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-800">
                                      {loc.latitude?.toFixed(6)}, {loc.longitude?.toFixed(6)}
                                    </span>
                                    {index === 0 && (
                                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                        Latest
                                      </span>
                                    )}
                                    {selectedLocation?.id === loc.id && (
                                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                        Selected
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatTime(loc.timestamp || loc.time)}
                                  </p>
                                  {loc.accuracy && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      Accuracy: ±{loc.accuracy.toFixed(1)}m
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start md:self-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openInGoogleMaps(loc.latitude, loc.longitude);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Open in Google Maps"
                                >
                                  <Navigation size={18} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMapCenter([loc.latitude, loc.longitude]);
                                    setSelectedLocation(loc);
                                    if (viewMode === 'list') setViewMode('split');
                                  }}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Center on map"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {filteredTotalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={goToFirstPage}
                              disabled={currentPage === 1}
                              className={`p-2 rounded-lg transition-colors ${
                                currentPage === 1 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <ChevronsLeft size={18} />
                            </button>
                            <button
                              onClick={goToPreviousPage}
                              disabled={currentPage === 1}
                              className={`p-2 rounded-lg transition-colors ${
                                currentPage === 1 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <ChevronLeft size={18} />
                            </button>

                            <div className="flex items-center gap-1">
                              {getPageNumbers().map(pageNum => (
                                <button
                                  key={pageNum}
                                  onClick={() => goToPage(pageNum)}
                                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === pageNum
                                      ? 'bg-emerald-600 text-white'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={goToNextPage}
                              disabled={currentPage === filteredTotalPages}
                              className={`p-2 rounded-lg transition-colors ${
                                currentPage === filteredTotalPages 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <ChevronRight size={18} />
                            </button>
                            <button
                              onClick={goToLastPage}
                              disabled={currentPage === filteredTotalPages}
                              className={`p-2 rounded-lg transition-colors ${
                                currentPage === filteredTotalPages 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <ChevronsRight size={18} />
                            </button>
                          </div>

                          <div className="text-sm text-gray-500">
                            Page {currentPage} of {filteredTotalPages} • {filteredLocations.length} locations
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastLocationPage;