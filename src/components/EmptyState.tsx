import { Inbox } from 'lucide-react'

export function EmptyState({ message = 'No records found.' }: { message?: string }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Inbox size={22}/></div>
      <strong>{message}</strong>
      <span>Try adjusting your search or filters.</span>
    </div>
  )
}
