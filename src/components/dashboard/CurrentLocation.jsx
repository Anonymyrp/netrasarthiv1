import { MapPin } from 'lucide-react'
import LiveMap from './LiveMap'

function CurrentLocation({ status, address, accuracy, updatedAt, latitude, longitude, onViewMap, onZoomIn, onZoomOut, onLocate, className = '' }) {
  return (
    <section className={`glass-card ambient-glow rounded-card p-5 dashboard-location-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <MapPin size={18} className="text-accent-primary" />
          Current Location
        </h2>
        <span className="live-badge flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          Live
        </span>
      </div>

      <div className="dashboard-location-map">
        <LiveMap
          latitude={latitude}
          longitude={longitude}
          accuracy={accuracy}
          zoom={15}
          defaultVariant="satellite"
          variants={['satellite']}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin size={14} />
          {status === 'unavailable' ? (
            <span>Location unavailable</span>
          ) : (
            <span>
              {address} · Accuracy ± {accuracy} m · Updated {updatedAt}
            </span>
          )}
        </div>
        <button onClick={onViewMap} className="btn-primary px-4 py-2 text-sm font-medium flex items-center gap-1">
          View on Map
        </button>
      </div>
    </section>
  )
}

export default CurrentLocation