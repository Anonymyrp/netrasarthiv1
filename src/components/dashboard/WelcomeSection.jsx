function WelcomeSection({ userName, currentDate, supportingText, sideText }) {
  return (
    <section className="flex items-start justify-between px-8 pt-2 pb-6">
      <div>
        <p className="text-sm text-text-secondary mb-1">{currentDate}</p>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Welcome, {userName}!
        </h1>
        <p className="text-sm text-text-secondary mt-1">{supportingText}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="safety-pill flex items-center gap-2 rounded-full px-3 py-2 text-xs">
          <span className="safety-dot w-2.5 h-2.5 rounded-full animate-pulse" />
          <span>
            <span className="block font-semibold text-status-success">User is safe</span>
            <span className="block text-text-secondary">Last updated 2 min ago</span>
          </span>
        </span>
        {sideText && (
          <p className="text-sm italic text-text-secondary text-right max-w-xs">
            {sideText}
          </p>
        )}
      </div>
    </section>
  )
}

export default WelcomeSection