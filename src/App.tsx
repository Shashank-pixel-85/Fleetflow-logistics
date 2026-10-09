import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { FleetProvider } from './context/FleetContext'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Drivers from './pages/Drivers'
import Shipments from './pages/Shipments'
import Tracking from './pages/Tracking'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'

export default function App() {
  return <FleetProvider><BrowserRouter><Routes><Route element={<Layout />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/vehicles" element={<Vehicles />} />
    <Route path="/drivers" element={<Drivers />} />
    <Route path="/shipments" element={<Shipments />} />
    <Route path="/tracking" element={<Tracking />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/settings" element={<Settings />} />
  </Route></Routes></BrowserRouter></FleetProvider>
}
