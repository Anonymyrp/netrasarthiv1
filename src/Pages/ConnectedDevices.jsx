import { useState } from 'react'
import { Smartphone, Battery, Wifi, Satellite, RefreshCw, MapPin, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react'
import { mockDeviceStatus } from '../data/mockDashboardData'
import HelmetModal from '../components/dashboard/HelmetModal'

const capabilities = [
  { icon: Satellite, title: 'High-accuracy positioning', description: 'GPS fixes within a few metres, outdoors and on the move.' },
  { icon: MapPin, title: 'Live journey sharing', description: 'Family sees movement update in near real time.' },
  { icon: ShieldCheck, title: 'Safe-zone watch', description: 'Entry and exit alerts for every saved place.' },
]

function ConnectedDevices() {
  const [lastSync, setLastSync] = useState(mockDeviceStatus.lastSync)
  const [refreshing, setRefreshing] = useState(false)
  const [isHelmetModalOpen, setIsHelmetModalOpen] = useState(false)

  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    setTimeout(() => {
      setLastSync('Just now')
      setRefreshing(false)
    }, 900)
  }

  const stats = [
    { icon: Battery, value: `${mockDeviceStatus.battery}%`, label: mockDeviceStatus.charging ? 'Charging' : 'Not charging' },
    { icon: Wifi, value: mockDeviceStatus.networkStatus, label: 'Network' },
    { icon: Satellite, value: mockDeviceStatus.gpsStatus, label: `Accuracy ± ${mockDeviceStatus.accuracy} m` },
    { icon: RefreshCw, value: lastSync, label: 'Device Sync' },
  ]

  return (
    <div className="px-8 py-6 flex flex-col gap-4 max-w-6xl mx-auto w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Connected Devices</h1>
          <p className="text-sm text-text-secondary mt-1">Devices linked to this account.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-glass px-4 py-2 text-sm font-medium flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Syncing…' : 'Refresh status'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 items-start">
        <div className="col-span-2 flex flex-col gap-4">
          {/* Device 1: Smart Helmet */}
          <section className="glass-card rounded-card p-6 border border-accent-primary/25 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-accent-primary/10 border border-accent-primary/30 text-accent-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text-primary">Netra Sarthi Smart Helmet</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-primary/15 text-accent-primary border border-accent-primary/30">
                    MK3-A07
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">Physical Safety Unit · IoT Telemetry Ingestion</p>
              </div>
              <span className="live-badge flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#3368A0]/10">
              <div className="flex flex-col gap-1.5">
                <Battery size={18} className="text-accent-primary" />
                <span className="text-sm font-semibold text-text-primary">88%</span>
                <span className="text-xs text-text-secondary">Solar assisted</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Wifi size={18} className="text-accent-primary" />
                <span className="text-sm font-semibold text-text-primary">4G LTE</span>
                <span className="text-xs text-text-secondary">Signal: Excellent</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Satellite size={18} className="text-accent-primary" />
                <span className="text-sm font-semibold text-text-primary">RTK Fix</span>
                <span className="text-xs text-text-secondary">Accuracy ± 0.6 m</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <RefreshCw size={18} className="text-accent-primary" />
                <span className="text-sm font-semibold text-text-primary">Streaming</span>
                <span className="text-xs text-text-secondary">Live telemetry</span>
              </div>
            </div>

            {/* 3D Action Footer */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#3368A0]/10 bg-white/20 -mx-6 -mb-6 px-6 py-3.5">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-accent-primary/60" />
                Interactive WebGL 3D Model & Wireframe Blueprint Available
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHelmetModalOpen(true)}
                  className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-medium text-white flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <Cpu size={14} />
                  <span>Inspect 3D Digital Twin</span>
                </button>
              </div>
            </div>
          </section>

          {/* Device 2: Mobile Companion */}
          <section className="glass-card rounded-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-card glass-icon flex items-center justify-center shrink-0">
                <Smartphone size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary">Shreya&apos;s Phone</p>
                <p className="text-xs text-text-secondary mt-0.5">Primary tracker · Android</p>
              </div>
              <span className="live-badge flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                {mockDeviceStatus.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <Icon size={18} className="text-accent-primary" />
                  <span className="text-sm font-semibold text-text-primary">{value}</span>
                  <span className="text-xs text-text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="glass-card rounded-card p-6 sticky top-6">
          <h2 className="font-semibold text-text-primary">Hardware Capabilities</h2>
          <ul className="flex flex-col gap-4 mt-4">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-status-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                    <Icon size={14} className="text-accent-primary" />
                    {title}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <HelmetModal
        isOpen={isHelmetModalOpen}
        onClose={() => setIsHelmetModalOpen(false)}
        deviceId="netra-helmet-01"
      />
    </div>
  )
}

export default ConnectedDevices
