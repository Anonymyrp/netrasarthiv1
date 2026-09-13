import { useEffect, useRef, useState } from 'react'
import {
  Siren,
  TriangleAlert,
  PhoneCall,
  Users,
  MessageSquareText,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

const POLICE_NUMBER = '100'
const FRIEND_NAME = 'Mom'
const FRIEND_NUMBER = '+919999999999'

function buildMapsLink(lat, lng) {
  if (lat != null && lng != null) return `https://maps.google.com/?q=${lat},${lng}`
  return 'https://maps.google.com/'
}

function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => resolve(null),
      { timeout: 5000, maximumAge: 60000 }
    )
  })
}

function EmergencyControls() {
  const [open, setOpen] = useState(false)
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [sendingSms, setSendingSms] = useState(false)
  const [notice, setNotice] = useState('')
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 3200)
    return () => clearTimeout(t)
  }, [notice])

  const flashNotice = (msg) => setNotice(msg)

  const handleActivate = () => {
    const next = !emergencyActive
    setEmergencyActive(next)
    try {
      if (navigator.vibrate) navigator.vibrate(next ? [120, 60, 120] : 60)
    } catch {
      /* noop */
    }
    flashNotice(
      next
        ? 'Emergency Mode activated. Contacts will be alerted.'
        : 'Emergency Mode deactivated. You are marked safe.'
    )
  }

  const handleSms = async () => {
    setSendingSms(true)
    try {
      const pos = await getCurrentPosition()
      const link = buildMapsLink(pos?.latitude, pos?.longitude)
      const body = encodeURIComponent(
        `EMERGENCY! I need help. This is ${FRIEND_NAME ? 'an urgent alert' : 'an urgent alert'}. My live location: ${link}`
      )
      // Prefer native SMS composer with live location in body
      window.location.href = `sms:${FRIEND_NUMBER}?&body=${body}`
      flashNotice('Opening SMS composer with live location…')
    } finally {
      setSendingSms(false)
    }
  }

  return (
    <div ref={rootRef} className="emergency-root relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`emergency-trigger flex items-center gap-2 rounded-full px-3 py-2 text-xs ${emergencyActive ? 'is-active' : ''}`}
      >
        <span className={`emergency-dot w-2.5 h-2.5 rounded-full ${emergencyActive ? 'is-active' : ''}`} />
        <span className="font-bold tracking-wide">
          {emergencyActive ? 'Emergency ON' : 'Emergency'}
        </span>
        <ChevronDown
          size={14}
          className={`emergency-chevron transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Emergency Controls"
          className="emergency-panel glass-card rounded-card p-3"
        >
          <div className="flex items-center gap-2.5 px-1.5 pt-1 pb-2.5">
            <span className="emergency-panel-badge">
              <Siren size={16} />
            </span>
            <p className="text-sm font-bold text-text-primary leading-tight">
              Emergency Controls
            </p>
          </div>

          <button
            type="button"
            onClick={handleActivate}
            className={`emergency-activate flex items-center justify-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm font-bold text-white ${emergencyActive ? 'is-active' : ''}`}
          >
            <TriangleAlert size={17} />
            {emergencyActive ? 'Deactivate Emergency Mode' : 'Activate Emergency Mode'}
          </button>

          <div className="flex flex-col gap-2 mt-2">
            <a
              href={`tel:${POLICE_NUMBER}`}
              role="menuitem"
              className="emergency-row group"
            >
              <span className="emergency-row-icon is-red">
                <PhoneCall size={17} />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-[13px] font-semibold text-text-primary leading-tight">
                  Call Police
                </span>
                <span className="block text-[13px] font-bold text-status-error leading-tight mt-0.5">
                  {POLICE_NUMBER}
                </span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" />
            </a>

            <a
              href={`tel:${FRIEND_NUMBER}`}
              role="menuitem"
              className="emergency-row group"
            >
              <span className="emergency-row-icon is-blue">
                <Users size={17} />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-[13px] font-semibold text-text-primary leading-tight">
                  Call Friend
                </span>
                <span className="block text-[13px] font-bold text-status-error leading-tight mt-0.5">
                  {FRIEND_NAME}
                </span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" />
            </a>

            <button
              type="button"
              role="menuitem"
              onClick={handleSms}
              disabled={sendingSms}
              className="emergency-row group w-full text-left disabled:opacity-70"
            >
              <span className="emergency-row-icon is-red">
                <MessageSquareText size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-text-primary leading-tight">
                  {sendingSms ? 'Preparing SMS…' : 'Send Emergency SMS'}
                </span>
                <span className="block text-xs text-text-secondary leading-tight mt-0.5">
                  with live location
                </span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {notice && (
            <p aria-live="polite" className="emergency-notice">
              {notice}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default EmergencyControls
