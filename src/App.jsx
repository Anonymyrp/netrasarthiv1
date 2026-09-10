import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EyesLoader from './components/EyesLoader'
import DashboardLayout from './Layout/DashboardLayout'
import Home from './Pages/Home'
import LiveLocation from './Pages/LiveLocation'
import PastLocations from './Pages/PastLocations'
import Recordings from './Pages/Recordings'
import Alerts from './Pages/Alerts'
import Settings from './Pages/Settings'

function App() {
  const [loading, setLoading] = useState(true)

  const user = { name: 'Shreya', tagline: 'Care creates freedom' }

  return (
    <>
      {loading && <EyesLoader onComplete={() => setLoading(false)} />}
      <div
        className="min-h-screen"
        style={{
          pointerEvents: loading ? 'none' : 'auto',
          userSelect: loading ? 'none' : 'auto',
        }}
      >
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
              <Route path="/live-location" element={<LiveLocation />} />
              <Route path="/past-locations" element={<PastLocations />} />
              <Route path="/recordings" element={<Recordings />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App