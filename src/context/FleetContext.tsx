import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { alerts as initialAlerts, drivers as initialDrivers, shipments as initialShipments, vehicles as initialVehicles } from '../data/mockData'
import type { Alert, Driver, Shipment, Vehicle } from '../types'

type FleetContextValue = {
  vehicles: Vehicle[]
  drivers: Driver[]
  shipments: Shipment[]
  alerts: Alert[]
  addVehicle: (item: Vehicle) => void
  updateVehicle: (item: Vehicle) => void
  removeVehicle: (id: string) => void
  addDriver: (item: Driver) => void
  updateDriver: (item: Driver) => void
  removeDriver: (id: string) => void
  addShipment: (item: Shipment) => void
  updateShipment: (item: Shipment) => void
  removeShipment: (id: string) => void
  dismissAlert: (id: string) => void
  resetDemoData: () => void
}

const FleetContext = createContext<FleetContextValue | null>(null)
const STORAGE_KEY = 'fleetflow-demo-data-v1'

type SavedData = { vehicles: Vehicle[]; drivers: Driver[]; shipments: Shipment[]; alerts: Alert[] }
function readSavedData(): SavedData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as SavedData : null
  } catch {
    return null
  }
}

export function FleetProvider({ children }: { children: ReactNode }) {
  const [initial] = useState<SavedData>(() => readSavedData() ?? {
    vehicles: initialVehicles, drivers: initialDrivers, shipments: initialShipments, alerts: initialAlerts,
  })
  const [vehicles, setVehicles] = useState<Vehicle[]>(initial.vehicles)
  const [drivers, setDrivers] = useState<Driver[]>(initial.drivers)
  const [shipments, setShipments] = useState<Shipment[]>(initial.shipments)
  const [alerts, setAlerts] = useState<Alert[]>(initial.alerts)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ vehicles, drivers, shipments, alerts })) } catch { /* Storage may be disabled in private browsing. */ }
  }, [vehicles, drivers, shipments, alerts])

  const value: FleetContextValue = {
    vehicles, drivers, shipments, alerts,
    addVehicle: item => setVehicles(current => [item, ...current]),
    updateVehicle: item => setVehicles(current => current.map(v => v.id === item.id ? item : v)),
    removeVehicle: id => setVehicles(current => current.filter(v => v.id !== id)),
    addDriver: item => setDrivers(current => [item, ...current]),
    updateDriver: item => setDrivers(current => current.map(d => d.id === item.id ? item : d)),
    removeDriver: id => setDrivers(current => current.filter(d => d.id !== id)),
    addShipment: item => setShipments(current => [item, ...current]),
    updateShipment: item => setShipments(current => current.map(s => s.id === item.id ? item : s)),
    removeShipment: id => setShipments(current => current.filter(s => s.id !== id)),
    dismissAlert: id => setAlerts(current => current.filter(a => a.id !== id)),
    resetDemoData: () => {
      setVehicles(initialVehicles); setDrivers(initialDrivers); setShipments(initialShipments); setAlerts(initialAlerts)
    },
  }
  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

export function useFleet() {
  const context = useContext(FleetContext)
  if (!context) throw new Error('useFleet must be used inside FleetProvider')
  return context
}
