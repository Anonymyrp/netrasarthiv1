import { useState } from 'react'
import { Cpu, Eye, ExternalLink, Activity, Layers } from 'lucide-react'
import HelmetModal from './HelmetModal'

export default function HelmetPreviewCard({ className = '' }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        className={`glass-card rounded-2xl relative overflow-hidden dashboard-twin-card ${className}`}
      >
        <div className="dashboard-twin-visual">
          <iframe src="/helmet-viewer.html?embed=preview" title="Smart helmet technical visualization" className="dashboard-twin-viewer" allow="accelerometer; gyroscope" />
        </div>

        <div className="dashboard-twin-details">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-primary shadow-sm">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary tracking-tight">Hardware Digital Twin</h3>
                <p className="text-[11px] text-text-secondary">Smart Helmet</p>
              </div>
            </div>
            <span className="dashboard-sync-badge">
              <span /> Live Synced
            </span>
          </div>

          <div className="dashboard-twin-specs">
            <div><span>UNIT / REV</span><strong>MK3 · Rev C</strong></div>
            <div><span>SENSORS</span><strong>GPS + 6-Axis IMU</strong></div>
            <div><span>BATTERY</span><strong>78% · Charging</strong></div>
            <div><span>CONNECTIVITY</span><strong>Jio 4G · Good</strong></div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Interactive 3D inspection with live hardware telemetry node mappings.
          </p>

          <div className="dashboard-twin-actions">
            <button onClick={() => setIsModalOpen(true)} className="flex-1 btn-primary py-2 px-3 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
              <Eye size={14} />
              <span>Inspect 3D Twin</span>
            </button>
            <a href="/helmet-viewer.html" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-black/5 border border-[#3368A0]/20 transition-all" title="Open 3D view in new tab" aria-label="Open 3D in new tab">
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <HelmetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
