import { useNavigate } from 'react-router-dom'
import { Radio, MapPin, Video } from 'lucide-react'
import WelcomeSection from '../components/dashboard/WelcomeSection'
import ServiceCards from '../components/dashboard/ServiceCards'
import CurrentLocation from '../components/dashboard/CurrentLocation'
import RecentActivity from '../components/dashboard/RecentActivity'
import DeviceConnectivity from '../components/dashboard/DeviceConnectivity'
import FrequentPlaces from '../components/dashboard/FrequentPlaces'
import SystemStatus from '../components/dashboard/SystemStatus'
import HelmetPreviewCard from '../components/dashboard/HelmetPreviewCard'
import {
  mockUser,
  mockCurrentLocation,
  mockRecentActivity,
  mockDeviceStatus,
  mockFrequentPlaces,
  mockSystemStatus,
} from '../data/mockDashboardData'

function Home() {
  const navigate = useNavigate()
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const services = [
    { title: 'Live Location', description: 'Track real-time location and get instant updates.', path: '/live-location', icon: Radio },
    { title: 'Past Locations', description: 'View location history and visited places.', path: '/past-locations', icon: MapPin },
    { title: 'Recordings', description: 'Access and manage video recordings.', path: '/recordings', icon: Video },
  ]

  return (
    <div>
      <WelcomeSection
        userName={mockUser.name}
        currentDate={currentDate}
        supportingText="Here's what's happening right now."
        sideText="Stay connected. Support their journey."
      />

      <ServiceCards services={services} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 pb-4 items-stretch">
        <DeviceConnectivity {...mockDeviceStatus} />
        <HelmetPreviewCard />
        <FrequentPlaces places={mockFrequentPlaces} onSelectPlace={() => {}} />
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 pb-4">
        <CurrentLocation
          status={mockCurrentLocation.status}
          address={mockCurrentLocation.address}
          accuracy={mockCurrentLocation.accuracy}
          updatedAt={mockCurrentLocation.updatedAt}
          onViewMap={() => navigate('/live-location')}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onLocate={() => {}}
        />

        <RecentActivity activities={mockRecentActivity} onViewAll={() => {}} />
      </div>

      <div className="px-8 pb-8">
        <SystemStatus
          status={mockSystemStatus.status}
          message={mockSystemStatus.message}
          onManageAlerts={() => {}}
        />
      </div>
    </div>
  )
}

export default Home
