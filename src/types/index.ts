export type Status = 'Active' | 'Idle' | 'Maintenance' | 'Offline'
export type ShipmentStatus = 'Delivered' | 'In Transit' | 'Delayed' | 'Pending'

export interface Vehicle {
  id: string
  registration: string
  model: string
  type: string
  status: Status
  driverId?: string
  fuel: number
  mileage: number
  nextService: string
  location: string
  lastActivity: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  status: 'Available' | 'On Delivery' | 'Off Duty'
  license: string
  vehicleId?: string
  rating: number
  deliveries: number
  onTime: number
  location: string
}

export interface Shipment {
  id: string
  customer: string
  pickup: string
  delivery: string
  driverId?: string
  vehicleId?: string
  status: ShipmentStatus
  eta: string
  created: string
  distance: string
  priority: 'High' | 'Medium' | 'Low'
}

export interface Alert {
  id: string
  type: 'warning' | 'info' | 'danger'
  title: string
  description: string
  time: string
}
