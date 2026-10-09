import { Search, SlidersHorizontal, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  search: string
  onSearch: (value: string) => void
  placeholder?: string
  onAdd?: () => void
  addLabel?: string
  children?: ReactNode
}

export function PageToolbar({ search, onSearch, placeholder = 'Search...', onAdd, addLabel = 'Add New', children }: Props) {
  return (
    <div className="toolbar">
      <div className="search-box"><Search size={17}/><input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder}/></div>
      <div className="toolbar-right">
        {children}
        <button className="filter-button"><SlidersHorizontal size={16}/> Filters</button>
        {onAdd && <button className="primary-button" onClick={onAdd}><Plus size={17}/> {addLabel}</button>}
      </div>
    </div>
  )
}
