import { useEffect, useState } from 'react'
import {
  Bell,
  MapPin,
  ShieldCheck,
  Lock,
  Smartphone,
  Palette,
  HelpCircle,
  Battery,
  Mail,
  AlertTriangle,
  Crosshair,
  Shield,
  BellRing,
  Eye,
  History,
  Activity,
  ChevronRight,
} from 'lucide-react'
import ToggleSwitch from '../components/settings/ToggleSwitch'
import { mockDeviceStatus } from '../data/mockDashboardData'

const tabs = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'location', label: 'Location & Alerts', icon: MapPin },
  { id: 'account', label: 'Account & Security', icon: ShieldCheck },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'devices', label: 'Connected Devices', icon: Smartphone },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
]

const panelMeta = {
  notifications: {
    title: 'Notification Preferences',
    subtitle: 'Choose what you want to be notified about.',
  },
  location: {
    title: 'Location & Alert Preferences',
    subtitle: 'Control how location is tracked and when you are alerted.',
  },
  account: {
    title: 'Account & Security',
    subtitle: 'Manage access to your caretaker account.',
  },
  privacy: {
    title: 'Privacy',
    subtitle: 'Decide what location data is shared and stored.',
  },
  devices: {
    title: 'Connected Devices',
    subtitle: 'Devices linked to this account.',
  },
  appearance: {
    title: 'Appearance',
    subtitle: 'Tune how the dashboard looks.',
  },
  help: {
    title: 'Help & Support',
    subtitle: 'Get help with Netra Sarthi.',
  },
}

function PreferenceRow({ icon: Icon, title, description, checked, onChange, tone }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div
        className={`w-10 h-10 rounded-card flex items-center justify-center shrink-0 ${
          tone === 'red' ? 'bg-status-error/10 text-status-error' : 'glass-icon'
        }`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
      </div>
      <ToggleSwitch label="" checked={checked} onChange={onChange} />
    </div>
  )
}

