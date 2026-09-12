import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import ProfileMenu from './ProfileMenu'
import { mockAlerts } from '../../data/mockDashboardData'

const severityDot = {
  warning: 'bg-status-warning',
  success: 'bg-status-success',
  info: 'bg-accent-primary',
}

function TopHeader({ title, subtitle, userName, hasUnreadNotifications, onProfileClick, onNotificationClick, onLogout, onSettingsClick }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [alerts, setAlerts] = useState(mockAlerts)
  const navigate = useNavigate()

  const unreadCount = alerts.filter((alert) => !alert.read).length
  const showDot = hasUnreadNotifications || unreadCount > 0

  const toggleNotif = () => {
    setNotifOpen((prev) => !prev)
    onNotificationClick?.()
  }

  const handleSelectAlert = (id) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const handleSettings = () => {
    if (onSettingsClick) onSettingsClick()
    else navigate('/settings')
  }

  return (
    <header className="flex items-center justify-between gap-4 px-4 md:px-8 pt-6 pb-4 bg-transparent">
      <div className="min-w-0">
        {title && (
          <>
            <h1 className="text-xl font-bold tracking-tight text-text-primary leading-tight truncate">{title}</h1>
            {subtitle && <p className="text-sm text-text-secondary mt-0.5 truncate">{subtitle}</p>}
          </>
        )}
      </div>
      <div className="flex items-center gap-3 md:gap-5 shrink-0">
        <div className="relative">
          <button
            onClick={toggleNotif}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="relative text-text-secondary hover:text-accent-primary transition-colors"
          >
            <Bell size={20} />
            {showDot && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-status-error" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 md:right-0 mt-2 w-[calc(100vw-2rem)] max-w-[18rem] md:max-w-[22rem] md:w-72 glass-card rounded-card p-2 z-30 shadow-2xl">
              <p className="text-sm font-semibold text-text-primary px-3 py-2">Notifications</p>
              {alerts.length === 0 ? (
                <p className="text-sm text-text-secondary px-3 py-2">No notifications yet.</p>
              ) : (
                <ul className="flex flex-col gap-1 max-h-80 overflow-y-auto">
                  {alerts.slice(0, 6).map((alert) => (
                    <li key={alert.id}>
                      <button
                        onClick={() => handleSelectAlert(alert.id)}
                        className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-card transition-colors ${
                          alert.read ? '' : 'bg-accent-light'
                        }`}
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${severityDot[alert.severity] || severityDot.info}`} />
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-text-primary">{alert.title}</span>
                          <span className="block text-xs text-text-secondary mt-0.5">{alert.timestamp}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between px-3 pt-2">
                <span className="text-xs text-text-secondary">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </span>
                <Link
                  to="/alerts"
                  onClick={() => setNotifOpen(false)}
                  className="text-sm font-medium text-accent-primary hover:text-accent-secondary transition-colors"
                >
                  View all
                </Link>
              </div>
            </div>
          )}
        </div>

        <ProfileMenu
          userName={userName}
          onSettingsClick={handleSettings}
          onLogout={() => onLogout?.()}
        />
      </div>

      {notifOpen && (
        <button
          aria-label="Close notifications"
          onClick={() => setNotifOpen(false)}
          className="fixed inset-0 z-10 cursor-default bg-transparent border-0 p-0"
        />
      )}
    </header>
  )
}

export default TopHeader
