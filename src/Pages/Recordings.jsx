import React, { useState, useEffect } from 'react';
import { Download, Trash2, Play, Clock, Calendar, MoreVertical, HardDrive, Shield, X, Film, RefreshCw } from 'lucide-react';

const RecordingsPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('list');
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend connection and fetch videos
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      const response = await fetch('https://netra-server-xy36.onrender.com/api/test');
      if (response.ok) {
        setBackendStatus('connected');
        fetchVideos();
      } else {
        setBackendStatus('disconnected');
        setError('Backend server is running but returned an error');
        setLoading(false);
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('disconnected');
      setError('Could not connect to backend server. Make sure it\'s running on port 5000');
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching videos from backend...');
      const response = await fetch('https://netra-server-xy36.onrender.com/api/cloudinary/videos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.success) {
        const transformedRecordings = data.videos.map((video, index) => ({
          id: video.public_id || index,
          title: video.title || video.public_id?.split('/').pop().replace(/_/g, ' ') || 'Untitled Video',
          timeAgo: getTimeAgo(new Date(video.created_at)),
          size: formatBytes(video.bytes),
          duration: formatDuration(video.duration),
          date: new Date(video.created_at).toISOString().split('T')[0],
          type: getVideoType(video.title),
          protected: false,
          url: video.url,
          thumbnail: video.thumbnail || video.url?.replace('/upload/', '/upload/w_400,h_300,c_fill/'),
          publicId: video.public_id,
          format: video.format,
          createdAt: video.created_at
        }));
        
        // Sort recordings based on selected sort option
        const sorted = sortRecordings(transformedRecordings, sortBy);
        setRecordings(sorted);
      } else {
        setError('Failed to load videos from Cloudinary');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Error loading videos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getTimeAgo = (date) => {
    if (!date || isNaN(date)) return 'Unknown date';
    
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return 'Just now';
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoType = (title) => {
    if (!title) return 'walk';
    const titleLower = title.toLowerCase();
    if (titleLower.includes('walk')) return 'walk';
    if (titleLower.includes('cross')) return 'crossing';
    if (titleLower.includes('market') || titleLower.includes('shop')) return 'visit';
    if (titleLower.includes('home') || titleLower.includes('return')) return 'return';
    if (titleLower.includes('bus') || titleLower.includes('station') || titleLower.includes('navigation')) return 'navigation';
    if (titleLower.includes('school') || titleLower.includes('route')) return 'route';
    if (titleLower.includes('medical') || titleLower.includes('hospital') || titleLower.includes('clinic')) return 'medical';
    if (titleLower.includes('grocery') || titleLower.includes('store')) return 'shopping';
    return 'walk';
  };

  const sortRecordings = (recordingsToSort, sortByOption) => {
    const sorted = [...recordingsToSort];
    switch(sortByOption) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'size':
        return sorted.sort((a, b) => {
          const sizeA = parseFloat(a.size) || 0;
          const sizeB = parseFloat(b.size) || 0;
          return sizeB - sizeA;
        });
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    setRecordings(prev => sortRecordings(prev, newSort));
  };

  const handleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === recordings.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(recordings.map(rec => rec.id));
    }
  };

  const handleDownload = async (recording) => {
    try {
      const link = document.createElement('a');
      link.href = recording.url;
      link.download = `${recording.title}.${recording.format || 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download video');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      try {
        const response = await fetch(`https://netra-server-xy36.onrender.com/api/cloudinary/videos/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          setRecordings(prev => prev.filter(rec => rec.id !== id));
          setSelectedItems(prev => prev.filter(item => item !== id));
        } else {
          alert('Failed to delete video');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Error deleting video');
      }
    }
  };

  const handlePlay = (recording) => {
    setPlayingVideo(recording);
  };

  const getFileIcon = (type) => {
    const icons = {
      walk: '🚶',
      crossing: '🚦',
      visit: '🏪',
      return: '🏠',
      navigation: '🧭',
      route: '🛣️',
      medical: '🏥',
      shopping: '🛒'
    };
    return icons[type] || '📁';
  };

  // Video Player Modal
  const VideoPlayerModal = ({ video, onClose }) => {
    if (!video) return null;

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => handleDownload(video)}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <h3 className="text-white text-xl font-semibold mb-2">{video.title}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {video.date} • {video.duration} • {video.size}
            </p>
          </div>
          
          <div className="aspect-video bg-black">
            <video
              src={video.url}
              controls
              autoPlay
              className="w-full h-full"
              poster={video.thumbnail}
              onError={(e) => console.log('Video playback error:', e)}
            />
          </div>
        </div>
      </div>
    );
  };

  // Calculate storage stats
  const storageStats = {
    used: recordings.reduce((acc, rec) => {
      const sizeNum = parseFloat(rec.size) || 0;
      return acc + sizeNum;
    }, 0),
    total: 2048, // 2GB in MB
  };
  storageStats.percentage = (storageStats.used / storageStats.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      {playingVideo && (
        <VideoPlayerModal 
          video={playingVideo} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Recent Recordings
          </h1>
          <p className="text-gray-600">
            View and manage your location history recordings from Cloudinary
          </p>
          {backendStatus === 'disconnected' && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                ⚠️ Backend server not connected. Make sure to run the server on port 5000
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectedItems.length === recordings.length && recordings.length > 0}
                      onChange={handleSelectAll}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="selectAll" className="ml-2 text-gray-700">
                      {selectedItems.length > 0 
                        ? `${selectedItems.length} selected` 
                        : 'Select all'}
                    </label>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => selectedItems.forEach(id => {
                          const recording = recordings.find(r => r.id === id);
                          if (recording) handleDownload(recording);
                        })}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
                            selectedItems.forEach(id => handleDelete(id));
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={checkBackendConnection}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={loading}
                  >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>

                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="size">Size (Large to Small)</option>
                    <option value="name">Name (A-Z)</option>
                  </select>

                  <div className="flex items-center bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'}`}
                    >
                      <div className="w-5 h-5 flex flex-col justify-between">
                        <div className="h-0.5 w-full bg-gray-600"></div>
                        <div className="h-0.5 w-full bg-gray-600"></div>
                        <div className="h-0.5 w-full bg-gray-600"></div>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'}`}
                    >
                      <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                        <div className="bg-gray-600 rounded-sm"></div>
                        <div className="bg-gray-600 rounded-sm"></div>
                        <div className="bg-gray-600 rounded-sm"></div>
                        <div className="bg-gray-600 rounded-sm"></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={checkBackendConnection}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading videos from Cloudinary...</p>
              </div>
            )}

            {/* Recordings List */}
            {!loading && !error && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {recordings.length === 0 ? (
                  <div className="p-12 text-center">
                    <Film size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No videos found</h3>
                    <p className="text-gray-600 mb-4">Upload videos to your netra_sarthi_videos folder in Cloudinary</p>
                    <a 
                      href="https://console.cloudinary.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Go to Cloudinary Console
                    </a>
                  </div>
                ) : (
                  recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        selectedItems.includes(recording.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="pr-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(recording.id)}
                          onChange={() => handleSelect(recording.id)}
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>

                      {/* Thumbnail */}
                      <div className="pr-4">
                        <div className="w-16 h-12 bg-gray-800 rounded-lg overflow-hidden">
                          {recording.thumbnail ? (
                            <img 
                              src={recording.thumbnail} 
                              alt={recording.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center"><span class="text-2xl">${getFileIcon(recording.type)}</span></div>`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                              <span className="text-2xl">{getFileIcon(recording.type)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recording Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {recording.title}
                          </h3>
                          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {recording.size}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {recording.timeAgo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {recording.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Play size={14} />
                            {recording.duration}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pl-4">
                        <button
                          onClick={() => handlePlay(recording)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Play recording"
                        >
                          <Play size={20} />
                        </button>
                        <button
                          onClick={() => handleDownload(recording)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(recording.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Storage Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <HardDrive size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Storage</h3>
                  <p className="text-sm text-gray-600">Cloudinary Storage</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">
                    {storageStats.used.toFixed(1)} MB
                  </span>
                  <span className="text-gray-500">
                    {(storageStats.total / 1024).toFixed(1)} GB total
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(storageStats.percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <span className="font-medium">{storageStats.percentage.toFixed(1)}%</span> of storage used
                </p>
                <p className="text-xs text-gray-500">
                  {(storageStats.total - storageStats.used).toFixed(1)} MB available
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Videos</span>
                  <span className="font-semibold text-gray-800">{recordings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Size</span>
                  <span className="font-semibold text-gray-800">{storageStats.used.toFixed(1)} MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Duration</span>
                  <span className="font-semibold text-gray-800">
                    {recordings.length > 0 ? recordings[0].duration : '00:00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last 24 hours</span>
                  <span className="font-semibold text-green-600">
                    {recordings.filter(r => r.timeAgo.includes('min') || r.timeAgo.includes('hour')).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingsPage;