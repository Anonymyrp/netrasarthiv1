import React from 'react';
import { MapPin, Camera, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="mb-16 text-center">
         
          
        </header>

        {/* Services Introduction */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            CareTaker Services
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            Click on any service to access its dedicated page
          </p>
        </div>

        {/* Functional Feature Cards with Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Live Location Card */}
          <Link 
            to="/live-location"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-lg border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            
            
            <div className="flex flex-col items-start text-left relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Live Location
                </h3>
              </div>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Track real-time location updates with continuous live streaming and instant notifications
              </p>
            </div>
          </Link>

          {/* Pass Location Card */}
          <Link 
            to="/pass-location"
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 shadow-lg border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
          
            
            <div className="flex flex-col items-start text-left relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Past Location
                </h3>
              </div>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Share your current location securely with selected contacts or emergency services
              </p>
              
              
            </div>
          </Link>

          {/* Recordings Card */}
          <Link 
            to="/recordings"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 shadow-lg border border-purple-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
           
            
            <div className="flex flex-col items-start text-left relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Recordings
                </h3>
              </div>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Access and manage your complete location history with detailed analytics and insights
              </p>
              
              
            </div>
          </Link>
        </div>


       
      </div>
    </div>
  );
}

export default Home;