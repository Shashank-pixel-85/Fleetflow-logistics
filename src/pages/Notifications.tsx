import { useState } from 'react'
import { AlertTriangle, Bell, CheckCircle2, Info, Trash2, Wrench } from 'lucide-react'
import { useFleet } from '../context/FleetContext'

const icon = (type: string) => type === 'danger' ? <AlertTriangle /> : type === 'warning' ? <Wrench /> : <CheckCircle2 />

export default function Notifications() {
  const { alerts, dismissAlert } = useFleet()
  const [readIds, setReadIds] = useState<string[]>([])
  const markAllRead = () => setReadIds(alerts.map(alert => alert.id))
  const delayedCount = alerts.filter(a => a.type === 'danger').length
  const maintenanceCount = alerts.filter(a => a.type === 'warning').length
  const infoCount = alerts.filter(a => a.type === 'info').length
  return <div className="notification-layout">
    <section className="card"><div className="section-head"><div><h2>Notifications</h2><p>Recent alerts and operational updates</p></div><button className="ghost-button" onClick={markAllRead}><CheckCircle2 size={14}/> Mark all as read</button></div>
      <div className="notification-list">{alerts.map(a => <div className={`notification-row ${readIds.includes(a.id) ? 'is-read' : ''}`} key={a.id}><div className={`notification-icon ${a.type}`}>{icon(a.type)}</div><div className="notification-body"><div><strong>{a.title}</strong><span>{a.time}</span></div><p>{a.description}</p><small>{readIds.includes(a.id) ? 'Read · ' : 'Unread · '}FleetFlow Operations</small></div><div className="notification-actions"><button className="more-dot" aria-label={readIds.includes(a.id) ? 'Mark unread' : 'Mark read'} title={readIds.includes(a.id) ? 'Mark unread' : 'Mark read'} onClick={() => setReadIds(current => current.includes(a.id) ? current.filter(id => id !== a.id) : [...current, a.id])}><Bell size={15}/></button><button className="more-dot" aria-label="Dismiss alert" title="Dismiss alert" onClick={() => dismissAlert(a.id)}><Trash2 size={15}/></button></div></div>)}{alerts.length === 0 && <div className="empty-state"><div className="empty-icon"><Bell size={22}/></div><strong>All caught up</strong><span>There are no open alerts right now.</span></div>}</div>
    </section>
    <section className="card alert-summary"><div className="section-head"><div><h2>Alert summary</h2><p>Open operational exceptions</p></div></div><div className="alert-box danger"><div><AlertTriangle/><strong>Delayed shipment alerts</strong><span>Needs attention</span></div><strong>{delayedCount}</strong></div><div className="alert-box warning"><div><Wrench/><strong>Maintenance / warning alerts</strong><span>Review these items</span></div><strong>{maintenanceCount}</strong></div><div className="alert-box info"><div><Info/><strong>Informational updates</strong><span>Delivery and fleet updates</span></div><strong>{infoCount}</strong></div><p className="alert-note">Alert counts reflect the sample notifications currently in the list. Dismissed alerts are removed from the dashboard too.</p></section>
  </div>
}
