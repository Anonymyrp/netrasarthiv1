import { useNavigate } from 'react-router-dom'
import { Radio, MapPin, Video } from 'lucide-react'
import WelcomeSection from '../components/dashboard/WelcomeSection'
import ServiceCards from '../components/dashboard/ServiceCards'
import CurrentLocation from '../components/dashboard/CurrentLocation'
import DeviceConnectivity from '../components/dashboard/DeviceConnectivity'
import FrequentPlaces from '../components/dashboard/FrequentPlaces'
import SystemStatus from '../components/dashboard/SystemStatus'
import HelmetPreviewCard from '../components/dashboard/HelmetPreviewCard'
import DashboardSettingsCard from '../components/dashboard/DashboardSettingsCard'
import {
  mockUser,
  mockDeviceStatus,
  mockFrequentPlaces,
  mockSystemStatus,
} from '../data/mockDashboardData'
import { useLiveLocation } from '../hooks/useDashboardData'

function Home() {
  const navigate = useNavigate()
  const { location: liveLoc } = useLiveLocation()
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

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 px-4 md:px-8 pb-5 items-stretch dashboard-primary-row">
        <CurrentLocation
          status={liveLoc.status}
          address={liveLoc.address}
          accuracy={liveLoc.accuracy}
          updatedAt={liveLoc.updatedAt}
          onViewMap={() => navigate('/live-location')}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onLocate={() => {}}
        />
        <HelmetPreviewCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[42fr_33fr_25fr] gap-4 px-4 md:px-8 pb-4 items-stretch dashboard-support-row">
        <DeviceConnectivity {...mockDeviceStatus} />
        <FrequentPlaces places={mockFrequentPlaces} onSelectPlace={() => {}} />
        <DashboardSettingsCard />
      </div>

      <div className="px-4 md:px-8 pb-8">
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
