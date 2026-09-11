import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopHeader from '../components/dashboard/TopHeader'

function DashboardLayout({ user, onLogout, onProfileClick, onNotificationClick, hasUnreadNotifications }) {
  return (
    <div className="flex bg-bg-primary text-text-primary min-h-screen">
      <Sidebar
        userName={user?.name}
        userTagline={user?.tagline}
        onLogout={onLogout}
      />
      <div className="flex-1 min-h-screen bg-bg-primary">
        <TopHeader
          searchPlaceholder="Search locations, dates, or activities..."
          userName={user?.name}
          hasUnreadNotifications={hasUnreadNotifications}
          onProfileClick={onProfileClick}
          onNotificationClick={onNotificationClick}
        />
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout