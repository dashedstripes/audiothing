import { Suspense, useState } from 'react'
import { TypeFilter } from './TypeFilter'
import { FilteredDocumentList } from './FilteredDocumentList'
import { AllDocumentsList } from './AllDocumentsList'
import { LoadingSpinner } from './LoadingSpinner'
import './ContentBrowser.css'

export function ContentBrowser() {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  return (
    <div className="content-browser">
      <header className="content-browser-header">
        <h1 className="content-browser-title">Content Browser</h1>
        <p className="content-browser-subtitle">
          Browse all documents in the Content Lake
        </p>
      </header>

      <Suspense fallback={<LoadingSpinner label="Loading types..." />}>
        <TypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />
      </Suspense>

      <Suspense fallback={<LoadingSpinner label="Loading documents..." />}>
        {selectedType === null ? (
          <AllDocumentsList />
        ) : (
          <FilteredDocumentList documentType={selectedType} />
        )}
      </Suspense>
    </div>
  )
}
