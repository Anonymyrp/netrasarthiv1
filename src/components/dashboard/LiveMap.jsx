import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const liveIcon = L.divIcon({
  className: 'live-map-divicon',
  html: '<span class="live-map-pin"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function Recenter({ latitude, longitude }) {
  const map = useMap()
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), { animate: true })
  }, [latitude, longitude, map])
  return null
}

function LiveMap({ latitude, longitude, accuracy = 10, zoom = 15 }) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return (
      <div className="glass-card rounded-card h-full min-h-64 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Location unavailable</p>
      </div>
    )
  }

  return (
    <div className="map-dark rounded-card overflow-hidden h-full min-h-64 w-full">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom
        className="live-leaflet"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Circle
          center={[latitude, longitude]}
          radius={accuracy}
          pathOptions={{ color: '#2F80FF', weight: 1, opacity: 0.5, fillColor: '#2F80FF', fillOpacity: 0.12 }}
        />
        <Marker position={[latitude, longitude]} icon={liveIcon} />
        <Recenter latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  )
}

export default LiveMap
