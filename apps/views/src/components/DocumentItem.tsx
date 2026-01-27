import { useRef } from 'react'
import { useDocumentProjection, type DocumentHandle } from '@sanity/sdk-react'
import { formatTypeName, formatDate, truncate } from '../utils/formatters'

interface DocumentItemProps {
  handle: DocumentHandle
}

interface DocumentProjection {
  _id: string
  _type: string
  _updatedAt: string
  title: string
  description: string
}

export function DocumentItem({ handle }: DocumentItemProps) {
  const ref = useRef<HTMLLIElement>(null)

  const { data, isPending } = useDocumentProjection<DocumentProjection>({
    ...handle,
    projection: `{
      _id,
      _type,
      _updatedAt,
      "title": coalesce(title, name, headline, subject, _id),
      "description": coalesce(description, excerpt, summary, "")
    }`,
    ref,
  })

  if (isPending || !data) {
    return (
      <li ref={ref} className="document-item document-item-loading">
        Loading...
      </li>
    )
  }

  return (
    <li ref={ref} className="document-item">
      <span className="document-item-type-badge">
        {formatTypeName(data._type)}
      </span>
      <div className="document-item-content">
        <h3 className="document-item-title">{data.title}</h3>
        {data.description && (
          <p className="document-item-description">
            {truncate(data.description, 150)}
          </p>
        )}
      </div>
      <div className="document-item-meta">
        <span className="document-item-date">
          {formatDate(data._updatedAt)}
        </span>
      </div>
    </li>
  )
}
