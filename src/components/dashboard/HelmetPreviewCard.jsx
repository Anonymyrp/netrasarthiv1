import { useState } from 'react'
import { Cpu, Eye, ExternalLink, Activity, Layers } from 'lucide-react'
import HelmetModal from './HelmetModal'

export default function HelmetPreviewCard({ className = '' }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        className={`glass-card p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg border border-white/60 ${className}`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-primary shadow-sm">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary tracking-tight">
                  Hardware Digital Twin
                </h3>
                <p className="text-[11px] text-text-secondary">Smart Helmet 3D Model</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Synced
            </span>
          </div>

          {/* Quick Hardware Spec Grid */}
          <div className="grid grid-cols-2 gap-2 my-3 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white/40 border border-[#3368A0]/10">
              <span className="text-text-muted block text-[10px] uppercase font-mono tracking-wider">Unit / Rev</span>
              <span className="font-semibold text-text-primary">MK3 · Rev C</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/40 border border-[#3368A0]/10">
              <span className="text-text-muted block text-[10px] uppercase font-mono tracking-wider">Sensors</span>
              <span className="font-semibold text-text-primary">GPS + 6-Axis IMU</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            Interactive 360° inspection with X-Ray blueprint schematic scan and live hardware telemetry node mappings.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#3368A0]/10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 btn-primary py-2 px-3 rounded-xl text-xs font-medium text-white flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
          >
            <Eye size={14} />
            <span>Inspect 3D Twin</span>
          </button>

          <a
            href="/helmet-viewer.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-black/5 border border-[#3368A0]/20 transition-all"
            title="Open 3D view in new tab"
            aria-label="Open 3D in new tab"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Interactive Modal */}
      <HelmetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
