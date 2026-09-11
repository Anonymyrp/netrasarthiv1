import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopHeader from '../components/dashboard/TopHeader'

const pageMeta = {
  '/live-location': { title: 'Live Location' },
  '/past-locations': { title: 'Past Locations' },
  '/recordings': { title: 'Recordings' },
  '/alerts': { title: 'Alerts' },
  '/settings': { title: 'Settings', subtitle: 'Manage your preferences and keep your loved ones safe.' },
}

function DashboardLayout({ user, onLogout, onProfileClick, onNotificationClick, hasUnreadNotifications }) {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] || {}

  return (
    <div className="flex bg-transparent text-text-primary min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 min-h-screen bg-transparent">
        <TopHeader
          title={meta.title}
          subtitle={meta.subtitle}
          userName={user?.name}
          hasUnreadNotifications={hasUnreadNotifications}
          onProfileClick={onProfileClick}
          onNotificationClick={onNotificationClick}
          onLogout={onLogout}
        />
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
