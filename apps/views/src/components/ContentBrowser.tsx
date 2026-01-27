import { Suspense, useState } from 'react'
import { TypeFilter } from './TypeFilter'
import { PerspectiveFilter, type BrowserPerspective } from './PerspectiveFilter'
import { FilteredDocumentList } from './FilteredDocumentList'
import { AllDocumentsList } from './AllDocumentsList'
import { LoadingSpinner } from './LoadingSpinner'
import './ContentBrowser.css'

export function ContentBrowser() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedPerspective, setSelectedPerspective] = useState<BrowserPerspective>('raw')

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
          <AllDocumentsList perspective={selectedPerspective} />
        ) : (
          <FilteredDocumentList documentType={selectedType} perspective={selectedPerspective} />
        )}
      </Suspense>
    </div>
  )
}
