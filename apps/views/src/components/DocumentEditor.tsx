import React, { Suspense, useState } from 'react'
import {
  useDocument,
  useEditDocument,
  useApplyDocumentActions,
  publishDocument,
  unpublishDocument,
  type DocumentHandle,
} from '@sanity/sdk-react'
import { formatTypeName, formatDate } from '../utils/formatters'
import { sortFieldsBySchema } from '../schemaConfig'
import { LoadingSpinner } from './LoadingSpinner'
import { PortableTextField } from './PortableTextField'
import './DocumentEditor.css'

interface DocumentEditorProps {
  handle: DocumentHandle
  onClose: () => void
}

export function DocumentEditor({ handle, onClose }: DocumentEditorProps) {
  return (
    <div className="document-editor-overlay" onClick={onClose}>
      <aside className="document-editor-panel" onClick={(e) => e.stopPropagation()}>
        <Suspense fallback={<LoadingSpinner label="Loading document..." />}>
          <DocumentEditorContent handle={handle} onClose={onClose} />
        </Suspense>
      </aside>
    </div>
  )
}

function DocumentEditorContent({ handle, onClose }: DocumentEditorProps) {
  const { data: document } = useDocument({ ...handle })
  const apply = useApplyDocumentActions()
  const [actionPending, setActionPending] = useState(false)

  if (!document) {
    return (
      <div className="document-editor-empty">
        <p>Document not found</p>
        <button className="editor-button" onClick={onClose}>Close</button>
      </div>
    )
  }

  const isDraft = handle.documentId.startsWith('drafts.')

  async function handlePublish() {
    setActionPending(true)
    try {
      await apply(publishDocument(handle))
    } finally {
      setActionPending(false)
    }
  }

  async function handleUnpublish() {
    setActionPending(true)
    try {
      await apply(unpublishDocument(handle))
    } finally {
      setActionPending(false)
    }
  }

  // Get editable fields (exclude system fields) and sort by schema order
  const editableFields = sortFieldsBySchema(
    Object.entries(document).filter(([key]) => !key.startsWith('_')),
    handle.documentType
  )

  return (
    <>
      <header className="document-editor-header">
        <div className="document-editor-header-top">
          <span className="document-editor-type-badge">
            {formatTypeName(handle.documentType)}
          </span>
          <button
            className="document-editor-close"
            onClick={onClose}
            aria-label="Close editor"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="document-editor-meta">
          <span className="document-editor-id">{handle.documentId}</span>
          {document._updatedAt && (
            <span className="document-editor-updated">
              Updated {formatDate(document._updatedAt as string)}
            </span>
          )}
        </div>
      </header>

      <div className="document-editor-actions">
        {isDraft ? (
          <button
            className="editor-button editor-button-primary"
            onClick={handlePublish}
            disabled={actionPending}
          >
            {actionPending ? 'Publishing...' : 'Publish'}
          </button>
        ) : (
          <button
            className="editor-button"
            onClick={handleUnpublish}
            disabled={actionPending}
          >
            {actionPending ? 'Unpublishing...' : 'Unpublish'}
          </button>
        )}
        <span className="document-editor-status">
          {isDraft ? 'Draft' : 'Published'}
        </span>
      </div>

      <div className="document-editor-fields">
        {editableFields.length === 0 ? (
          <p className="document-editor-no-fields">No editable fields</p>
        ) : (
          editableFields.map(([key, value]) => (
            <Suspense key={key} fallback={<FieldSkeleton label={key} />}>
              <DocumentField handle={handle} fieldKey={key} initialValue={value} />
            </Suspense>
          ))
        )}
      </div>
    </>
  )
}

interface DocumentFieldProps {
  handle: DocumentHandle
  fieldKey: string
  initialValue: unknown
}

// Common field names that typically contain Portable Text
const PORTABLE_TEXT_FIELDS = ['body', 'content', 'description', 'bio', 'text', 'excerpt', 'summary']

function isPortableTextArray(value: unknown, fieldKey: string): boolean {
  // Check if it's a known Portable Text field name
  const isKnownField = PORTABLE_TEXT_FIELDS.includes(fieldKey.toLowerCase())

  // Check if the value looks like Portable Text (array of blocks with _type)
  if (!Array.isArray(value) || value.length === 0) {
    return isKnownField // Allow empty arrays for known fields
  }

  // Check if first item has _type (Portable Text blocks have _type: 'block')
  const firstBlock = value[0]
  if (typeof firstBlock !== 'object' || firstBlock === null) {
    return false
  }

  return '_type' in firstBlock && (
    firstBlock._type === 'block' ||
    isKnownField
  )
}

function DocumentField({ handle, fieldKey, initialValue }: DocumentFieldProps) {
  const { data: value } = useDocument({ ...handle, path: fieldKey })
  const editField = useEditDocument({ ...handle, path: fieldKey })

  const fieldValue = value ?? initialValue
  const fieldType = getFieldType(fieldValue)

  // Use Portable Text editor for body/content fields
  if (isPortableTextArray(fieldValue, fieldKey)) {
    return (
      <div className="document-field">
        <label className="document-field-label">{formatFieldName(fieldKey)}</label>
        <PortableTextField handle={handle} fieldKey={fieldKey} />
      </div>
    )
  }

  return (
    <div className="document-field">
      <label className="document-field-label">{formatFieldName(fieldKey)}</label>
      {renderFieldInput(fieldType, fieldValue, editField, fieldKey)}
    </div>
  )
}

function FieldSkeleton({ label }: { label: string }) {
  return (
    <div className="document-field document-field-loading">
      <label className="document-field-label">{formatFieldName(label)}</label>
      <div className="document-field-skeleton" />
    </div>
  )
}

type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null'

function getFieldType(value: unknown): FieldType {
  if (value === null || value === undefined) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  return 'string'
}

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}

function renderFieldInput(
  type: FieldType,
  value: unknown,
  onChange: (value: unknown) => void,
  _key: string
): React.ReactNode {
  switch (type) {
    case 'string': {
      const strValue = value as string
      const isLongText = strValue.length > 100 || strValue.includes('\n')

      if (isLongText) {
        return (
          <textarea
            className="document-field-textarea"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.min(10, Math.max(3, strValue.split('\n').length + 1))}
          />
        )
      }

      return (
        <input
          type="text"
          className="document-field-input"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    }

    case 'number':
      return (
        <input
          type="number"
          className="document-field-input"
          value={value as number}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
      )

    case 'boolean':
      return (
        <label className="document-field-checkbox">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="document-field-checkbox-label">
            {value ? 'Yes' : 'No'}
          </span>
        </label>
      )

    case 'array':
      return (
        <div className="document-field-readonly">
          <span className="document-field-badge">Array</span>
          <span className="document-field-count">
            {(value as unknown[]).length} items
          </span>
          <details className="document-field-details">
            <summary>View JSON</summary>
            <pre className="document-field-json">
              {JSON.stringify(value, null, 2)}
            </pre>
          </details>
        </div>
      )

    case 'object':
      return (
        <div className="document-field-readonly">
          <span className="document-field-badge">Object</span>
          <details className="document-field-details">
            <summary>View JSON</summary>
            <pre className="document-field-json">
              {JSON.stringify(value, null, 2)}
            </pre>
          </details>
        </div>
      )

    case 'null':
      return (
        <input
          type="text"
          className="document-field-input document-field-input-null"
          value=""
          placeholder="Empty"
          onChange={(e) => onChange(e.target.value || null)}
        />
      )

    default:
      return <span className="document-field-unknown">Unknown field type</span>
  }
}
