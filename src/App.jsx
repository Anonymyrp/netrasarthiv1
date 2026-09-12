import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import DashboardLayout from './Layout/DashboardLayout'
import Home from './Pages/Home'
import LiveLocation from './Pages/LiveLocation'
import PastLocations from './Pages/PastLocations'
import Recordings from './Pages/Recordings'
import Alerts from './Pages/Alerts'
import Settings from './Pages/Settings'
import ConnectedDevices from './Pages/ConnectedDevices'

function App() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />
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
          <Route path="/live-location" element={<LiveLocation />} />
          <Route path="/past-locations" element={<PastLocations />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/connected-devices" element={<ConnectedDevices />} />
          <Route path="/devices" element={<ConnectedDevices />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
