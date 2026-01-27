import { Suspense } from 'react'
import { type SanityConfig } from '@sanity/sdk'
import { SanityApp } from '@sanity/sdk-react'
import { ContentBrowser } from './components/ContentBrowser'
import { LoadingSpinner } from './components/LoadingSpinner'
import './App.css'

function App() {
  const sanityConfigs: SanityConfig[] = [
    {
      projectId: 'n3ipr1xb',
      dataset: 'production',
    }
  ]

  return (
    <div className="app-container">
      <SanityApp config={sanityConfigs} fallback={<LoadingSpinner label="Connecting to Sanity..." />}>
        <Suspense fallback={<LoadingSpinner label="Loading content..." />}>
          <ContentBrowser />
        </Suspense>
      </SanityApp>
    </div>
  )
}

export default App
