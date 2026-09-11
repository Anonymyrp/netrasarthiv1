import { Circle } from 'lucide-react'

function RecentActivity({ activities, onViewAll }) {
  return (
    <section className="glass-card rounded-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-text-primary">Recent Activity</h2>
        <button onClick={onViewAll} className="text-sm font-medium text-accent-primary">
          View all
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-text-secondary">No recent activity yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {activities.map(({ id, title, timestamp, note }) => (
            <li key={id} className="flex items-start gap-3">
              <Circle size={10} className="text-accent-primary mt-1.5 fill-accent-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{title}</p>
                <p className="text-xs text-text-secondary">{timestamp}</p>
              </div>
              {note && (
                <span className="text-xs text-text-secondary">{note}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default RecentActivity