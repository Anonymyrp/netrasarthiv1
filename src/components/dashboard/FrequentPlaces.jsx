import { Home, GraduationCap, ArrowRight } from 'lucide-react'

const iconMap = {
  home: Home,
  college: GraduationCap,
}

function FrequentPlaces({ places, onSelectPlace }) {
  return (
    <section className="glass-card rounded-card p-5">
      <h2 className="font-semibold text-text-primary mb-4">Frequently Visited Places</h2>
      <ul className="flex flex-col gap-4">
        {places.map(({ id, name, type, lastVisited }) => {
          const Icon = iconMap[type] || Home
          return (
            <li key={id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-card bg-accent-light flex items-center justify-center text-accent-primary">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{name}</p>
                  <p className="text-xs text-text-secondary">Last visited: {lastVisited}</p>
                </div>
              </div>
              <button onClick={() => onSelectPlace(id)} aria-label={`Open ${name} history`} className="text-text-secondary hover:text-accent-primary">
                <ArrowRight size={16} />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default FrequentPlaces