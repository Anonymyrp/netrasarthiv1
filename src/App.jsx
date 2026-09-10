import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EyesLoader from './components/EyesLoader'
import DashboardLayout from './Layout/DashboardLayout'
import Home from './Pages/Home'

function App() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <EyesLoader onComplete={() => setLoading(false)} />
  }

  const user = { name: 'Shreya', tagline: 'Care creates freedom' }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <DashboardLayout
              user={user}
              onLogout={() => {}}
              onProfileClick={() => {}}
              onNotificationClick={() => {}}
              hasUnreadNotifications={true}
            />
          }
        >
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App