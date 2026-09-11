function SettingsSection({ title, children }) {
  return (
    <section className="glass-card rounded-card p-5 flex flex-col gap-1">
      <h2 className="font-semibold text-text-primary mb-2">{title}</h2>
      {children}
    </section>
  )
}

export default SettingsSection