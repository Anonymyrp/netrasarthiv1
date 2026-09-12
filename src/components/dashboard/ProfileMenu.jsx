import { useState } from 'react'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'

function ProfileMenu({ userName, onSettingsClick, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-semibold">
          {userName?.charAt(0)}
        </div>
        <span className="hidden md:inline text-sm font-medium text-text-primary truncate max-w-[80px] md:max-w-none">{userName}</span>
        <ChevronDown size={16} className="text-text-secondary" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 md:w-48 glass-card rounded-card p-2 flex flex-col gap-1 z-30 shadow-2xl">
          <button className="flex items-center gap-2 px-3 py-2 rounded-card text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary">
            <User size={16} /> Profile
          </button>
          <button onClick={onSettingsClick} className="flex items-center gap-2 px-3 py-2 rounded-card text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary">
            <Settings size={16} /> Settings
          </button>
          <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-card text-sm text-status-error hover:bg-white/5">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu