import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, Radio, MapPin, Video, Bell, Settings, Cpu, MoreHorizontal, LogOut } from 'lucide-react'
import logo from '../../assets/logo.png'
import ProfileMenu from './ProfileMenu'
import { mockAlerts } from '../../data/mockDashboardData'

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Live Location', path: '/live-location', icon: Radio },
  { label: 'Past Locations', path: '/past-locations', icon: MapPin },
  { label: 'Recordings', path: '/recordings', icon: Video },
  { label: 'Devices', path: '/connected-devices', icon: Cpu },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
]

function DashboardNav({ userName, hasUnreadNotifications, onNotificationClick, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [alerts, setAlerts] = useState(mockAlerts)
  const unreadCount = alerts.filter((alert) => !alert.read).length
  const showDot = hasUnreadNotifications || unreadCount > 0

  const toggleNotifications = () => {
    setNotifOpen((previous) => !previous)
    onNotificationClick?.()
  }

  return (
    <nav className="dashboard-nav" aria-label="Dashboard navigation">
      <NavLink to="/" end className="dashboard-brand" aria-label="Netra Sarthi home">
        <span className="dashboard-brand-mark">
          <img src={logo} alt="" />
        </span>
        <span className="dashboard-brand-copy">
          <strong>Netra Sarthi</strong>
          <span>Care creates freedom</span>
        </span>
      </NavLink>

      <div className="dashboard-nav-links">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `dashboard-nav-link${isActive ? ' is-active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="dashboard-nav-actions">
        <div className="relative">
          <button
            onClick={toggleNotifications}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="dashboard-action-button relative"
          >
            <Bell size={21} />
            {showDot && <span className="dashboard-notification-dot" />}
          </button>

          {notifOpen && (
            <div className="dashboard-notification-menu glass-card rounded-card p-2 z-30 shadow-2xl" role="dialog" aria-label="Notifications">
              <p className="text-sm font-semibold text-text-primary px-3 py-2">Notifications</p>
              <ul className="flex flex-col gap-1 max-h-80 overflow-y-auto">
                {alerts.slice(0, 6).map((alert) => (
                  <li key={alert.id}>
                    <button
                      onClick={() => setAlerts((previous) => previous.map((item) => item.id === alert.id ? { ...item, read: true } : item))}
                      className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-card transition-colors ${alert.read ? '' : 'bg-accent-light'}`}
                    >
                      <span className="mt-1.5 w-2 h-2 rounded-full shrink-0 bg-status-error" />
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-text-primary">{alert.title}</span>
                        <span className="block text-xs text-text-secondary mt-0.5">{alert.timestamp}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-3 pt-2">
                <span className="text-xs text-text-secondary">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</span>
                <Link to="/alerts" onClick={() => setNotifOpen(false)} className="text-sm font-medium text-accent-primary">View all</Link>
              </div>
            </div>
          )}
        </div>

        <ProfileMenu userName={userName} onSettingsClick={() => {}} onLogout={() => onLogout?.()} />
      </div>

      {notifOpen && (
        <button aria-label="Close notifications" onClick={() => setNotifOpen(false)} className="fixed inset-0 z-10 cursor-default bg-transparent border-0 p-0" />
      )}

      <div className="dashboard-mobile-nav" aria-label="Mobile dashboard navigation">
        {navItems.slice(0, 4).map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `dashboard-mobile-nav-link${isActive ? ' is-active' : ''}`}
          >
            <Icon size={19} strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={`dashboard-mobile-nav-link${moreOpen ? ' is-active' : ''}`}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((previous) => !previous)}
        >
          <MoreHorizontal size={20} strokeWidth={2.2} />
          <span>More</span>
        </button>

        {moreOpen && (
          <div className="dashboard-mobile-more-menu">
            {navItems.slice(4).map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className="dashboard-mobile-more-link"
                onClick={() => setMoreOpen(false)}
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
            <button
              type="button"
              className="dashboard-mobile-more-link dashboard-mobile-logout-link"
              onClick={() => {
                setMoreOpen(false)
                onLogout?.()
              }}
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default DashboardNav
