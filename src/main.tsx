import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/600.css'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ContentProvider, loadContent } from './content/ContentContext'
import { DEFAULT_CONTENT } from './content/defaults'

const root = createRoot(document.getElementById('root')!)
// The admin panel edits content itself, so it does not need the published copy first.
const isAdmin = location.pathname.startsWith('/admin')
;(isAdmin ? Promise.resolve(DEFAULT_CONTENT) : loadContent()).then((content) =>
  root.render(
    <StrictMode>
      <ContentProvider value={content}>
        <App />
      </ContentProvider>
    </StrictMode>,
  ),
)
