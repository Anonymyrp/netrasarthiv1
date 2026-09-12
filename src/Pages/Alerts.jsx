import { useState } from 'react'
import AlertItem from '../components/alerts/AlertItem'
import { mockAlerts } from '../data/mockDashboardData'

function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts)

  const unreadCount = alerts.filter((alert) => !alert.read).length

  const handleMarkRead = (id) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
  }

  return (
    <div className="px-4 md:px-8 pt-4 pb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'You are all caught up.'}
        </p>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-sm font-medium text-accent-primary hover:text-accent-secondary transition-colors">
            Mark all read
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <p className="text-sm text-text-secondary">No alerts yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {alerts.map(({ id, title, message, timestamp, severity, read }) => (
            <AlertItem
              key={id}
              title={title}
              message={message}
              timestamp={timestamp}
              severity={severity}
              read={read}
              onMarkRead={() => handleMarkRead(id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default Alerts
