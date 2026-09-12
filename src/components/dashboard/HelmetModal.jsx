import { useEffect } from 'react'
import { X, Maximize2, Shield, Cpu } from 'lucide-react'

export default function HelmetModal({ isOpen, onClose, deviceId = 'netra-helmet-01' }) {
  useEffect(() => {
    if (!isOpen) return

    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden'

    const handleMessage = (e) => {
      if (e.data?.type === 'CLOSE_HELMET_MODAL') {
        onClose()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#10254e]/65 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="helmet-modal-title"
    >
      <div className="w-full h-full max-w-7xl max-h-[94vh] glass-card rounded-2xl overflow-hidden relative shadow-2xl flex flex-col border border-white/50 bg-[#F2EFE7]/90">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#3368A0]/15 bg-white/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-primary">
              <Cpu size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="helmet-modal-title" className="text-sm md:text-base font-semibold text-text-primary">
                  Netra Sarthi Digital Twin
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync · {deviceId}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary hidden sm:block">
                Interactive 360° Hardware Model & Blueprint Schematic Pass
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <a
              href="/helmet-viewer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 border border-[#3368A0]/20 transition-all"
              title="Open full screen in new tab"
            >
              <Maximize2 size={13} />
              <span>Full Tab</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-[#1E3A54] hover:bg-red-500/10 hover:text-red-600 border border-transparent hover:border-red-500/30 transition-all flex items-center gap-1.5"
              aria-label="Close 3D Viewer"
            >
              <X size={16} />
              <span className="hidden sm:inline font-mono">ESC</span>
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas Frame */}
        <div className="flex-1 w-full h-full relative bg-[#86a8de]">
          <iframe
            src="/helmet-viewer.html"
            title="Netra Sarthi 3D Helmet Prototype"
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; gyroscope"
          />
        </div>
      </div>
    </div>
  )
}
