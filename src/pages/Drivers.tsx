import { useMemo, useState, type FormEvent } from 'react'
import { Edit3, Eye, Phone, Star, Trash2 } from 'lucide-react'
import { useFleet } from '../context/FleetContext'
import type { Driver } from '../types'
import { PageToolbar } from '../components/PageToolbar'
import { StatusBadge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { initials } from '../utils/helpers'
import { Modal } from '../components/Modal'

export default function Drivers() {
  const { drivers, vehicles, addDriver, updateDriver, removeDriver } = useFleet()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Driver | null>(null)
  const [viewing, setViewing] = useState<Driver | null>(null)
  const filtered = useMemo(() => drivers.filter(d => {
    const q = search.toLowerCase()
    return (!q || `${d.name} ${d.phone} ${d.location} ${d.license}`.toLowerCase().includes(q)) && (status === 'All' || d.status === status)
  }), [drivers, search, status])

  function saveDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const vehicleName = String(data.get('vehicle') || '')
    const vehicle = vehicles.find(v => v.registration === vehicleName)
    const item: Driver = {
      id: selected?.id ?? `DR-${String(Date.now()).slice(-5)}`,
      name: String(data.get('name')).trim(), phone: String(data.get('phone')).trim(),
      license: String(data.get('license')).trim().toUpperCase(), status: String(data.get('status')) as Driver['status'],
      vehicleId: vehicle?.id, rating: selected?.rating ?? 5, deliveries: selected?.deliveries ?? 0,
      onTime: selected?.onTime ?? 100, location: String(data.get('location')).trim(),
    }
    if (selected) updateDriver(item); else addDriver(item)
    setOpen(false); setSelected(null)
  }

  return <>
    <div className="profile-grid">{drivers.slice(0, 3).map(d => <div className="card driver-highlight" key={d.id}><div className="avatar large">{initials(d.name)}</div><div><strong>{d.name}</strong><span>{d.status}</span><div className="rating"><Star size={14} fill="currentColor" />{d.rating}</div></div><div className="driver-metric"><strong>{d.onTime}%</strong><span>On-time</span></div></div>)}</div>
    <section className="card">
      <PageToolbar search={search} onSearch={setSearch} placeholder="Search driver, phone, license or location..." onAdd={() => { setSelected(null); setOpen(true) }} addLabel="Add Driver">
        <select className="select" aria-label="Filter drivers by status" value={status} onChange={e => setStatus(e.target.value)}><option>All</option><option>Available</option><option>On Delivery</option><option>Off Duty</option></select>
      </PageToolbar>
      <div className="table-scroll"><table><thead><tr><th>Driver</th><th>Status</th><th>Vehicle</th><th>Rating</th><th>Deliveries</th><th>On-time</th><th>Contact / Actions</th></tr></thead>
        <tbody>{filtered.map(d => <tr key={d.id}><td><div className="entity"><div className="avatar">{initials(d.name)}</div><div><strong>{d.name}</strong><span>{d.license}</span></div></div></td><td><StatusBadge>{d.status}</StatusBadge></td><td>{vehicles.find(v => v.id === d.vehicleId)?.registration ?? <span className="muted-text">Unassigned</span>}</td><td><span className="rating"><Star size={14} fill="currentColor" />{d.rating}</span></td><td>{d.deliveries}</td><td><strong>{d.onTime}%</strong></td><td><div className="row-actions"><a title="Call driver" aria-label={`Call ${d.name}`} href={`tel:${d.phone}`}><Phone size={16} /></a><button title="View driver" aria-label="View driver" onClick={() => setViewing(d)}><Eye size={16} /></button><button title="Edit driver" aria-label="Edit driver" onClick={() => { setSelected(d); setOpen(true) }}><Edit3 size={16} /></button><button title="Remove driver" aria-label="Remove driver" onClick={() => { if (window.confirm(`Remove ${d.name} from driver records?`)) removeDriver(d.id) }}><Trash2 size={16} /></button></div></td></tr>)}</tbody>
      </table>{filtered.length === 0 && <EmptyState message="No drivers match these filters." />}</div>
    </section>
    <Modal open={open} title={selected ? 'Edit driver' : 'Add driver'} onClose={() => { setOpen(false); setSelected(null) }}>
      <form onSubmit={saveDriver}><div className="form-grid">
        <label>Full name<input name="name" defaultValue={selected?.name} placeholder="Driver name" required /></label>
        <label>Phone number<input name="phone" type="tel" defaultValue={selected?.phone} placeholder="+91 98765 43210" pattern="[+0-9() -]{8,20}" required /></label>
        <label>License number<input name="license" defaultValue={selected?.license} placeholder="KA-2026-00000" required /></label>
        <label>Status<select name="status" defaultValue={selected?.status ?? 'Available'}><option>Available</option><option>On Delivery</option><option>Off Duty</option></select></label>
        <label>Assigned vehicle<select name="vehicle" defaultValue={vehicles.find(v => v.id === selected?.vehicleId)?.registration ?? ''}><option value="">Unassigned</option>{vehicles.map(v => <option key={v.id}>{v.registration}</option>)}</select></label>
        <label>Current location<input name="location" defaultValue={selected?.location} placeholder="e.g. Bengaluru" required /></label>
      </div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button type="submit" className="primary-button">{selected ? 'Save changes' : 'Save driver'}</button></div></form>
    </Modal>
    <Modal open={!!viewing} title="Driver profile & performance" onClose={() => setViewing(null)}>
      {viewing && <div className="detail-modal"><div className="entity"><div className="avatar large">{initials(viewing.name)}</div><div><strong>{viewing.name}</strong><span>{viewing.license}</span></div><StatusBadge>{viewing.status}</StatusBadge></div><div className="detail-stats"><div><span>Rating</span><strong>{viewing.rating} / 5</strong></div><div><span>Deliveries</span><strong>{viewing.deliveries}</strong></div><div><span>On-time</span><strong>{viewing.onTime}%</strong></div></div><p><strong>Phone:</strong> {viewing.phone}</p><p><strong>Location:</strong> {viewing.location}</p><p><strong>Assigned vehicle:</strong> {vehicles.find(v => v.id === viewing.vehicleId)?.registration ?? 'Unassigned'}</p><p><strong>Delivery history:</strong> {viewing.deliveries} completed deliveries in the demo record.</p></div>}
    </Modal>
  </>
}
