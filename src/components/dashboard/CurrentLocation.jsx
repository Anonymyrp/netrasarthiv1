import { MapPin, Plus, Minus, LocateFixed } from 'lucide-react'

function CurrentLocation({ status, address, accuracy, updatedAt, onViewMap, onZoomIn, onZoomOut, onLocate }) {
  return (
    <section className="glass-card rounded-card p-5 col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <MapPin size={18} className="text-accent-primary" />
          Current Location
        </h2>
      </div>

      <div className="relative bg-bg-secondary rounded-card h-64 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-accent-primary ring-8 ring-accent-light" />

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={onZoomIn} aria-label="Zoom in" className="w-8 h-8 rounded-card bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent-primary">
            <Plus size={16} />
          </button>
          <button onClick={onZoomOut} aria-label="Zoom out" className="w-8 h-8 rounded-card bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent-primary">
            <Minus size={16} />
          </button>
          <button onClick={onLocate} aria-label="Locate" className="w-8 h-8 rounded-card bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent-primary">
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
        <button onClick={onViewMap} className="text-sm font-medium text-accent-primary flex items-center gap-1">
          View on Map
        </button>
      </div>
    </section>
  )
}

export default CurrentLocation