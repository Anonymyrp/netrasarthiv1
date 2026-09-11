import { Smartphone, Battery, Wifi, Satellite, RefreshCw } from 'lucide-react'

function DeviceConnectivity({ connected, battery, charging, networkStatus, gpsStatus, accuracy, lastSync }) {
  return (
    <section className="glass-card rounded-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <Smartphone size={18} className="text-accent-primary" />
          Device Connectivity
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-status-success' : 'bg-status-error'}`} />
          <span className="text-text-secondary">{connected ? 'Connected' : 'Disconnected'}</span>
          <span className="text-text-secondary">· Last sync: {lastSync}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <Battery size={18} className="text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">{battery}%</span>
          <span className="text-xs text-text-secondary">{charging ? 'Charging' : 'Not charging'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Wifi size={18} className="text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">{networkStatus}</span>
          <span className="text-xs text-text-secondary">Network</span>
        </div>
        <div className="flex flex-col gap-1">
          <Satellite size={18} className="text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">{gpsStatus}</span>
          <span className="text-xs text-text-secondary">Accuracy ± {accuracy} m</span>
        </div>
        <div className="flex flex-col gap-1">
          <RefreshCw size={18} className="text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">{lastSync}</span>
          <span className="text-xs text-text-secondary">Device Sync</span>
        </div>
      </div>
    </section>
  )
}

export default DeviceConnectivity