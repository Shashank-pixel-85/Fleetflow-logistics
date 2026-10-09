import { useState } from 'react'
import { CheckCircle2, RotateCcw, Settings2 } from 'lucide-react'
import { useFleet } from '../context/FleetContext'

export default function Settings() {
  const { resetDemoData } = useFleet()
  const [saved, setSaved] = useState(false)
  const [workspace, setWorkspace] = useState('FleetFlow Logistics')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true)
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2500) }
  return <section className="card settings-page"><div className="section-head"><div><h2>Workspace settings</h2><p>Manage your FleetFlow workspace preferences.</p></div></div>
    <div className="settings-row settings-edit-row"><div><strong>Workspace name</strong><span>Used in your operations workspace</span></div><input aria-label="Workspace name" value={workspace} onChange={e => setWorkspace(e.target.value)} /></div>
    <div className="settings-row settings-edit-row"><div><strong>Delivery and operational alerts</strong><span>Show delivery updates and operational notifications</span></div><label className="toggle-label"><input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} /> Enabled</label></div>
    <div className="settings-row settings-edit-row"><div><strong>Maintenance reminders</strong><span>Keep vehicle service and maintenance warnings enabled</span></div><label className="toggle-label"><input type="checkbox" checked={maintenanceAlerts} onChange={e => setMaintenanceAlerts(e.target.checked)} /> Enabled</label></div>
    <div className="settings-row"><div><strong>API connection</strong><span>Mock data mode · service layer ready for backend integration</span></div><span className="badge badge-green"><CheckCircle2 size={12}/> Demo mode</span></div>
    <div className="settings-row"><div><strong>Restore demo records</strong><span>Reset any local changes and restore the original sample data.</span></div><button className="secondary-button" onClick={() => { if (window.confirm('Restore all original demo data? This will remove local changes.')) resetDemoData() }}><RotateCcw size={14}/> Reset data</button></div>
    <div className="settings-footer"><span>{saved ? <><CheckCircle2 size={15}/> Preferences saved for this session.</> : <><Settings2 size={15}/> Preferences are local to this demo.</>}</span><button className="primary-button" onClick={save}>Save preferences</button></div>
    <p className="settings-disclaimer">This is a frontend demonstration. Workspace preferences are not sent to a server and real notifications require backend integration.</p>
  </section>
}
