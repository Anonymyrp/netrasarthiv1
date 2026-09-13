import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const liveIcon = L.divIcon({
  className: 'live-map-divicon',
  html: '<span class="live-map-pin"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const TILE_LAYERS = {
  dark: {
    label: 'Dark',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  },
  light: {
    label: 'Light',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
  },
}

const VARIANTS = Object.keys(TILE_LAYERS)

function Recenter({ latitude, longitude }) {
  const map = useMap()
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), { animate: true })
  }, [latitude, longitude, map])
  return null
}

function LiveMap({ latitude, longitude, accuracy = 10, zoom = 15, defaultVariant = 'satellite', routePoints = [] }) {
  const [variant, setVariant] = useState(
    TILE_LAYERS[defaultVariant] ? defaultVariant : 'dark'
  )

  const lat = Number(latitude)
  const lng = Number(longitude)

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="glass-card rounded-card h-full min-h-64 flex items-center justify-center">
        <p className="text-sm text-text-secondary">Location unavailable</p>
      </div>
    )
  }

  const layer = TILE_LAYERS[variant]

  return (
    <div className="map-dark rounded-card overflow-hidden h-full min-h-64 w-full relative">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom
        className="live-leaflet"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer key={variant} attribution={layer.attribution} url={layer.url} />
        {routePoints && routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            pathOptions={{ color: '#2F80FF', weight: 4, opacity: 0.8 }}
          />
        )}
        <Circle
          center={[lat, lng]}
          radius={accuracy}
          pathOptions={{ color: '#2F80FF', weight: 1, opacity: 0.5, fillColor: '#2F80FF', fillOpacity: 0.12 }}
        />
        <Marker position={[lat, lng]} icon={liveIcon} />
        <Recenter latitude={lat} longitude={lng} />
      </MapContainer>

      <div
        role="group"
        aria-label="Map style"
        className="absolute top-3 right-3 z-10 flex gap-1 p-1 rounded-card border border-border bg-[rgba(12,26,52,0.72)] backdrop-blur-md shadow-[0_4px_12px_rgba(2,6,16,0.35)]"
      >
        {VARIANTS.map((key) => (
          <button
            key={key}
            onClick={() => setVariant(key)}
            aria-pressed={variant === key}
            className={`px-2.5 py-1 rounded-card text-xs font-medium transition-all duration-150 active:scale-95 ${
              variant === key
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {TILE_LAYERS[key].label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LiveMap
