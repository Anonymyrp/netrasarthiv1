import { Search, Bell, ChevronDown } from 'lucide-react'

function TopHeader({ searchPlaceholder, userName, hasUnreadNotifications, onProfileClick, onNotificationClick }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-bg-primary">
      <div className="flex items-center gap-2 bg-bg-card border border-border rounded-card px-4 py-2 w-96">
        <Search size={16} className="text-text-secondary" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-secondary flex-1"
        />
      </div>

      <div className="flex items-center gap-5">
        <button onClick={onNotificationClick} aria-label="Notifications" className="relative text-text-secondary hover:text-accent-primary">
          <Bell size={20} />
          {hasUnreadNotifications && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-status-error" />
          )}
        </button>

        <button onClick={onProfileClick} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-text-primary text-bg-primary flex items-center justify-center text-sm font-semibold">
            {userName?.charAt(0)}
          </div>
          <span className="text-sm font-medium text-text-primary">{userName}</span>
          <ChevronDown size={16} className="text-text-secondary" />
        </button>
      </div>
    </header>
  )
}

export default TopHeader