import React, { useEffect, useRef, useState } from 'react';
import { X, Download, ExternalLink, Clock, HardDrive, AlertCircle, RotateCcw, Play, Pause } from 'lucide-react';
import JMuxer from 'jmuxer';

export default function VideoPlayerModal({ video, onClose }) {
  const videoRef = useRef(null);
  const jmuxerRef = useRef(null);
  const [streamType, setStreamType] = useState('loading'); // 'loading' | 'mp4' | 'raw_h264'
  const [statusMessage, setStatusMessage] = useState('Initializing stream...');
  const [isPlaying, setIsPlaying] = useState(false);
  const rawBytesRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    const videoUrl = video?.videoUrl || video?.url;
    if (!videoUrl) return;

    const initPlayer = async () => {
      try {
        setStatusMessage('Inspecting stream format...');

        // Fast probe: check first 64 bytes for MP4 ftyp container box
        const probeRes = await fetch(videoUrl, { headers: { Range: 'bytes=0-63' } });
        const probeBuf = new Uint8Array(await probeRes.arrayBuffer());

        let hasFtyp = false;
        for (let i = 0; i < probeBuf.length - 4; i++) {
          if (
            probeBuf[i] === 0x66 && // 'f'
            probeBuf[i + 1] === 0x74 && // 't'
            probeBuf[i + 2] === 0x79 && // 'y'
            probeBuf[i + 3] === 0x70 // 'p'
          ) {
            hasFtyp = true;
            break;
          }
        }

        if (!isMounted) return;

        if (hasFtyp) {
          // Standard MP4 container: stream natively with HTML5
          setStreamType('mp4');
          setStatusMessage('');
          if (videoRef.current) {
            videoRef.current.src = videoUrl;
            videoRef.current.play().catch(() => {});
          }
        } else {
          // Raw H.264 camera bitstream: remux in real-time using JMuxer MSE
          setStreamType('raw_h264');
          setStatusMessage('Demuxing raw H.264 camera stream in real-time...');

          if (!videoRef.current) return;

          const jmuxer = new JMuxer({
            node: videoRef.current,
            mode: 'video',
            flushingTime: 0,
            fps: 25,
            debug: false,
          });
          jmuxerRef.current = jmuxer;

          // Fetch video payload and feed into JMuxer MSE buffer
          const fullRes = await fetch(videoUrl);
          const fullBuf = new Uint8Array(await fullRes.arrayBuffer());
          rawBytesRef.current = fullBuf;

          if (!isMounted) return;

          jmuxer.feed({ video: fullBuf });
          setStatusMessage('');

          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Probe error, falling back to native player:', err);
        if (!isMounted) return;
        setStreamType('mp4');
        setStatusMessage('');
        if (videoRef.current) {
          videoRef.current.src = videoUrl;
        }
      }
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (jmuxerRef.current) {
        try {
          jmuxerRef.current.destroy();
        } catch (_) {}
        jmuxerRef.current = null;
      }
      rawBytesRef.current = null;
    };
  }, [video]);

  const handleReplayRaw = () => {
    if (streamType === 'raw_h264' && rawBytesRef.current && jmuxerRef.current && videoRef.current) {
      try {
        jmuxerRef.current.destroy();
      } catch (_) {}
      const jmuxer = new JMuxer({
        node: videoRef.current,
        mode: 'video',
        flushingTime: 0,
        fps: 25,
        debug: false,
      });
      jmuxerRef.current = jmuxer;
      jmuxer.feed({ video: rawBytesRef.current });
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

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
        className="relative w-full max-w-4xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
          <div className="flex flex-col min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                {video.title || 'Emergency Recording'}
              </h3>
              {streamType === 'raw_h264' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  H.264 Remuxed
                </span>
              )}
              {streamType === 'mp4' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  MP4 Progressive
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
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
            {streamType === 'raw_h264' && (
              <button
                onClick={handleReplayRaw}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs border border-emerald-500/40 transition-colors"
                title="Replay from beginning"
              >
                <RotateCcw size={14} /> Replay
              </button>
            )}
            {videoUrl && (
              <>
                <a
                  href={videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                  title="Download Video File"
                >
                  <Download size={18} />
                </a>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                  title="Open in new tab"
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
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            poster={video.thumbnail || undefined}
            controls
            autoPlay
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Loading or Status Overlay */}
          {statusMessage && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white gap-3 pointer-events-none">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-200">{statusMessage}</p>
            </div>
          )}
        </div>

        {/* Informational Sub-footer */}
        <div className="px-5 py-2.5 bg-white/[0.03] border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>
            {streamType === 'raw_h264'
              ? 'Raw camera stream decoded using in-browser H.264 MSE remuxer.'
              : 'Direct MP4 ISO BMFF container playback.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />} {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span>•</span>
            <button onClick={handleReplayRaw} className="hover:text-white transition-colors flex items-center gap-1">
              <RotateCcw size={12} /> Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
