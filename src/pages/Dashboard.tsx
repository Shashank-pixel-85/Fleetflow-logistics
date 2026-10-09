import { Activity, ArrowUpRight, CheckCircle2, Truck, Users, Wrench, AlertTriangle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/Badge'
import { weeklyPerformance } from '../data/mockData'
import { useFleet } from '../context/FleetContext'

export default function Dashboard() {
  const { vehicles, drivers, shipments, alerts } = useFleet()
  const activeDrivers = drivers.filter(d => d.status !== 'Off Duty').length
  const activeShipments = shipments.filter(s => s.status === 'In Transit' || s.status === 'Delayed').length
  const delivered = shipments.filter(s => s.status === 'Delivered').length
  const delayed = shipments.filter(s => s.status === 'Delayed').length
  const onTimeRate = delivered ? Math.round((delivered / Math.max(delivered + delayed, 1)) * 100) : 0
  const vehicleStatuses = [
    { label: 'Active', count: vehicles.filter(v => v.status === 'Active').length, className: 'green' },
    { label: 'Idle', count: vehicles.filter(v => v.status === 'Idle').length, className: 'blue' },
    { label: 'Maintenance', count: vehicles.filter(v => v.status === 'Maintenance').length, className: 'red' },
    { label: 'Offline', count: vehicles.filter(v => v.status === 'Offline').length, className: 'gray' },
  ]
  const shipmentStatuses = [
    { label: 'In Transit', count: shipments.filter(s => s.status === 'In Transit').length, color: '#3977ff' },
    { label: 'Delivered', count: delivered, color: '#2aac68' },
    { label: 'Delayed', count: delayed, color: '#f97373' },
    { label: 'Pending', count: shipments.filter(s => s.status === 'Pending').length, color: '#c5ccd6' },
  ]
  const total = shipments.length
  const donutStyle = { background: `conic-gradient(${shipmentStatuses.map((s, i) => `${s.color} ${shipmentStatuses.slice(0, i).reduce((sum, item) => sum + item.count, 0) / Math.max(total, 1) * 100}% ${(shipmentStatuses.slice(0, i + 1).reduce((sum, item) => sum + item.count, 0) / Math.max(total, 1)) * 100}%`).join(', ')})` }

  return <>
    <div className="stats-grid">
      <StatCard label="Total Vehicles" value={String(vehicles.length)} change={`${vehicles.filter(v => v.status === 'Active').length} active`} icon={Truck} tone="blue" />
      <StatCard label="Available Drivers" value={String(activeDrivers)} change={`${drivers.length} registered`} icon={Users} tone="purple" />
      <StatCard label="Active Shipments" value={String(activeShipments)} change={`${delayed} delayed`} icon={Activity} tone="orange" />
      <StatCard label="Delivery Rate" value={`${onTimeRate}%`} change={`${delivered} delivered`} icon={CheckCircle2} tone="green" />
    </div>
    <div className="dashboard-grid">
      <section className="card chart-card"><div className="section-head"><div><h2>Delivery performance</h2><p>Completed deliveries vs delays this week</p></div><span className="ghost-button">This week <ArrowUpRight size={14} /></span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyPerformance} barGap={5}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e8edf5"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8b95a7', fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b95a7', fontSize: 12 }}/><Tooltip cursor={{ fill: '#f6f8fb' }}/><Bar dataKey="delivered" fill="#3977ff" radius={[5, 5, 0, 0]} name="Delivered"/><Bar dataKey="delayed" fill="#f97373" radius={[5, 5, 0, 0]} name="Delayed"/></BarChart></ResponsiveContainer></div>
      </section>
      <section className="card shipment-status-card"><div className="section-head"><div><h2>Shipment status</h2><p>Current shipment distribution</p></div></div><div className="donut-wrap"><div className="donut" style={donutStyle}><div><strong>{total}</strong><span>Total</span></div></div><div className="legend">{shipmentStatuses.map(item => <div key={item.label}><i className="dot" style={{ background: item.color }}/><span>{item.label}</span><strong>{item.count}</strong></div>)}</div></div></section>
    </div>
    <div className="dashboard-grid lower">
      <section className="card"><div className="section-head"><div><h2>Fleet overview</h2><p>Live status across {vehicles.length} vehicles</p></div><Link to="/vehicles" className="text-link">View all</Link></div><div className="fleet-progress">{vehicleStatuses.map(item => { const percent = vehicles.length ? Math.round(item.count / vehicles.length * 100) : 0; return <div key={item.label}><div className="fleet-label"><span><i className={`dot ${item.className}`}/> {item.label}</span><strong>{item.count} <small>{percent}%</small></strong></div><div className="progress"><span className={item.className} style={{ width: `${percent}%` }}/></div></div> })}</div></section>
      <section className="card"><div className="section-head"><div><h2>Recent activity</h2><p>Latest operational alerts</p></div><Link to="/notifications" className="text-link">See all</Link></div><div className="activity-list">{alerts.slice(0, 4).map(a => <div className="activity" key={a.id}><div className={`activity-icon ${a.type}`}><AlertTriangle size={15}/></div><div><strong>{a.title}</strong><p>{a.description}</p><span>{a.time}</span></div></div>)}{alerts.length === 0 && <p className="muted-text">No open alerts. Your fleet is looking good.</p>}</div></section>
    </div>
    <section className="card table-card"><div className="section-head"><div><h2>Active shipments</h2><p>Shipments requiring attention</p></div><Link to="/shipments" className="text-link">Manage shipments</Link></div><div className="table-scroll"><table><thead><tr><th>Shipment</th><th>Customer</th><th>Route</th><th>Vehicle</th><th>Status</th><th>ETA</th></tr></thead><tbody>{shipments.filter(s => s.status !== 'Delivered').slice(0, 5).map(s => <tr key={s.id}><td><strong>{s.id}</strong><span className="subtext">{s.created}</span></td><td>{s.customer}</td><td><span className="route-text">{s.pickup}</span><span className="route-text">{s.delivery}</span></td><td>{vehicles.find(v => v.id === s.vehicleId)?.registration || 'Unassigned'}</td><td><StatusBadge>{s.status}</StatusBadge></td><td>{s.eta}</td></tr>)}</tbody></table>{shipments.filter(s => s.status !== 'Delivered').length === 0 && <div className="empty-state">No active shipments right now.</div>}</div></section>
    <div className="dashboard-footnote"><Wrench size={14}/> Demo metrics are calculated from the sample records. Add or edit records to see the dashboard update.</div>
  </>
}
