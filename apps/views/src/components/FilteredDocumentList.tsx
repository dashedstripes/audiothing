import { Suspense } from 'react'
import { usePaginatedDocuments } from '@sanity/sdk-react'
import { DocumentItem } from './DocumentItem'
import { Pagination } from './Pagination'
import { formatTypeName } from '../utils/formatters'
import './DocumentList.css'

interface FilteredDocumentListProps {
  documentType: string
}

const PAGE_SIZE = 20

export function FilteredDocumentList({ documentType }: FilteredDocumentListProps) {
  const {
    data: handles,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    isPending,
    currentPage,
    totalPages,
    count,
  } = usePaginatedDocuments({
    documentType,
    pageSize: PAGE_SIZE,
    orderings: [{ field: '_updatedAt', direction: 'desc' }],
  })

  if (handles.length === 0 && !isPending) {
    return (
      <div className="document-list">
        <div className="document-list-empty">
          <h3 className="document-list-empty-title">No documents found</h3>
          <p className="document-list-empty-text">
            No {formatTypeName(documentType)} documents exist in the Content Lake.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="document-list">
      <div className="document-list-header">
        <h2 className="document-list-title">{formatTypeName(documentType)}</h2>
        <span className="document-list-count">
          {count > 0 ? `${count} documents` : 'Loading...'}
        </span>
      </div>

      <ul className="document-list-items">
        {handles.map((handle) => (
          <Suspense
            key={handle.documentId}
            fallback={
              <li className="document-item document-item-loading">Loading...</li>
            }
          >
            <DocumentItem handle={handle} />
          </Suspense>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={nextPage}
          onPrevious={previousPage}
          hasNext={hasNextPage}
          hasPrevious={hasPreviousPage}
          isPending={isPending}
        />
      )}
    </div>
  )
}
