import React, { useEffect, useRef } from 'react';
import { X, Download, ExternalLink, Clock, HardDrive, AlertCircle } from 'lucide-react';

export default function VideoPlayerModal({ video, onClose }) {
  const videoRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const videoUrl = video.videoUrl || video.url || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
          <div className="flex flex-col min-w-0 pr-4">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">
              {video.title || 'Emergency Recording'}
            </h3>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-blue-400" /> {video.duration || '0:10'}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive size={12} className="text-blue-400" /> {video.size || '1.1 MB'}
              </span>
              <span>{video.timeAgo || 'Recently'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {videoUrl && (
              <>
                <a
                  href={videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                  title="Download Video"
                >
                  <Download size={18} />
                </a>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                  title="Open video directly"
                >
                  <ExternalLink size={18} />
                </a>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-slate-200 hover:text-white transition-colors"
              title="Close modal (Esc)"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            <video
              ref={videoRef}
              poster={video.thumbnail || undefined}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              <source src={videoUrl} type="video/mp4" />
              <p className="text-slate-400 text-sm text-center p-6">
                Your browser cannot stream this format directly.{' '}
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Click here to open or download the video.
                </a>
              </p>
            </video>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 p-8 text-center">
              <AlertCircle size={36} className="text-amber-400" />
              <p className="text-sm">Video stream URL unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
