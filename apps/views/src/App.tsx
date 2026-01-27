import { Suspense, useState } from 'react'
import { type SanityConfig } from '@sanity/sdk'
import { type DocumentHandle } from '@sanity/sdk-react'
import { SanityApp } from '@sanity/sdk-react'
import { ContentBrowser } from './components/ContentBrowser'
import { DocumentEditor } from './components/DocumentEditor'
import { LoadingSpinner } from './components/LoadingSpinner'
import './App.css'

function App() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentHandle | null>(null)

  const sanityConfigs: SanityConfig[] = [
    {
      projectId: 'n3ipr1xb',
      dataset: 'production',
    }
  ]

  return (
    <SanityApp config={sanityConfigs} fallback={<LoadingSpinner label="Connecting to Sanity..." />}>
      <div className="app-container">
        <Suspense fallback={<LoadingSpinner label="Loading content..." />}>
          <ContentBrowser onDocumentSelect={setSelectedDocument} />
        </Suspense>
      </div>
      {selectedDocument && (
        <DocumentEditor
          handle={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </SanityApp>
  )
}

export default App
