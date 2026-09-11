import { useState } from 'react'
import SettingsSection from '../components/settings/SettingsSection'
import ToggleSwitch from '../components/settings/ToggleSwitch'

function Settings() {
  const [notifications, setNotifications] = useState({
    caretakerAlerts: true,
    lowBattery: true,
    weeklySummary: false,
  })

  const [locationPrefs, setLocationPrefs] = useState({
    highAccuracyMode: true,
    safeZoneAlerts: true,
  })

  const updateNotification = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const updateLocationPref = (key, value) => {
    setLocationPrefs((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="px-8 py-6 flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-text-primary">Settings</h1>

      <SettingsSection title="Notification Preferences">
        <ToggleSwitch
          label="Caretaker alerts"
          checked={notifications.caretakerAlerts}
          onChange={(value) => updateNotification('caretakerAlerts', value)}
        />
        <ToggleSwitch
          label="Low battery warnings"
          checked={notifications.lowBattery}
          onChange={(value) => updateNotification('lowBattery', value)}
        />
        <ToggleSwitch
          label="Weekly summary email"
          checked={notifications.weeklySummary}
          onChange={(value) => updateNotification('weeklySummary', value)}
        />
      </SettingsSection>

      <SettingsSection title="Location & Alert Preferences">
        <ToggleSwitch
          label="High accuracy mode"
          checked={locationPrefs.highAccuracyMode}
          onChange={(value) => updateLocationPref('highAccuracyMode', value)}
        />
        <ToggleSwitch
          label="Safe zone alerts"
          checked={locationPrefs.safeZoneAlerts}
          onChange={(value) => updateLocationPref('safeZoneAlerts', value)}
        />
      </SettingsSection>

      <SettingsSection title="Account & Security">
        <button className="text-sm font-medium text-accent-primary text-left py-2">
          Change password
        </button>
        <button className="text-sm font-medium text-status-error text-left py-2">
          Log out from all devices
        </button>
      </SettingsSection>
    </div>
  )
}

export default Settings