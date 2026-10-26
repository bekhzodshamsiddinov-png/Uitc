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

// Returning visitors who picked Russian or English land on that version.
if (location.pathname === '/') {
  try {
    const saved = localStorage.getItem('uitc-lang')
    if (saved === 'ru' || saved === 'en') history.replaceState(null, '', `/${saved}${location.search}${location.hash}`)
  } catch { /* storage may be blocked */ }
}

// After a new deploy an open tab may ask for code files that no longer exist;
// reload once to pick up the new version instead of failing.
window.addEventListener('vite:preloadError', () => {
  try {
    if (sessionStorage.getItem('uitc-reloaded')) return
    sessionStorage.setItem('uitc-reloaded', '1')
  } catch { /* storage blocked: still reload once */ }
  location.reload()
})

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
