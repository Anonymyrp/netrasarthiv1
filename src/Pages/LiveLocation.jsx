import LiveMap from '../components/dashboard/LiveMap'
import LocationDetailsPanel from './LocationDetailsPanel'
import { mockCurrentLocation } from '../data/mockDashboardData'

function LiveLocation() {
  return (
    <div className="grid grid-cols-3 gap-4 px-8 py-6 h-[calc(100vh-88px)]">
      <div className="col-span-2 h-full">
        <LiveMap
          latitude={mockCurrentLocation.latitude}
          longitude={mockCurrentLocation.longitude}
          accuracy={mockCurrentLocation.accuracy}
          zoom={15}
        />
      </div>

      <LocationDetailsPanel
        address={mockCurrentLocation.address}
        isLive={mockCurrentLocation.status === 'active'}
        accuracy={mockCurrentLocation.accuracy}
        latitude={mockCurrentLocation.latitude}
        longitude={mockCurrentLocation.longitude}
        updatedAt={mockCurrentLocation.updatedAt}
        speed={mockCurrentLocation.speed}
        battery={mockCurrentLocation.battery}
        onShare={() => {}}
        onGetDirections={() => {}}
        onAddSafeZone={() => {}}
      />
    </div>
  )
}

export default LiveLocation