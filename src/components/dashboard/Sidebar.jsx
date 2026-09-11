import { NavLink } from 'react-router-dom'
import { Home, Radio, MapPin, Video, Bell, Settings, LogOut, X, Menu } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Live Location', path: '/live-location', icon: Radio },
  { label: 'Past Locations', path: '/past-locations', icon: MapPin },
  { label: 'Recordings', path: '/recordings', icon: Video },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar({ userName, userTagline, onLogout }) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        className="fixed top-4 left-4 z-40 w-10 h-10 rounded-card bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent-primary shadow-sm"
      >
        <Menu size={18} />
      </button>
    )
  }

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} glass-card flex flex-col h-screen transition-all duration-200`}>
      <div className="p-6 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent-primary text-white flex items-center justify-center font-semibold">
          NS
        </div>
        <div className="flex-1">
          <p className="font-semibold text-text-primary">Netra Sarthi</p>
          <p className="text-xs text-text-secondary">A safer tomorrow</p>
        </div>
        <button onClick={() => setIsOpen(false)} aria-label="Close sidebar" className="text-text-secondary hover:text-accent-primary">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 mt-3 flex flex-col gap-1.5">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent-light text-accent-primary shadow-sm backdrop-blur-sm'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2.4 : 2} className="shrink-0" />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-secondary text-white flex items-center justify-center text-sm font-semibold">
            {userName?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{userName}</p>
            <p className="text-xs text-text-secondary">{userTagline}</p>
          </div>
        </div>
        <button onClick={onLogout} aria-label="Logout" className="text-text-secondary hover:text-status-error">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar