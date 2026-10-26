import { readJson } from '../_lib/http.js'
import { adminJson, requireAdmin } from '../_lib/guard.js'
import { sanitizeContent } from '../_lib/content.js'
import { listHistory, loadHistory, loadStored, saveContent } from '../_lib/contentStore.js'

/**
 * Pages are prerendered at build time for search engines. When a Vercel deploy
 * hook is configured, every publish triggers a rebuild (~1 min) so the static
 * HTML follows the admin's edits. Visitors see new content immediately anyway.
 */
async function rebuild() {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL ?? ''
  if (!hook.startsWith('https://api.vercel.com/')) return
  try {
    await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(4000) })
  } catch {
    // The publish itself succeeded; the next deploy will pick the content up.
  }
}

export async function GET(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  const [stored, history] = await Promise.all([loadStored(), listHistory()])
  return adminJson(200, { ok: true, stored, history })
}

// Publish new content. Body: { content, baseVersion } — baseVersion guards
// against two admins overwriting each other's edits.
export async function PUT(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  const body = await readJson(req, 1536 * 1024)
  if (body instanceof Response) return body
  const current = await loadStored()
  if ((current?.version ?? 0) !== Number(body.baseVersion ?? 0)) {
    return adminJson(409, { ok: false, error: 'conflict', version: current?.version ?? 0 })
  }
  const res = sanitizeContent(body.content)
  if (!res.ok) return adminJson(422, { ok: false, error: 'invalid', message: res.error })
  const saved = await saveContent(res.content)
  await rebuild()
  return adminJson(200, { ok: true, stored: saved })
}

// Restore a previous version: { action: 'restore', id }
export async function POST(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  const body = await readJson(req, 2048)
  if (body instanceof Response) return body
  if (body.action !== 'restore') return adminJson(400, { ok: false, error: 'unknown_action' })
  const old = await loadHistory(String(body.id ?? ''))
  if (!old) return adminJson(404, { ok: false, error: 'not_found' })
  const res = sanitizeContent(old.content)
  if (!res.ok) return adminJson(422, { ok: false, error: 'invalid', message: res.error })
  const saved = await saveContent(res.content)
  await rebuild()
  return adminJson(200, { ok: true, stored: saved })
}
