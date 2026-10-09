import type { Alert, Driver, Shipment, Vehicle } from '../types'

export const vehicles: Vehicle[] = [
  { id: 'VH-001', registration: 'KA 01 MN 4821', model: 'Tata Prima 5530', type: 'Heavy Truck', status: 'Active', driverId: 'DR-001', fuel: 76, mileage: 82450, nextService: '18 Oct 2026', location: 'Bengaluru', lastActivity: '2 min ago' },
  { id: 'VH-002', registration: 'KA 05 PQ 7192', model: 'Ashok Leyland 4220', type: 'Heavy Truck', status: 'Active', driverId: 'DR-002', fuel: 61, mileage: 65820, nextService: '22 Oct 2026', location: 'Mysuru', lastActivity: '6 min ago' },
  { id: 'VH-003', registration: 'KA 03 AB 1138', model: 'Mahindra Bolero', type: 'Pickup', status: 'Idle', driverId: 'DR-003', fuel: 88, mileage: 38420, nextService: '02 Nov 2026', location: 'Hosur', lastActivity: '18 min ago' },
  { id: 'VH-004', registration: 'KA 41 CX 9034', model: 'Tata 407', type: 'Light Truck', status: 'Maintenance', fuel: 34, mileage: 112600, nextService: 'Today', location: 'Bengaluru Depot', lastActivity: '1 hr ago' },
  { id: 'VH-005', registration: 'KA 51 JK 5520', model: 'Eicher Pro 2055', type: 'Medium Truck', status: 'Active', driverId: 'DR-004', fuel: 54, mileage: 48900, nextService: '29 Oct 2026', location: 'Tumakuru', lastActivity: '4 min ago' },
  { id: 'VH-006', registration: 'KA 02 ZZ 2407', model: 'Tata Ace Gold', type: 'Mini Truck', status: 'Offline', fuel: 12, mileage: 72100, nextService: '12 Oct 2026', location: 'Bengaluru Depot', lastActivity: 'Yesterday' }
]

export const drivers: Driver[] = [
  { id: 'DR-001', name: 'Ravi Kumar', phone: '+91 98765 12001', status: 'On Delivery', license: 'KA-2022-88421', vehicleId: 'VH-001', rating: 4.8, deliveries: 184, onTime: 96, location: 'Bengaluru' },
  { id: 'DR-002', name: 'Manoj Patil', phone: '+91 98765 12002', status: 'On Delivery', license: 'KA-2021-61208', vehicleId: 'VH-002', rating: 4.6, deliveries: 161, onTime: 93, location: 'Mysuru' },
  { id: 'DR-003', name: 'Arun Shetty', phone: '+91 98765 12003', status: 'Available', license: 'KA-2023-31570', vehicleId: 'VH-003', rating: 4.9, deliveries: 128, onTime: 98, location: 'Hosur' },
  { id: 'DR-004', name: 'Suresh Gowda', phone: '+91 98765 12004', status: 'On Delivery', license: 'KA-2020-49112', vehicleId: 'VH-005', rating: 4.5, deliveries: 149, onTime: 91, location: 'Tumakuru' },
  { id: 'DR-005', name: 'Kiran Bhat', phone: '+91 98765 12005', status: 'Available', license: 'KA-2024-11820', rating: 4.7, deliveries: 74, onTime: 95, location: 'Bengaluru' },
  { id: 'DR-006', name: 'Vijay Raj', phone: '+91 98765 12006', status: 'Off Duty', license: 'KA-2019-77742', rating: 4.4, deliveries: 203, onTime: 89, location: 'Mysuru' }
]

export const shipments: Shipment[] = [
  { id: 'SHP-10482', customer: 'Reliance Retail', pickup: 'Peenya, Bengaluru', delivery: 'Mysuru Industrial Area', driverId: 'DR-001', vehicleId: 'VH-001', status: 'In Transit', eta: 'Today, 4:20 PM', created: '06 Oct 2026', distance: '145 km', priority: 'High' },
  { id: 'SHP-10481', customer: 'Flipkart Supply Chain', pickup: 'Hosur, Tamil Nadu', delivery: 'Whitefield, Bengaluru', driverId: 'DR-002', vehicleId: 'VH-002', status: 'In Transit', eta: 'Today, 5:05 PM', created: '06 Oct 2026', distance: '62 km', priority: 'Medium' },
  { id: 'SHP-10480', customer: 'D-Mart Distribution', pickup: 'Tumakuru', delivery: 'Rajajinagar, Bengaluru', driverId: 'DR-004', vehicleId: 'VH-005', status: 'Delayed', eta: 'Today, 7:10 PM', created: '06 Oct 2026', distance: '72 km', priority: 'High' },
  { id: 'SHP-10479', customer: 'Amazon Logistics', pickup: 'Bengaluru Airport', delivery: 'Electronic City', status: 'Pending', eta: 'Tomorrow, 10:00 AM', created: '06 Oct 2026', distance: '54 km', priority: 'Medium' },
  { id: 'SHP-10478', customer: 'BigBasket', pickup: 'Hosur', delivery: 'Indiranagar, Bengaluru', driverId: 'DR-003', vehicleId: 'VH-003', status: 'Delivered', eta: 'Delivered 1:45 PM', created: '06 Oct 2026', distance: '38 km', priority: 'Low' },
  { id: 'SHP-10477', customer: 'IKEA India', pickup: 'Nelmangala', delivery: 'Mysuru', driverId: 'DR-001', vehicleId: 'VH-001', status: 'Delivered', eta: 'Delivered 12:20 PM', created: '05 Oct 2026', distance: '151 km', priority: 'Medium' },
  { id: 'SHP-10476', customer: 'Metro Cash & Carry', pickup: 'Yeshwanthpur', delivery: 'Kengeri', driverId: 'DR-005', status: 'Pending', eta: 'Tomorrow, 9:30 AM', created: '05 Oct 2026', distance: '27 km', priority: 'Low' }
]

export const alerts: Alert[] = [
  { id: 'AL-01', type: 'danger', title: 'Shipment delayed', description: 'SHP-10480 is 42 minutes behind schedule.', time: '12 min ago' },
  { id: 'AL-02', type: 'warning', title: 'Maintenance due', description: 'KA 41 CX 9034 requires scheduled service.', time: '28 min ago' },
  { id: 'AL-03', type: 'info', title: 'Delivery completed', description: 'SHP-10478 was delivered successfully.', time: '1 hr ago' },
  { id: 'AL-04', type: 'warning', title: 'Low fuel', description: 'KA 02 ZZ 2407 has only 12% fuel remaining.', time: '2 hrs ago' }
]

export const weeklyPerformance = [
  { day: 'Mon', delivered: 62, delayed: 5 },
  { day: 'Tue', delivered: 71, delayed: 4 },
  { day: 'Wed', delivered: 68, delayed: 7 },
  { day: 'Thu', delivered: 76, delayed: 3 },
  { day: 'Fri', delivered: 81, delayed: 5 },
  { day: 'Sat', delivered: 74, delayed: 2 },
  { day: 'Sun', delivered: 59, delayed: 4 }
]
