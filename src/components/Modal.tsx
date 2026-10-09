import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">FleetFlow</p>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" onClick={onClose}><X size={19}/></button>
        </div>
        {children}
      </div>
    </div>
  )
}