function Settings() {
  const [activeTab, setActiveTab] = useState('notifications')

  const [notifications, setNotifications] = useState({
    caretakerAlerts: true,
    lowBattery: true,
    weeklySummary: false,
    emergency: true,
  })

  const [locationPrefs, setLocationPrefs] = useState({
    highAccuracyMode: true,
    safeZoneAlerts: true,
    arrivalAlerts: true,
  })

  const [privacyPrefs, setPrivacyPrefs] = useState({
    shareLive: true,
    saveHistory: true,
    diagnostics: false,
  })

  const [showBackground, setShowBackground] = useState(true)

  useEffect(() => {
    document.body.classList.toggle('no-bg-image', !showBackground)
    return () => document.body.classList.remove('no-bg-image')
  }, [showBackground])

  const updateGroup = (setter) => (key, value) => {
    setter((prev) => ({ ...prev, [key]: value }))
  }
  const updateNotifications = updateGroup(setNotifications)
  const updateLocationPrefs = updateGroup(setLocationPrefs)
  const updatePrivacyPrefs = updateGroup(setPrivacyPrefs)

  const meta = panelMeta[activeTab]

  return (
    <div className="px-8 pt-4 pb-6 flex flex-col gap-5 w-full">
      <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-5 items-stretch">
        <nav className="glass-card rounded-card p-3 flex flex-col gap-1.5" aria-label="Settings sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-card text-sm font-medium transition-all duration-150 active:scale-[0.98] border ${
                activeTab === id
                  ? 'bg-accent-primary text-white border-transparent shadow-[0_6px_18px_rgba(47,128,255,0.35)]'
                  : 'text-text-secondary border-transparent hover:bg-[rgba(47,128,255,0.12)] hover:text-[#1D5FCC] hover:border-[rgba(47,128,255,0.3)] hover:shadow-[0_4px_14px_rgba(47,128,255,0.15)]'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-left">{label}</span>
            </button>
          ))}
        </nav>

        <section className="glass-card rounded-card p-6 sm:p-7 min-w-0 flex flex-col">
          <h2 className="font-semibold text-text-primary">{meta.title}</h2>
          <p className="text-sm text-text-secondary mt-1 mb-2">{meta.subtitle}</p>

          {activeTab === 'notifications' && (
            <div>
              <PreferenceRow
                icon={Bell}
                title="Caretaker alerts"
                description="Get notified when they reach or leave important places."
                checked={notifications.caretakerAlerts}
                onChange={(value) => updateNotifications('caretakerAlerts', value)}
              />
              <PreferenceRow
                icon={Battery}
                title="Low battery warnings"
                description="Receive alerts when device battery is low."
                checked={notifications.lowBattery}
                onChange={(value) => updateNotifications('lowBattery', value)}
              />
              <PreferenceRow
                icon={Mail}
                title="Weekly summary email"
                description="Get a weekly summary of their activity."
                checked={notifications.weeklySummary}
                onChange={(value) => updateNotifications('weeklySummary', value)}
              />
              <PreferenceRow
                icon={AlertTriangle}
                title="Emergency alerts"
                description="Get instant alerts in case of emergencies."
                checked={notifications.emergency}
                onChange={(value) => updateNotifications('emergency', value)}
                tone="red"
              />
            </div>
          )}

          {activeTab === 'location' && (
            <div>
              <PreferenceRow
                icon={Crosshair}
                title="High accuracy mode"
                description="Use GPS for the most precise tracking."
                checked={locationPrefs.highAccuracyMode}
                onChange={(value) => updateLocationPrefs('highAccuracyMode', value)}
              />
              <PreferenceRow
                icon={Shield}
                title="Safe zone alerts"
                description="Get notified on safe-zone entry and exit."
                checked={locationPrefs.safeZoneAlerts}
                onChange={(value) => updateLocationPrefs('safeZoneAlerts', value)}
              />
              <PreferenceRow
                icon={BellRing}
                title="Arrival & departure alerts"
                description="Alerts when they reach or leave saved places."
                checked={locationPrefs.arrivalAlerts}
                onChange={(value) => updateLocationPrefs('arrivalAlerts', value)}
              />
            </div>
          )}

          {activeTab === 'account' && (
            <div className="flex flex-col py-2">
              <button className="text-sm font-medium text-accent-primary text-left py-3 border-b border-border last:border-0">
                Change password
              </button>
              <button className="text-sm font-medium text-status-error text-left py-3 border-b border-border last:border-0">
                Log out from all devices
              </button>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <PreferenceRow
                icon={Eye}
                title="Share live location with family"
                description="Let invited family members see real-time location."
                checked={privacyPrefs.shareLive}
                onChange={(value) => updatePrivacyPrefs('shareLive', value)}
              />
              <PreferenceRow
                icon={History}
                title="Save location history"
                description="Keep past routes available on this account."
                checked={privacyPrefs.saveHistory}
                onChange={(value) => updatePrivacyPrefs('saveHistory', value)}
              />
              <PreferenceRow
                icon={Activity}
                title="Share diagnostics"
                description="Send anonymous usage data to improve the app."
                checked={privacyPrefs.diagnostics}
                onChange={(value) => updatePrivacyPrefs('diagnostics', value)}
              />
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-card glass-icon flex items-center justify-center shrink-0">
                <Smartphone size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">Shreya&apos;s Phone</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {mockDeviceStatus.connected ? 'Connected' : 'Disconnected'} · {mockDeviceStatus.networkStatus} · Battery {mockDeviceStatus.battery}%
                </p>
              </div>
              <span className="live-badge flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                Live
              </span>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <PreferenceRow
                icon={Palette}
                title="Show background image"
                description="Display the misty backdrop behind the glass panels."
                checked={showBackground}
                onChange={setShowBackground}
              />
              <p className="text-xs text-text-secondary pt-2">Light glass is the current theme.</p>
            </div>
          )}

          {activeTab === 'help' && (
            <div>
              <a
                href="mailto:support@netrasarthi.app"
                className="flex items-center gap-4 py-4 border-b border-border last:border-0"
              >
                <div className="w-10 h-10 rounded-card glass-icon flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">Contact support</p>
                  <p className="text-xs text-text-secondary mt-0.5">support@netrasarthi.app</p>
                </div>
                <ChevronRight size={16} className="text-text-secondary shrink-0" />
              </a>
              <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-card glass-icon flex items-center justify-center shrink-0">
                  <HelpCircle size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">FAQs</p>
                  <p className="text-xs text-text-secondary mt-0.5">Answers to common questions.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-card glass-icon flex items-center justify-center shrink-0">
                  <Smartphone size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">App version</p>
                  <p className="text-xs text-text-secondary mt-0.5">1.0.0</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Settings
