function WelcomeSection({ userName, currentDate, supportingText, sideText }) {
  return (
    <section className="flex items-start justify-between px-8 pt-2 pb-6">
      <div>
        <p className="text-sm text-text-secondary mb-1">{currentDate}</p>
        <h1 className="text-2xl font-semibold text-text-primary">
          Welcome, {userName}!
        </h1>
        <p className="text-sm text-text-secondary mt-1">{supportingText}</p>
      </div>

      {sideText && (
        <p className="text-sm italic text-text-secondary text-right max-w-xs">
          {sideText}
        </p>
      )}
    </section>
  )
}

export default WelcomeSection