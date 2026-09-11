import { MapPin } from 'lucide-react'

function HistoryList({ entries, selectedId, onSelectEntry }) {
  if (entries.length === 0) {
    return <p className="text-sm text-text-secondary p-4">No location history for this period.</p>
  }

  return (
    <ul className="flex flex-col gap-2 overflow-y-auto h-full">
      {entries.map(({ id, address, timestamp, accuracy }) => (
        <li key={id}>
          <button
            onClick={() => onSelectEntry(id)}
            className={`w-full text-left glass-card rounded-card p-3 flex items-start gap-3 transition-colors ${
              selectedId === id ? 'border-accent-primary' : ''
            }`}
          >
            <MapPin size={16} className="text-accent-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">{address}</p>
              <p className="text-xs text-text-secondary">{timestamp} · Accuracy ± {accuracy} m</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default HistoryList