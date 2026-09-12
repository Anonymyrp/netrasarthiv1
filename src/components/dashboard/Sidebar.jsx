import { NavLink } from 'react-router-dom'
import { Home, Radio, MapPin, Video, Bell, Settings, X, Menu, Cpu } from 'lucide-react'
import { useState } from 'react'
import logo from '../../assets/logo.png'

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Live Location', path: '/live-location', icon: Radio },
  { label: 'Past Locations', path: '/past-locations', icon: MapPin },
  { label: 'Recordings', path: '/recordings', icon: Video },
  { label: 'Connected Devices', path: '/connected-devices', icon: Cpu },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        className="fixed top-4 left-4 z-40 w-10 h-10 rounded-card bg-bg-card border border-border backdrop-blur-xl flex items-center justify-center text-text-secondary hover:text-accent-primary shadow-sm"
      >
        <Menu size={18} />
      </button>
    )
  }

  return (
    <aside className="w-64 glass-sidebar flex flex-col h-screen sticky top-0 transition-all duration-200">
      <div className="p-6 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20 shadow-[0_0_18px_rgba(51,104,160,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]">
          <img
            src={logo}
            alt="Netra Sarthi logo"
            className="h-full w-full object-cover"
            style={{ objectPosition: '50% 30%', transform: 'scale(2.2)' }}
          />
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
                  ? 'nav-active'
                  : 'nav-inactive'
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
    </aside>
  )
}

export default Sidebar