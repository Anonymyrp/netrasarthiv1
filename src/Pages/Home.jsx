import { Radio, MapPin, Video } from 'lucide-react'
import WelcomeSection from '../components/dashboard/WelcomeSection'
import ServiceCards from '../components/dashboard/ServiceCards'
import CurrentLocation from '../components/dashboard/CurrentLocation'
import RecentActivity from '../components/dashboard/RecentActivity'

function Home() {
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

  const activities = [
    { id: 1, title: 'Reached Home', timestamp: 'Today, 6:12 PM', note: 'At saved place' },
    { id: 2, title: 'Visited Grocery Store', timestamp: 'Today, 4:45 PM', note: 'Routine visit' },
    { id: 3, title: 'Left Office', timestamp: 'Today, 1:23 PM', note: 'On usual route' },
  ]

  return (
    <div>
      <WelcomeSection
        userName="Shreya"
        currentDate={currentDate}
        supportingText="Here's what's happening right now."
        sideText="Stay connected. Support their journey."
      />

      <ServiceCards services={services} />

      <div className="grid grid-cols-3 gap-4 px-8 pb-8">
        <CurrentLocation
          status="active"
          address="MG Road, Pune, Maharashtra"
          accuracy={10}
          updatedAt="2 mins ago"
          onViewMap={() => {}}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onLocate={() => {}}
        />

        <RecentActivity activities={activities} onViewAll={() => {}} />
      </div>
    </div>
  )
}

export default Home