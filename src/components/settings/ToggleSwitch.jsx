function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm text-text-primary">{label}</span>
      <span
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
          checked ? 'bg-accent-primary justify-end' : 'bg-white/10 justify-start'
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-white" />
      </span>
    </label>
  )
}

export default ToggleSwitch