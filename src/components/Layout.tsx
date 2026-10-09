import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell, ChevronLeft, ChevronRight, LayoutDashboard, Map, Menu,
  Package, Settings, Truck, Users, X
} from 'lucide-react'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vehicles', label: 'Vehicles', icon: Truck },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/shipments', label: 'Shipments', icon: Package },
  { to: '/tracking', label: 'Live Tracking', icon: Map },
  { to: '/notifications', label: 'Alerts & Activity', icon: Bell },
]

const titles: Record<string, [string, string]> = {
  '/': ['Operations Dashboard', 'Real-time overview of your logistics network'],
  '/vehicles': ['Vehicle Management', 'Monitor your fleet, fuel and maintenance'],
  '/drivers': ['Driver Management', 'Manage drivers, availability and performance'],
  '/shipments': ['Shipment Management', 'Create, track and manage deliveries'],
  '/tracking': ['Live Fleet Tracking', 'Monitor vehicles and active routes'],
  '/notifications': ['Alerts & Activity', 'Stay ahead of exceptions and updates'],
  '/settings': ['Settings', 'Manage workspace preferences and demo data'],
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] ?? titles['/']

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Truck size={20}/></div>
          {!collapsed && <div><strong>FleetFlow</strong><span>Logistics OS</span></div>}
          <button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={19}/></button>
        </div>

        <div className="nav-label">{!collapsed && 'Workspace'}</div>
        <nav className="side-nav">
          {nav.map(item => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={19}/><span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/settings" className="nav-item"><Settings size={19}/><span>Settings</span></NavLink>
          <div className="user-mini">
            <div className="avatar">SH</div>
            {!collapsed && <div><strong>Shashank Hiremath</strong><span>Operations Admin</span></div>}
          </div>
        </div>

        <button className="collapse-btn" onClick={() => setCollapsed(v => !v)}>
          {collapsed ? <ChevronRight size={17}/> : <ChevronLeft size={17}/>}
        </button>
      </aside>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}/>}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileOpen(true)}><Menu/></button>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="topbar-actions">
            <Link to="/notifications" className="icon-button notification-button" aria-label="Open notifications"><Bell size={19}/><i/></Link>
            <div className="top-avatar">SH</div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
