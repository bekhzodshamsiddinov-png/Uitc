// Prerenders every public page (all three languages) into static HTML so
// search engines and first-time visitors get full content without waiting for
// JavaScript. Also writes sitemap.xml, robots.txt and the SPA shell.
// Runs after `vite build` (client) and `vite build --ssr` (dist-ssr).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const SITE = (process.env.SITE_URL || 'https://uitc-livid.vercel.app').replace(/\/+$/, '')
const ssr = await import(new URL('../dist-ssr/entry-server.js', import.meta.url))
const { render, renderHead, seoFor, publicPaths, sitemapXml, withDefaults, DEFAULT_CONTENT } = ssr

// Use the content published from the admin panel when the build can reach the store.
let master = DEFAULT_CONTENT
let published = null
if (process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    const { get } = await import('@vercel/blob')
    const res = await get('content/site.json', { access: 'private', useCache: false })
    if (res?.statusCode === 200 && res.stream) {
      const stored = JSON.parse(await new Response(res.stream).text())
      if (stored?.content) {
        published = stored.content
        master = withDefaults(stored.content)
      }
      console.log(`prerender: using published content v${stored.version}`)
    }
  } catch (e) {
    console.warn('prerender: published content unavailable, using defaults —', e?.message ?? e)
  }
}

const template = await readFile('dist/index.html', 'utf8')
if (!template.includes('<!--seo-head-->') || !template.includes('<div id="root"></div>')) throw new Error('index.html placeholders missing')

// Shell for routes that are not prerendered (admin, new courses, 404s).
await writeFile('dist/shell.html', template.replace('<!--seo-head-->', '<title>United IT Clubs</title>'))

// The browser hydrates with exactly the content the HTML was built from. With
// nothing published it is the bundled defaults, so nothing needs embedding.
const embed = published
  ? `<script id="uitc-content" type="application/json">${JSON.stringify(published).replace(/</g, '\\u003c')}</script>`
  : ''

const paths = publicPaths(master)
for (const path of paths) {
  const seo = seoFor(path, master, SITE)
  const html = template
    .replace('<html lang="uz">', `<html lang="${seo.lang}">`)
    .replace('<!--seo-head-->', renderHead(seo))
    .replace('<div id="root"></div>', `<div id="root">${render(path, master)}</div>${embed}`)
  const file = path === '/' ? 'dist/index.html' : join('dist', path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
}

const today = new Date().toISOString().slice(0, 10)
await writeFile('dist/sitemap.xml', sitemapXml(master, SITE, today))
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`,
)
await rm('dist-ssr', { recursive: true, force: true })
console.log(`prerender: ${paths.length} pages, sitemap.xml, robots.txt → ${SITE}`)
