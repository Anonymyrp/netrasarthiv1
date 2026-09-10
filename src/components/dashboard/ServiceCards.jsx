import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function ServiceCards({ services }) {
  return (
    <section className="grid grid-cols-3 gap-4 px-8 pb-6">
      {services.map(({ title, description, path, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          className="bg-bg-card border border-border rounded-card p-5 flex flex-col gap-3 hover:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-card bg-accent-light flex items-center justify-center text-accent-primary">
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