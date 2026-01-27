import { Suspense, useState, useMemo } from 'react'
import { useQuery, type DocumentHandle } from '@sanity/sdk-react'
import { DocumentItem } from './DocumentItem'
import { Pagination } from './Pagination'
import { LoadingSpinner } from './LoadingSpinner'
import './DocumentList.css'

const PAGE_SIZE = 20

interface QueryResult {
  items: Array<{ _id: string; _type: string }>
  total: number
}

export function AllDocumentsList() {
  const [currentPage, setCurrentPage] = useState(1)

  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const { data, isPending } = useQuery<QueryResult>({
    query: `{
      "items": *[!(_id in path("_.**")) && !(_type match "system.*")] | order(_updatedAt desc) [$start...$end] { _id, _type },
      "total": count(*[!(_id in path("_.**")) && !(_type match "system.*")])
    }`,
    params: { start, end },
  })

  const handles: DocumentHandle[] = useMemo(() => {
    if (!data?.items) return []
    return data.items.map((item) => ({
      documentId: item._id,
      documentType: item._type,
    }))
  }, [data?.items])

  const totalPages = useMemo(() => {
    if (!data?.total) return 1
    return Math.ceil(data.total / PAGE_SIZE)
  }, [data?.total])

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1)
    }
  }

  if (handles.length === 0 && !isPending) {
    return (
      <div className="document-list">
        <div className="document-list-empty">
          <h3 className="document-list-empty-title">No documents found</h3>
          <p className="document-list-empty-text">
            The Content Lake is empty.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="document-list">
      <div className="document-list-header">
        <h2 className="document-list-title">All Documents</h2>
        <span className="document-list-count">
          {data?.total ? `${data.total} documents` : 'Loading...'}
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
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={currentPage < totalPages}
          hasPrevious={currentPage > 1}
          isPending={isPending}
        />
      )}
    </div>
  )
}
