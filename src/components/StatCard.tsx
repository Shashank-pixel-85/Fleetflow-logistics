import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string
  change: string
  positive?: boolean
  icon: LucideIcon
  tone?: string
}

export function StatCard({ label, value, change, positive = true, icon: Icon, tone = '' }: Props) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20}/></div>
      <div className="stat-info"><span>{label}</span><strong>{value}</strong><small className={positive ? 'positive' : 'negative'}>{change} <em>vs last week</em></small></div>
    </div>
  )
}
