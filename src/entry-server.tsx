// Build-time renderer: turns each public page into static HTML for search
// engines and fast first paint. Used only by scripts/prerender.mjs.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { ContentProvider } from './content/ContentContext'
import type { SiteContent } from '../api/_lib/content'

export { DEFAULT_CONTENT } from './content/defaults'
export { withDefaults } from './content/localize'
export { publicPaths, renderHead, seoFor, sitemapXml } from './seo/seo'

export function render(url: string, content: SiteContent) {
  return renderToString(
    <StaticRouter location={url}>
      <ContentProvider value={content}>
        <AppRoutes staticFirstPage />
      </ContentProvider>
    </StaticRouter>,
  )
}
