import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, ExternalLink, Clock, HardDrive, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import JMuxer from 'jmuxer';

export default function VideoPlayerModal({ video, onClose }) {
  const videoRef = useRef(null);
  const jmuxerRef = useRef(null);
  const [streamType, setStreamType] = useState('loading'); // 'loading' | 'mp4' | 'raw_h264'
  const [statusMessage, setStatusMessage] = useState('Analyzing stream format...');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const rawBytesRef = useRef(null);
  const isMseReadyRef = useRef(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const feedH264Data = useCallback((bytes) => {
    if (!jmuxerRef.current || !bytes || bytes.length === 0) return;
    try {
      jmuxerRef.current.feed({ video: bytes });
      setStatusMessage('');
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay may be deferred until user interaction
        });
      }
    } catch (feedErr) {
      console.warn('JMuxer feed error:', feedErr);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const videoUrl = video?.videoUrl || video?.url;
    if (!videoUrl) return;

    const initPlayer = async () => {
      try {
        setStatusMessage('Inspecting stream container...');

        // Fetch first 64 bytes to detect MP4 ftyp container box
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

          isMseReadyRef.current = false;

          // CRITICAL: flushingTime must be > 0 and clearBuffer: false so cancelDelay()
          // does not seek to the end of the static recording!
          const jmuxer = new JMuxer({
            node: videoRef.current,
            mode: 'video',
            flushingTime: 1000,
            clearBuffer: false,
            maxDelay: 10000000,
            fps: 25,
            debug: false,
            onReady: () => {
              isMseReadyRef.current = true;
              if (rawBytesRef.current && isMounted) {
                feedH264Data(rawBytesRef.current);
              }
            },
            onError: (err) => console.warn('JMuxer MSE warning:', err),
          });
          jmuxerRef.current = jmuxer;

          // Fetch video payload
          const fullRes = await fetch(videoUrl);
          const fullBuf = new Uint8Array(await fullRes.arrayBuffer());
          rawBytesRef.current = fullBuf;

          if (!isMounted) return;

          // If onReady already fired, feed immediately; otherwise onReady callback will feed
          if (isMseReadyRef.current) {
            feedH264Data(fullBuf);
          }
        }
      } catch (err) {
        console.warn('Playback probe fallback to native:', err);
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
      isMseReadyRef.current = false;
    };
  }, [video, feedH264Data]);

  const handleReplay = () => {
    if (streamType === 'raw_h264' && rawBytesRef.current && videoRef.current) {
      if (jmuxerRef.current) {
        try {
          jmuxerRef.current.destroy();
        } catch (_) {}
      }
      isMseReadyRef.current = false;
      const jmuxer = new JMuxer({
        node: videoRef.current,
        mode: 'video',
        flushingTime: 1000,
        clearBuffer: false,
        maxDelay: 10000000,
        fps: 25,
        debug: false,
        onReady: () => {
          isMseReadyRef.current = true;
          feedH264Data(rawBytesRef.current);
        },
      });
      jmuxerRef.current = jmuxer;
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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (!isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatSecs = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
                  H.264 Hardware Remux
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
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
              title="Replay from start"
            >
              <RotateCcw size={14} /> Replay
            </button>
            {videoUrl && (
              <>
                <a
                  href={videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                  title="Download Raw Video"
                >
                  <Download size={18} />
                </a>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
                  title="Open direct URL"
                >
                  <ExternalLink size={18} />
                </a>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-slate-200 hover:text-white transition-colors"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            poster={video.thumbnail || undefined}
            controls
            autoPlay
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlayPause}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Centered Play overlay when paused */}
          {!isPlaying && !statusMessage && (
            <button
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              aria-label="Play"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-110">
                <Play size={28} className="translate-x-0.5" />
              </div>
            </button>
          )}

          {/* Loading status overlay */}
          {statusMessage && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white gap-3 pointer-events-none">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-200">{statusMessage}</p>
            </div>
          )}
        </div>

        {/* Informational Sub-footer with playback controls */}
        <div className="px-5 py-3 bg-white/[0.03] border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {isMuted ? 'Unmute' : 'Muted'}
            </button>

            <span className="font-mono text-slate-400">
              {formatSecs(currentTime)} / {formatSecs(duration || (parseFloat(video.duration) * 60) || 10)}
            </span>
          </div>

          <span className="text-slate-400 hidden sm:inline">
            {streamType === 'raw_h264'
              ? 'Raw H.264 camera stream dynamically remuxed via MediaSource.'
              : 'Progressive MP4 container stream.'}
          </span>
        </div>
      </div>
    </div>
  );
}
