import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function ServiceCards({ services }) {
  const tileStyles = [
    'glass-icon',
    'glass-icon-cyan',
    'glass-icon',
  ]
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-8 pb-6">
      {services.map(({ title, description, path, icon: Icon }, i) => (
        <Link
          key={path}
          to={path}
          className="glass-card rounded-card p-5 flex flex-col gap-3 hover:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors"
        >
          <div className={`w-10 h-10 rounded-card flex items-center justify-center ${tileStyles[i % tileStyles.length]}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="font-semibold text-text-primary">{title}</p>
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-accent-primary mt-auto">
            Open <ArrowRight size={14} />
          </span>
        </Link>
      ))}
    </section>
  )
}

export default ServiceCards