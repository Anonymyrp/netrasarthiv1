function TopHeader({ title, subtitle }) {
  return (
    <header className="dashboard-header flex items-center justify-between gap-4 px-4 md:px-8 pt-3 pb-2 bg-transparent">
      <div className="min-w-0">
        {title && (
          <>
            <h1 className="text-xl font-bold tracking-tight text-text-primary leading-tight truncate">{title}</h1>
            {subtitle && <p className="text-sm text-text-secondary mt-0.5 truncate">{subtitle}</p>}
          </>
        )}
      </div>
    </header>
  )
}

export default TopHeader
