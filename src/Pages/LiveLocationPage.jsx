import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase'; // Import from config folder
import { ref, onValue } from 'firebase/database';
import { Radio, Navigation, Map, Crosshair, Satellite, Wifi, Clock } from 'lucide-react';

const LiveLocationPage = () => {
  const [location, setLocation] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [signalStrength, setSignalStrength] = useState('Excellent');

  useEffect(() => {
    const locationRef = ref(db, "live_location");
    
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      setLocation(data);
      setLastUpdated(new Date().toLocaleTimeString());
      
      if (data) {
        setSignalStrength('Excellent');
      } else {
        setSignalStrength('Weak');
      }
    });

    return () => unsubscribe();
  }, []);

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Radio size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Live Location</h1>
              <p className="text-gray-600">Real-time location tracking and monitoring</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Location Details */}
            <div className="space-y-6">
              {/* Current Status Card */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Tracking Status</span>
                    <span className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Last Updated</span>
                    <span className="text-gray-800 font-medium">
                      {lastUpdated ? lastUpdated : 'Waiting...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Signal Strength</span>
                    <span className={`font-medium ${
                      signalStrength === 'Excellent' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {signalStrength}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Details Card */}
              <div className="bg-white border border-blue-100 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Crosshair className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Location Details</h3>
                </div>
                
                {location ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Latitude</p>
                          <p className="text-lg font-mono font-semibold text-gray-800">
                            {location.latitude}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Longitude</p>
                          <p className="text-lg font-mono font-semibold text-gray-800">
                            {location.longitude}
                          </p>
                        </div>
                      </div>
                    </div>

                    {location.accuracy && (
                      <div className="flex items-center gap-3 text-sm">
                        <Satellite className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Accuracy: ±{location.accuracy}m</span>
                      </div>
                    )}

                    {location.speed && (
                      <div className="flex items-center gap-3 text-sm">
                        <Navigation className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Speed: {location.speed} km/h</span>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={openInGoogleMaps}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Map size={18} />
                        Open in Maps
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wifi className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Waiting for GPS signal...</p>
                    <p className="text-gray-400 text-sm mt-2">Make sure location services are enabled</p>
                  </div>
                )}
              </div>

              {/* Live Updates Indicator */}
              {location && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">Receiving live updates</p>
                    <p className="text-green-600 text-sm">Updates every second</p>
                  </div>
                  <Clock className="w-5 h-5 text-green-600 ml-auto" />
                </div>
              )}
            </div>

            {/* Right Column - Map View */}
            <div className="bg-gray-800 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Live Map</h3>
                {location && (
                  <span className="text-xs bg-blue-600 px-3 py-1 rounded-full">
                    Live Tracking
                  </span>
                )}
              </div>
              
              <div className="h-96 bg-gray-700 rounded-xl overflow-hidden relative">
                {location ? (
                  <iframe
                    title="Live Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01}%2C${location.latitude-0.01}%2C${location.longitude+0.01}%2C${location.latitude+0.01}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
                    className="w-full h-full"
                  >
                  </iframe>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Map size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-300">Waiting for location data</p>
                      <p className="text-gray-400 text-sm mt-2">Please enable location services</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Satellite view available</span>
                </div>
                {location && (
                  <span className="text-blue-400 text-xs">
                    Coordinates updated in real-time
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          {location && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Location data is updated in real-time. Last sync: {lastUpdated}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveLocationPage;