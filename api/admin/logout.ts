import { json, originAllowed } from '../_lib/http.js'
import { clearCookie, readSession, revokeSession } from '../_lib/auth.js'

export async function POST(req: Request) {
  if (!originAllowed(req) || req.headers.get('x-uitc-admin') !== '1') return json(403, { ok: false })
  // Revoke on the server too: clearing the cookie alone would leave a copied token valid.
  const auth = await readSession(req).catch(() => null)
  if (auth) await revokeSession(auth.account, auth.session)
  return json(200, { ok: true }, { 'set-cookie': clearCookie(), 'x-robots-tag': 'noindex' })
}
