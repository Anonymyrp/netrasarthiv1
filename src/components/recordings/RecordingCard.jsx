import { Play, Clock, HardDrive } from 'lucide-react'

function RecordingCard({ title, timeAgo, duration, size, thumbnail, onPlay }) {
  return (
    <button onClick={onPlay} className="glass-card rounded-card overflow-hidden text-left flex flex-col group">
      <div className="relative h-32 bg-white/5 flex items-center justify-center">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Play size={24} className="text-text-secondary" />
        )}
        <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Play size={28} className="text-white" />
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary truncate">{title}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
          <span className="flex items-center gap-1"><Clock size={12} /> {duration}</span>
          <span className="flex items-center gap-1"><HardDrive size={12} /> {size}</span>
        </div>
        <p className="text-xs text-text-secondary mt-1">{timeAgo}</p>
      </div>
    </button>
  )
}

export default RecordingCard