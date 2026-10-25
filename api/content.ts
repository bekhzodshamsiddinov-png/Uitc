// Public, CDN-cached copy of the published site content.
import { json } from './_lib/http.js'
import { loadStored } from './_lib/contentStore.js'
import { storeConfigured } from './_lib/store.js'

const CACHE = { 'cache-control': 'public, max-age=0, s-maxage=20, stale-while-revalidate=600' }

export async function GET() {
  if (!storeConfigured()) return json(404, { content: null }, CACHE)
  try {
    const stored = await loadStored()
    if (!stored) return json(404, { content: null }, CACHE)
    return json(200, { content: stored.content, version: stored.version }, CACHE)
  } catch {
    return json(503, { content: null }, { 'cache-control': 'no-store' })
  }
}
