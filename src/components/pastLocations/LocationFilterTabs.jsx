function LocationFilterTabs({ filters, activeFilter, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`px-4 py-1.5 rounded-card text-sm font-medium transition-colors ${
            activeFilter === filter.value
              ? 'bg-accent-light text-accent-primary'
              : 'text-text-secondary hover:bg-white/5'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default LocationFilterTabs