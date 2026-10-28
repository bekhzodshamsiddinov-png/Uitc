import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/600.css'
import './index.css'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { ContentProvider, loadContent } from './content/ContentContext'
import { DEFAULT_CONTENT } from './content/defaults'
import { withDefaults } from './content/localize'
import type { SiteContent } from '../api/_lib/content'
import { captureAttribution } from './lib/attribution'

// Reklama havolasidagi belgilar til yo'naltirishidan oldin saqlanadi
captureAttribution()

// Returning visitors who picked Russian or English land on that version
// (a real page load, so they get that language's prerendered HTML).
let redirecting = false
if (location.pathname === '/') {
  try {
    const saved = localStorage.getItem('uitc-lang')
    if (saved === 'ru' || saved === 'en') {
      redirecting = true
      location.replace(`/${saved}${location.search}${location.hash}`)
    }
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

const container = document.getElementById('root')!
// The admin panel edits content itself, so it does not need the published copy first.
const isAdmin = location.pathname.startsWith('/admin')

if (!redirecting) {
  // Public pages arrive as prerendered HTML (built for search engines). React
  // hydrates that markup in place — nothing is redrawn, so the page is visible
  // and stable from the first paint.
  const embedded = document.getElementById('uitc-content')?.textContent
  if (container.hasChildNodes() && !isAdmin) {
    const initial = embedded ? withDefaults(JSON.parse(embedded) as SiteContent) : DEFAULT_CONTENT
    hydrateRoot(
      container,
      <StrictMode>
        <Root initial={initial} refresh />
      </StrictMode>,
    )
  } else {
    ;(isAdmin ? Promise.resolve(DEFAULT_CONTENT) : loadContent()).then((content) =>
      createRoot(container).render(
        <StrictMode>
          <Root initial={content} />
        </StrictMode>,
      ),
    )
  }
}

/**
 * Holds the site content. After hydrating build-time HTML it checks the
 * published copy once and re-renders only if the admin changed something
 * since the last deploy.
 */
function Root({ initial, refresh = false }: { initial: SiteContent; refresh?: boolean }) {
  const [content, setContent] = useState(initial)
  useEffect(() => {
    if (!refresh) return
    loadContent(5000).then((c) => {
      if (JSON.stringify(c) !== JSON.stringify(initial)) setContent(c)
    })
  }, [initial, refresh])
  return (
    <ContentProvider value={content}>
      <App prerendered={refresh} />
    </ContentProvider>
  )
}
