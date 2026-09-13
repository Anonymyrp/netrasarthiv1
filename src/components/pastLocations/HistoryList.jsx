import { MapPin, ExternalLink } from 'lucide-react'

function HistoryList({ entries, selectedId, onSelectEntry }) {
  if (entries.length === 0) {
    return <p className="text-sm text-text-secondary p-4">No location history for this period.</p>
  }

  return (
    <ul className="flex flex-col gap-2 overflow-y-auto h-full">
      {entries.map(({ id, address, timestamp, accuracy, latitude, longitude, google_maps }) => {
        const mapsUrl = google_maps || `https://www.google.com/maps?q=${latitude},${longitude}`
        const hasCoords = latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)

        return (
          <li key={id}>
            <div
              onClick={() => onSelectEntry(id)}
              className={`w-full text-left glass-card rounded-card p-3 flex items-start justify-between gap-2 transition-colors cursor-pointer hover:border-[rgba(47,128,255,0.4)] ${
                selectedId === id ? 'border-accent-primary ring-1 ring-accent-primary/40' : ''
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <MapPin size={16} className="text-accent-primary mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">{address}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{timestamp} · Accuracy ± {accuracy} m</p>
                  {hasCoords && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Click to view in Google Maps"
                      className="inline-flex items-center gap-1 text-[11px] text-accent-primary hover:underline mt-1 font-medium group"
                    >
                      <span>{Number(latitude).toFixed(5)}°, {Number(longitude).toFixed(5)}°</span>
                      <ExternalLink size={10} className="opacity-75 group-hover:opacity-100" />
                    </a>
                  )}
                </div>
              </div>

              {hasCoords && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="View in Google Maps"
                  className="shrink-0 p-1.5 rounded-card text-text-secondary hover:text-accent-primary hover:bg-[rgba(47,128,255,0.12)] transition-colors"
                >
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default HistoryList