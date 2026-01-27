import { Suspense, useState } from 'react'
import { type DocumentHandle } from '@sanity/sdk-react'
import { TypeFilter } from './TypeFilter'
import { PerspectiveFilter, type BrowserPerspective } from './PerspectiveFilter'
import { FilteredDocumentList } from './FilteredDocumentList'
import { AllDocumentsList } from './AllDocumentsList'
import { DocumentEditor } from './DocumentEditor'
import { LoadingSpinner } from './LoadingSpinner'
import './ContentBrowser.css'

export function ContentBrowser() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedPerspective, setSelectedPerspective] = useState<BrowserPerspective>('raw')
  const [selectedDocument, setSelectedDocument] = useState<DocumentHandle | null>(null)

  return (
    <div className="content-browser">
      <header className="content-browser-header">
        <h1 className="content-browser-title">Content Browser</h1>
        <p className="content-browser-subtitle">
          Browse all documents in the Content Lake
        </p>
      </header>

      <div className="content-browser-filters">
        <Suspense fallback={<LoadingSpinner label="Loading types..." />}>
          <TypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />
        </Suspense>
        <PerspectiveFilter
          selectedPerspective={selectedPerspective}
          onPerspectiveChange={setSelectedPerspective}
        />
      </div>

      <Suspense fallback={<LoadingSpinner label="Loading documents..." />}>
        {selectedType === null ? (
          <AllDocumentsList
            perspective={selectedPerspective}
            onDocumentSelect={setSelectedDocument}
          />
        ) : (
          <FilteredDocumentList
            documentType={selectedType}
            perspective={selectedPerspective}
            onDocumentSelect={setSelectedDocument}
          />
        )}
      </Suspense>

      {selectedDocument && (
        <DocumentEditor
          handle={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  )
}
