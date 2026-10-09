import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Eye, Package, Trash2, Edit3 } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import type { Shipment } from '../types'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/Badge'
import { Modal } from '../components/Modal'
import { EmptyState } from '../components/EmptyState'

export default function Shipments() {
  const { shipments, drivers, vehicles, addShipment, updateShipment, removeShipment } = useFleet()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [location, setLocation] = useState('All')
  const [date, setDate] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Shipment | null>(null)
  const [viewing, setViewing] = useState<Shipment | null>(null)
  const locations = Array.from(new Set(shipments.flatMap(s => [s.pickup, s.delivery]))).sort()
  const filtered = useMemo(() => shipments.filter(s => {
    const q = search.toLowerCase()
    return (!q || `${s.id} ${s.customer} ${s.pickup} ${s.delivery}`.toLowerCase().includes(q)) &&
      (status === 'All' || s.status === status) && (location === 'All' || s.pickup === location || s.delivery === location) &&
      (!date || s.created === date || s.created.includes(new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })))
  }), [shipments, search, status, location, date])

  function saveShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const driverId = String(data.get('driver') || '')
    const vehicleId = String(data.get('vehicle') || '')
    const item: Shipment = {
      id: selected?.id ?? `SHP-${String(Date.now()).slice(-5)}`,
      customer: String(data.get('customer')).trim(), pickup: String(data.get('pickup')).trim(), delivery: String(data.get('delivery')).trim(),
      driverId: driverId || undefined, vehicleId: vehicleId || undefined,
      status: String(data.get('status')) as Shipment['status'], eta: String(data.get('eta')) || 'To be confirmed',
      created: selected?.created ?? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      distance: String(data.get('distance') || 'Not estimated'), priority: String(data.get('priority')) as Shipment['priority'],
    }
    if (selected) updateShipment(item); else addShipment(item)
    setOpen(false); setSelected(null)
  }

  return <>
    <div className="shipment-summary"><div><Package /><span>Total</span><strong>{shipments.length}</strong></div><div><span className="dot blue"/><span>In Transit</span><strong>{shipments.filter(s => s.status === 'In Transit').length}</strong></div><div><span className="dot red"/><span>Delayed</span><strong>{shipments.filter(s => s.status === 'Delayed').length}</strong></div><div><span className="dot green"/><span>Delivered</span><strong>{shipments.filter(s => s.status === 'Delivered').length}</strong></div></div>
    <section className="card">
      <PageToolbar search={search} onSearch={setSearch} placeholder="Search shipment, customer or location..." onAdd={() => { setSelected(null); setOpen(true) }} addLabel="Create Shipment">
        <select className="select" aria-label="Filter shipment status" value={status} onChange={e => setStatus(e.target.value)}><option>All</option><option>In Transit</option><option>Delivered</option><option>Delayed</option><option>Pending</option></select>
        <select className="select" aria-label="Filter by route location" value={location} onChange={e => setLocation(e.target.value)}><option>All</option>{locations.map(place => <option key={place}>{place}</option>)}</select>
        <input className="select date-filter" aria-label="Filter by created date" type="date" value={date} onChange={e => setDate(e.target.value)} />
      </PageToolbar>
      <div className="table-scroll"><table><thead><tr><th>Shipment</th><th>Customer</th><th>Route</th><th>Assigned</th><th>Status</th><th>ETA</th><th>Priority</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(s => <tr key={s.id}><td><strong>{s.id}</strong><span className="subtext">{s.created} · {s.distance}</span></td><td>{s.customer}</td><td><div className="route-cell"><span><i /> {s.pickup}</span><ArrowRight size={13} /><span><i /> {s.delivery}</span></div></td><td><span>{drivers.find(d => d.id === s.driverId)?.name || 'Unassigned'}</span><span className="subtext">{vehicles.find(v => v.id === s.vehicleId)?.registration || 'No vehicle'}</span></td><td><StatusBadge>{s.status}</StatusBadge></td><td>{s.eta}</td><td><span className={`priority ${s.priority.toLowerCase()}`}>{s.priority}</span></td><td><div className="row-actions"><button title="View shipment" aria-label="View shipment" onClick={() => setViewing(s)}><Eye size={16} /></button><button title="Edit shipment" aria-label="Edit shipment" onClick={() => { setSelected(s); setOpen(true) }}><Edit3 size={16} /></button><button title="Remove shipment" aria-label="Remove shipment" onClick={() => { if (window.confirm(`Remove shipment ${s.id}?`)) removeShipment(s.id) }}><Trash2 size={16} /></button></div></td></tr>)}</tbody>
      </table>{filtered.length === 0 && <EmptyState message="No shipments match these filters." />}</div>
    </section>
    <Modal open={open} title={selected ? 'Edit shipment' : 'Create shipment'} onClose={() => { setOpen(false); setSelected(null) }}>
      <form onSubmit={saveShipment}><div className="form-grid">
        <label>Customer name<input name="customer" defaultValue={selected?.customer} placeholder="Customer or company" required /></label>
        <label>Priority<select name="priority" defaultValue={selected?.priority ?? 'Medium'}><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label>Pickup location<input name="pickup" defaultValue={selected?.pickup} placeholder="Pickup address" required /></label>
        <label>Delivery location<input name="delivery" defaultValue={selected?.delivery} placeholder="Delivery address" required /></label>
        <label>Assign driver<select name="driver" defaultValue={selected?.driverId ?? ''}><option value="">Unassigned</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label>Assign vehicle<select name="vehicle" defaultValue={selected?.vehicleId ?? ''}><option value="">Unassigned</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.registration}</option>)}</select></label>
        <label>Status<select name="status" defaultValue={selected?.status ?? 'Pending'}><option>Pending</option><option>In Transit</option><option>Delayed</option><option>Delivered</option></select></label>
        <label>Estimated arrival<input name="eta" defaultValue={selected?.eta} placeholder="e.g. Today, 4:30 PM" required /></label>
        <label>Distance<input name="distance" defaultValue={selected?.distance} placeholder="e.g. 145 km" /></label>
      </div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button type="submit" className="primary-button">{selected ? 'Save changes' : 'Create shipment'}</button></div></form>
    </Modal>
    <Modal open={!!viewing} title="Shipment details & history" onClose={() => setViewing(null)}>
      {viewing && <div className="detail-modal"><div className="entity"><div className="entity-icon"><Package size={20} /></div><div><strong>{viewing.id}</strong><span>{viewing.customer}</span></div><StatusBadge>{viewing.status}</StatusBadge></div><div className="detail-stats"><div><span>Priority</span><strong>{viewing.priority}</strong></div><div><span>Distance</span><strong>{viewing.distance}</strong></div><div><span>Created</span><strong>{viewing.created}</strong></div></div><p><strong>Pickup:</strong> {viewing.pickup}</p><p><strong>Delivery:</strong> {viewing.delivery}</p><p><strong>Driver:</strong> {drivers.find(d => d.id === viewing.driverId)?.name ?? 'Unassigned'}</p><p><strong>Vehicle:</strong> {vehicles.find(v => v.id === viewing.vehicleId)?.registration ?? 'Unassigned'}</p><p><strong>Estimated arrival / delivery:</strong> {viewing.eta}</p><p><strong>History:</strong> Shipment created {viewing.created}; current status is {viewing.status}.</p></div>}
    </Modal>
  </>
}
