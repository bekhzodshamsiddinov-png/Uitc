import { json, originAllowed } from './http.js'
import { adminConfigured, mustChangePassword, readSession } from './auth.js'
import { storeConfigured } from './store.js'

const NO_INDEX = { 'x-robots-tag': 'noindex, nofollow' }

/**
 * Gate for every admin endpoint. State-changing requests additionally need a
 * same-origin Origin header and a custom header that cross-site forms cannot
 * set (defence in depth on top of the SameSite=Strict cookie).
 */
export async function requireAdmin(req: Request, opts: { allowBootstrap?: boolean } = {}) {
  if (!adminConfigured() || !storeConfigured()) return { error: json(503, { ok: false, error: 'not_configured' }, NO_INDEX) }
  if (req.method !== 'GET') {
    if (!originAllowed(req) || req.headers.get('x-uitc-admin') !== '1') return { error: json(403, { ok: false, error: 'forbidden' }, NO_INDEX) }
  }
  const auth = await readSession(req)
  if (!auth) return { error: json(401, { ok: false, error: 'unauthorized' }, NO_INDEX) }
  // Until the bootstrap password is replaced, only the session/security endpoints work.
  if (!opts.allowBootstrap && mustChangePassword(auth.account)) return { error: json(403, { ok: false, error: 'must_change_password' }, NO_INDEX) }
  return { auth }
}

export const adminJson = (status: number, body: unknown, extra: Record<string, string> = {}) => json(status, body, { ...NO_INDEX, ...extra })
