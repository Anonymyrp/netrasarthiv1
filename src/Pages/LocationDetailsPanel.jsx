import { X, Share2, Navigation, Shield, Battery, ExternalLink, MapPin } from 'lucide-react'

function LocationDetailsPanel({ address, isLive, accuracy, latitude, longitude, updatedAt, speed, battery, onShare, onGetDirections, onAddSafeZone, onClose }) {
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

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

      {/* Quick Google Maps Redirect Banner */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Open coordinates in Google Maps"
        className="flex items-center justify-between px-3 py-2.5 rounded-card bg-[rgba(47,128,255,0.1)] border border-[rgba(47,128,255,0.3)] hover:bg-[rgba(47,128,255,0.2)] hover:border-accent-primary transition-all text-xs text-accent-primary font-medium group"
      >
        <span className="flex items-center gap-2">
          <MapPin size={15} />
          View in Google Maps
        </span>
        <ExternalLink size={13} className="opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
      </a>

      <dl className="grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-text-secondary">Latitude</dt>
        <dd className="text-right">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to view in Google Maps"
            className="text-accent-primary hover:underline font-medium inline-flex items-center gap-1 group cursor-pointer"
          >
            {latitude}° N
            <ExternalLink size={11} className="opacity-70 group-hover:opacity-100" />
          </a>
        </dd>

        <dt className="text-text-secondary">Longitude</dt>
        <dd className="text-right">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to view in Google Maps"
            className="text-accent-primary hover:underline font-medium inline-flex items-center gap-1 group cursor-pointer"
          >
            {longitude}° E
            <ExternalLink size={11} className="opacity-70 group-hover:opacity-100" />
          </a>
        </dd>

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
        <button onClick={onShare} className="glass-card rounded-card py-3 flex flex-col items-center gap-1 text-xs text-text-secondary hover:text-accent-primary transition-colors">
          <Share2 size={16} />
          Share
        </button>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card rounded-card py-3 flex flex-col items-center justify-center gap-1 text-xs text-text-secondary hover:text-accent-primary transition-colors text-center"
        >
          <Navigation size={16} />
          Directions
        </a>
        <button onClick={onAddSafeZone} className="glass-card rounded-card py-3 flex flex-col items-center gap-1 text-xs text-text-secondary hover:text-accent-primary transition-colors">
          <Shield size={16} />
          Safe Zone
        </button>
      </div>
    </div>
  )
}

export default LocationDetailsPanel