import { useMemo, useState, type FormEvent } from 'react'
import { Edit3, Eye, Fuel, Trash2, Wrench } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import type { Vehicle } from '../types'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/Badge'
import { Modal } from '../components/Modal'
import { EmptyState } from '../components/EmptyState'

const blankVehicle = (): Vehicle => ({ id: '', registration: '', model: '', type: 'Heavy Truck', status: 'Active', fuel: 75, mileage: 0, nextService: '', location: '', lastActivity: 'Just added' })

export default function Vehicles() {
  const { vehicles, drivers, addVehicle, updateVehicle, removeVehicle } = useFleet()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [location, setLocation] = useState('All')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [viewing, setViewing] = useState<Vehicle | null>(null)
  const filtered = useMemo(() => vehicles.filter(v => {
    const q = search.toLowerCase()
    return (!q || `${v.registration} ${v.model} ${v.location} ${v.type}`.toLowerCase().includes(q)) &&
      (status === 'All' || v.status === status) && (location === 'All' || v.location === location)
  }), [vehicles, search, status, location])
  const locations = Array.from(new Set(vehicles.map(v => v.location))).sort()

  function saveVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const registration = String(data.get('registration')).trim().toUpperCase()
    const driverName = String(data.get('driver') || '')
    const driver = drivers.find(item => item.name === driverName)
    const item: Vehicle = {
      id: selected?.id ?? `VH-${String(Date.now()).slice(-5)}`,
      registration, model: String(data.get('model')).trim(), type: String(data.get('type')),
      status: String(data.get('status')) as Vehicle['status'], driverId: driver?.id,
      fuel: Number(data.get('fuel')), mileage: Number(data.get('mileage')),
      nextService: String(data.get('nextService')) || selected?.nextService || '', location: String(data.get('location')).trim(),
      lastActivity: selected ? 'Updated just now' : 'Added just now',
    }
    if (selected) updateVehicle(item); else addVehicle(item)
    setOpen(false); setSelected(null)
  }

  return <>
    <div className="page-stats mini">
      <div><TruckIcon /><span>Fleet size</span><strong>{vehicles.length}</strong></div>
      <div><Fuel /><span>Average fuel</span><strong>{vehicles.length ? Math.round(vehicles.reduce((sum, v) => sum + v.fuel, 0) / vehicles.length) : 0}%</strong></div>
      <div><Wrench /><span>Maintenance</span><strong>{vehicles.filter(v => v.status === 'Maintenance').length}</strong></div>
    </div>
    <section className="card">
      <PageToolbar search={search} onSearch={setSearch} placeholder="Search registration, model or location..." onAdd={() => { setSelected(null); setOpen(true) }} addLabel="Add Vehicle">
        <select className="select" aria-label="Filter by status" value={status} onChange={e => setStatus(e.target.value)}><option>All</option><option>Active</option><option>Idle</option><option>Maintenance</option><option>Offline</option></select>
        <select className="select" aria-label="Filter by location" value={location} onChange={e => setLocation(e.target.value)}><option>All</option>{locations.map(place => <option key={place}>{place}</option>)}</select>
      </PageToolbar>
      <div className="table-scroll"><table><thead><tr><th>Vehicle</th><th>Status</th><th>Driver</th><th>Location</th><th>Fuel</th><th>Next service</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(v => <tr key={v.id}>
          <td><div className="entity"><div className="entity-icon"><TruckIcon /></div><div><strong>{v.registration}</strong><span>{v.model} · {v.type}</span></div></div></td>
          <td><StatusBadge>{v.status}</StatusBadge></td><td>{drivers.find(d => d.id === v.driverId)?.name || <span className="muted-text">Unassigned</span>}</td><td>{v.location}</td>
          <td><div className="fuel-cell"><span>{v.fuel}%</span><div className="fuel-bar"><i style={{ width: `${v.fuel}%` }} /></div></div></td><td>{v.nextService || 'Not scheduled'}</td>
          <td><div className="row-actions"><button title="View vehicle history" aria-label="View vehicle history" onClick={() => setViewing(v)}><Eye size={16} /></button><button title="Edit vehicle" aria-label="Edit vehicle" onClick={() => { setSelected(v); setOpen(true) }}><Edit3 size={16} /></button><button title="Remove vehicle" aria-label="Remove vehicle" onClick={() => { if (window.confirm(`Remove ${v.registration} from the fleet?`)) removeVehicle(v.id) }}><Trash2 size={16} /></button></div></td>
        </tr>)}</tbody></table>{filtered.length === 0 && <EmptyState message="No vehicles match these filters." />}</div>
    </section>
    <Modal open={open} title={selected ? 'Edit vehicle' : 'Add vehicle'} onClose={() => { setOpen(false); setSelected(null) }}>
      <form onSubmit={saveVehicle}>
        <div className="form-grid">
          <label>Registration number<input name="registration" defaultValue={selected?.registration} placeholder="KA 01 AB 1234" required maxLength={20} /></label>
          <label>Model<input name="model" defaultValue={selected?.model} placeholder="Vehicle model" required /></label>
          <label>Vehicle type<select name="type" defaultValue={selected?.type ?? 'Heavy Truck'}><option>Heavy Truck</option><option>Medium Truck</option><option>Light Truck</option><option>Pickup</option><option>Mini Truck</option></select></label>
          <label>Status<select name="status" defaultValue={selected?.status ?? 'Active'}><option>Active</option><option>Idle</option><option>Maintenance</option><option>Offline</option></select></label>
          <label>Assign driver<select name="driver" defaultValue={drivers.find(d => d.id === selected?.driverId)?.name ?? ''}><option value="">Unassigned</option>{drivers.map(d => <option key={d.id}>{d.name}</option>)}</select></label>
          <label>Current location<input name="location" defaultValue={selected?.location} placeholder="e.g. Bengaluru Depot" required /></label>
          <label>Fuel level (%)<input name="fuel" type="number" min="0" max="100" defaultValue={selected?.fuel ?? 75} required /></label>
          <label>Odometer (km)<input name="mileage" type="number" min="0" defaultValue={selected?.mileage ?? 0} required /></label>
          <label>Next service date<input name="nextService" type="date" defaultValue={toDateInput(selected?.nextService)} /></label>
        </div>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button type="submit" className="primary-button">{selected ? 'Save changes' : 'Save vehicle'}</button></div>
      </form>
    </Modal>
    <Modal open={!!viewing} title="Vehicle activity & details" onClose={() => setViewing(null)}>
      {viewing && <div className="detail-modal"><div className="entity"><div className="entity-icon"><TruckIcon /></div><div><strong>{viewing.registration}</strong><span>{viewing.model} · {viewing.type}</span></div></div><div className="detail-stats"><div><span>Status</span><strong>{viewing.status}</strong></div><div><span>Fuel</span><strong>{viewing.fuel}%</strong></div><div><span>Odometer</span><strong>{viewing.mileage.toLocaleString('en-IN')} km</strong></div></div><p><strong>Current location:</strong> {viewing.location}</p><p><strong>Assigned driver:</strong> {drivers.find(d => d.id === viewing.driverId)?.name ?? 'Unassigned'}</p><p><strong>Last activity:</strong> {viewing.lastActivity}</p><p><strong>Next service:</strong> {viewing.nextService || 'Not scheduled'}</p></div>}
    </Modal>
  </>
}

function toDateInput(value?: string) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '' : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`
}

function TruckIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg> }
