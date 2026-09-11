import LiveMap from '../components/dashboard/LiveMap'
import LocationDetailsPanel from './LocationDetailsPanel'
import { mockCurrentLocation } from '../data/mockDashboardData'

function LiveLocation() {
  const handleShare = async () => {
    const { latitude, longitude, address } = mockCurrentLocation
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
    const text = `Live location: ${address} (${latitude}, ${longitude})`

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Live Location', text, url: mapsUrl })
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${text} ${mapsUrl}`)
        alert('Location link copied to clipboard')
        return
      }
      const textarea = document.createElement('textarea')
      textarea.value = `${text} ${mapsUrl}`
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Location link copied to clipboard')
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 px-8 pt-4 pb-6 h-[calc(100vh-88px)]">
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
        onShare={handleShare}
        onGetDirections={() => {}}
        onAddSafeZone={() => {}}
      />
    </div>
  )
}

export default LiveLocation
