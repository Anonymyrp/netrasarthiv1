import WelcomeSection from '../components/dashboard/WelcomeSection'

function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <WelcomeSection
      userName="Shreya"
      currentDate={currentDate}
      supportingText="Here's what's happening right now."
      sideText="Stay connected. Support their journey."
    />
  )
}

export default Home