import { useQuery } from '@sanity/sdk-react'
import { formatTypeName } from '../utils/formatters'
import './TypeFilter.css'

interface TypeFilterProps {
  selectedType: string | null
  onTypeChange: (type: string | null) => void
}

export function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
  const { data: types, isPending } = useQuery<string[]>({
    query: `array::unique(*[]._type)`,
  })

  // Filter out system types (starting with _ or system.)
  const userTypes = (types ?? []).filter(
    (type) => !type.startsWith('_') && !type.startsWith('system.')
  ).sort()

  if (isPending) {
    return (
      <div className="type-filter">
        <span className="type-filter-loading">Loading types...</span>
      </div>
    )
  }

  return (
    <div className="type-filter">
      <span className="type-filter-label">Filter by type</span>
      <div className="type-filter-buttons">
        <button
          className={`type-filter-button ${selectedType === null ? 'active' : ''}`}
          onClick={() => onTypeChange(null)}
        >
          All Types
        </button>
        {userTypes.map((type) => (
          <button
            key={type}
            className={`type-filter-button ${selectedType === type ? 'active' : ''}`}
            onClick={() => onTypeChange(type)}
          >
            {formatTypeName(type)}
          </button>
        ))}
      </div>
    </div>
  )
}
