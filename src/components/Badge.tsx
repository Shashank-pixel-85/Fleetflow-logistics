import type { ReactNode } from 'react'

export function StatusBadge({ children }: { children: ReactNode }) {
  const value = String(children)
  const styles =
    ['Active', 'Available', 'Delivered'].includes(value) ? 'badge badge-green' :
    ['In Transit', 'On Delivery', 'Pending'].includes(value) ? 'badge badge-blue' :
    ['Delayed', 'Maintenance'].includes(value) ? 'badge badge-red' :
    'badge badge-gray'
  return <span className={styles}>{children}</span>
}
