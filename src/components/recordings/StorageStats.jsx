function StorageStats({ usedMb, totalMb }) {
  const percentage = Math.min(100, Math.round((usedMb / totalMb) * 100))

  return (
    <div className="glass-card rounded-card p-4">
      <p className="text-sm font-medium text-text-primary mb-2">Storage</p>
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-accent-primary" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-text-secondary mt-2">{usedMb} MB of {totalMb} MB used</p>
    </div>
  )
}

export default StorageStats