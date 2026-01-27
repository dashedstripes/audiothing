import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
  isPending?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  isPending = false,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={onPrevious}
        disabled={!hasPrevious || isPending}
        aria-label="Previous page"
      >
        <span className="pagination-arrow">←</span>
        Previous
      </button>

      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="pagination-button"
        onClick={onNext}
        disabled={!hasNext || isPending}
        aria-label="Next page"
      >
        Next
        <span className="pagination-arrow">→</span>
      </button>
    </div>
  )
}
