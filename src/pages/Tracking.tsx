import { useEffect, useState } from 'react'
import { LocateFixed, MapPin, Navigation, Radio, Truck, ZoomIn, ZoomOut } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import { StatusBadge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'

export default function Tracking() {
  const { vehicles, shipments, drivers } = useFleet()
  const trackable = vehicles.filter(v => v.status === 'Active' || v.status === 'Idle')
  const [selected, setSelected] = useState('')
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    if (!trackable.some(v => v.id === selected)) setSelected(trackable[0]?.id ?? '')
  }, [trackable, selected])
  const current = trackable.find(v => v.id === selected)
  const driver = drivers.find(d => d.id === current?.driverId)
  const shipment = shipments.find(s => s.vehicleId === current?.id && (s.status === 'In Transit' || s.status === 'Delayed'))
  if (!current) return <section className="card"><EmptyState message="No vehicles are available to track." /></section>

  return <div className="tracking-layout">
    <section className="card map-card"><div className="map-toolbar"><div><strong>Fleet location overview</strong><span><Radio size={12}/> {trackable.length} trackable vehicles</span></div><div className="map-actions"><button aria-label="Zoom in" onClick={() => setZoom(value => Math.min(value + 0.1, 1.4))}><ZoomIn size={17}/></button><button aria-label="Zoom out" onClick={() => setZoom(value => Math.max(value - 0.1, 0.8))}><ZoomOut size={17}/></button><button aria-label="Center map" onClick={() => setZoom(1)}><LocateFixed size={17}/></button></div></div>
      <div className="map-canvas"><div className="map-scene" style={{ transform: `scale(${zoom})` }}><div className="map-grid"/><div className="road road-1"/><div className="road road-2"/><div className="road road-3"/><div className="road road-4"/><div className="route-line"/><div className="map-label label-a">Bengaluru</div><div className="map-label label-b">Hosur</div><div className="map-label label-c">Tumakuru</div><div className="map-label label-d">Mysuru</div><div className="pin pickup"><MapPin size={24}/><span>Pickup</span></div><div className="pin delivery"><MapPin size={24}/><span>Delivery</span></div>{trackable.map((v, i) => <button key={v.id} title={`${v.registration} · ${v.location}`} aria-label={`Select ${v.registration}`} className={`vehicle-pin ${v.id === selected ? 'selected' : ''}`} style={{ left: `${18 + (i * 19) % 68}%`, top: `${30 + (i % 3) * 18}%` }} onClick={() => setSelected(v.id)}><Truck size={17}/></button>)}</div></div>
      <div className="map-legend"><span><i className="legend-dot vehicle"/> Fleet vehicle</span><span><i className="legend-dot pickup-dot"/> Pickup point</span><span><i className="legend-dot delivery-dot"/> Delivery point</span><small>Illustrative map UI · sample locations</small></div>
    </section>
    <aside className="tracking-panel card"><div className="section-head"><div><h2>Track vehicles</h2><p>Select a vehicle to view details</p></div></div>
      <div className="vehicle-list">{trackable.map(v => <button className={`vehicle-list-item ${v.id === selected ? 'selected' : ''}`} key={v.id} onClick={() => setSelected(v.id)}><div className="vehicle-mini"><Truck size={17}/></div><div><strong>{v.registration}</strong><span>{v.location} · {drivers.find(d => d.id === v.driverId)?.name ?? 'No driver'}</span></div><span className={`online-dot ${v.status === 'Idle' ? 'idle-dot' : ''}`}/></button>)}</div>
      <div className="tracking-detail"><div className="detail-top"><div className="vehicle-mini big"><Truck size={22}/></div><div><strong>{current.registration}</strong><span>{current.model}</span></div><StatusBadge>{current.status}</StatusBadge></div><div className="location-card"><Navigation size={18}/><div><span>Current location</span><strong>{current.location}</strong><small>Last update: {current.lastActivity}</small></div></div>
        {shipment ? <div className="eta-card"><div><span>Active shipment</span><strong>{shipment.id}</strong></div><div><span>Estimated arrival</span><strong>{shipment.eta}</strong></div></div> : <div className="eta-card"><div><span>Active shipment</span><strong>No active shipment</strong></div><div><span>Next stop</span><strong>Not available</strong></div></div>}
        <div className="detail-stats"><div><span>Fuel</span><strong>{current.fuel}%</strong></div><div><span>Driver</span><strong>{driver?.name ?? '—'}</strong></div><div><span>Route</span><strong>{shipment?.distance ?? '—'}</strong></div></div>
        {shipment && <div className="route-detail"><strong>Route progress</strong><div className="route-progress"><span style={{ width: shipment.status === 'Delayed' ? '62%' : '74%' }}/></div><div className="route-stops"><span>{shipment.pickup}</span><span>{shipment.delivery}</span></div><p>Estimated delivery is based on sample shipment data.</p></div>}
      </div>
    </aside>
  </div>
}
