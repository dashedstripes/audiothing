import './PerspectiveFilter.css'

export type BrowserPerspective = 'raw' | 'drafts' | 'published'

interface PerspectiveFilterProps {
  selectedPerspective: BrowserPerspective
  onPerspectiveChange: (perspective: BrowserPerspective) => void
}

const perspectives: { value: BrowserPerspective; label: string }[] = [
  { value: 'raw', label: 'Raw' },
  { value: 'drafts', label: 'Drafts' },
  { value: 'published', label: 'Published' },
]

export function PerspectiveFilter({
  selectedPerspective,
  onPerspectiveChange,
}: PerspectiveFilterProps) {
  return (
    <div className="perspective-filter">
      <span className="perspective-filter-label">View</span>
      <div className="perspective-filter-buttons">
        {perspectives.map(({ value, label }) => (
          <button
            key={value}
            className={`perspective-filter-button ${selectedPerspective === value ? 'active' : ''}`}
            onClick={() => onPerspectiveChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
