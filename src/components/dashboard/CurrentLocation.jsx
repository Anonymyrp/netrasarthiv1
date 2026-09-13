import { MapPin, Plus, Minus, LocateFixed } from 'lucide-react'

function CurrentLocation({ status, address, accuracy, updatedAt, onViewMap, onZoomIn, onZoomOut, onLocate, className = '' }) {
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

      <div className="map-dark relative overflow-hidden rounded-card dashboard-location-map flex items-center justify-center">
        <div className="map-ring-outer absolute w-40 h-40 rounded-full border" />
        <div className="map-ring-inner absolute w-24 h-24 rounded-full border" />
        <div className="relative">
          <div className="map-marker-ping absolute inset-0 rounded-full animate-ping" />
          <div className="map-marker relative w-4 h-4 rounded-full" />
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={onZoomIn} aria-label="Zoom in" className="map-control-btn w-8 h-8 rounded-card flex items-center justify-center text-text-secondary">
            <Plus size={16} />
          </button>
          <button onClick={onZoomOut} aria-label="Zoom out" className="map-control-btn w-8 h-8 rounded-card flex items-center justify-center text-text-secondary">
            <Minus size={16} />
          </button>
          <button onClick={onLocate} aria-label="Locate" className="map-control-btn w-8 h-8 rounded-card flex items-center justify-center text-text-secondary">
            <LocateFixed size={16} />
          </button>
        </div>
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