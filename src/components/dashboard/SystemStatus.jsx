import { ShieldCheck, ShieldAlert } from 'lucide-react'

function SystemStatus({ status, message, onManageAlerts }) {
  const isNormal = status === 'normal'

  return (
    <section className="glass-card rounded-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isNormal ? (
          <ShieldCheck size={20} className="text-status-success" />
        ) : (
          <ShieldAlert size={20} className="text-status-warning" />
        )}
        <div>
          <p className="text-sm font-medium text-text-primary">
            {isNormal ? 'All systems are running normally.' : 'Attention needed.'}
          </p>
          <p className="text-xs text-text-secondary">{message}</p>
        </div>
      </div>
      <button onClick={onManageAlerts} className="text-sm font-medium text-accent-primary flex items-center gap-1">
        Manage Alerts
      </button>
    </section>
  )
}

export default SystemStatus