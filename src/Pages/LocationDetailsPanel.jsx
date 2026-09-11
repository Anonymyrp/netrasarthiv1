import { X, Share2, Navigation, Shield, Battery } from 'lucide-react'

function LocationDetailsPanel({ address, isLive, accuracy, latitude, longitude, updatedAt, speed, battery, onShare, onGetDirections, onAddSafeZone, onClose }) {
  return (
    <div className="glass-card rounded-card p-5 flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Location Details</h2>
        {onClose && (
          <button onClick={onClose} aria-label="Close panel" className="text-text-secondary hover:text-text-primary">
            <X size={18} />
          </button>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">{address}</p>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-status-success">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              Live
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-1">Accuracy · {accuracy} m</p>
      </div>

      <dl className="grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-text-secondary">Latitude</dt>
        <dd className="text-text-primary text-right">{latitude}° N</dd>

        <dt className="text-text-secondary">Longitude</dt>
        <dd className="text-text-primary text-right">{longitude}° E</dd>

        <dt className="text-text-secondary">Last Updated</dt>
        <dd className="text-text-primary text-right">{updatedAt}</dd>

        <dt className="text-text-secondary">Speed</dt>
        <dd className="text-text-primary text-right">{speed} km/h</dd>

        <dt className="text-text-secondary flex items-center gap-1">
          <Battery size={14} /> Battery
        </dt>
        <dd className="text-text-primary text-right">{battery}%</dd>
      </dl>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        <button onClick={onShare} className="glass-card rounded-card py-3 flex flex-col items-center gap-1 text-xs text-text-secondary hover:text-accent-primary">
          <Share2 size={16} />
          Share
        </button>
        <button onClick={onGetDirections} className="glass-card rounded-card py-3 flex flex-col items-center gap-1 text-xs text-text-secondary hover:text-accent-primary">
          <Navigation size={16} />
          Directions
        </button>
        <button onClick={onAddSafeZone} className="glass-card rounded-card py-3 flex flex-col items-center gap-1 text-xs text-text-secondary hover:text-accent-primary">
          <Shield size={16} />
          Safe Zone
        </button>
      </div>
    </div>
  )
}

export default LocationDetailsPanel