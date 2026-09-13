import { UserRound, SlidersHorizontal, BellRing, ShieldCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const settingsItems = [
  { title: 'Profile & Account', description: 'Manage your profile details', icon: UserRound },
  { title: 'Device Settings', description: 'Configure helmet and app settings', icon: SlidersHorizontal },
  { title: 'Notification Preferences', description: 'Manage notifications', icon: BellRing },
  { title: 'Privacy & Security', description: 'Control your data and permissions', icon: ShieldCheck },
]

function DashboardSettingsCard() {
  return (
    <section className="glass-card rounded-card p-5 dashboard-settings-card">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-semibold text-text-primary">Settings</h2>
        <Link to="/settings" className="text-xs font-semibold text-accent-primary hover:text-accent-secondary">
          View all <ArrowRight size={13} className="inline-block ml-0.5" />
        </Link>
      </div>

      <div className="flex flex-col">
        {settingsItems.map(({ title, description, icon: Icon }) => (
          <Link key={title} to="/settings" className="dashboard-settings-item">
            <span className="dashboard-settings-icon"><Icon size={15} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-text-primary truncate">{title}</span>
              <span className="block text-[11px] text-text-secondary truncate">{description}</span>
            </span>
            <ArrowRight size={14} className="shrink-0 text-text-muted" />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default DashboardSettingsCard
