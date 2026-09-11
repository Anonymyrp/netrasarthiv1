import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

const severityIcon = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
}

function AlertItem({ title, message, timestamp, severity, read, onMarkRead }) {
  const Icon = severityIcon[severity] || Info

  return (
    <li className={`glass-card rounded-card p-4 flex items-start gap-3 ${read ? 'opacity-60' : ''}`}>
      <Icon size={18} className={`mt-0.5 ${severity === 'warning' ? 'text-status-warning' : severity === 'success' ? 'text-status-success' : 'text-accent-primary'}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary mt-1">{message}</p>
        <p className="text-xs text-text-secondary mt-1">{timestamp}</p>
      </div>
      {!read && (
        <button onClick={onMarkRead} className="text-xs font-medium text-accent-primary">
          Mark read
        </button>
      )}
    </li>
  )
}

export default AlertItem