import { json, originAllowed } from '../_lib/http.js'
import { clearCookie } from '../_lib/auth.js'

export function POST(req: Request) {
  if (!originAllowed(req)) return json(403, { ok: false })
  return json(200, { ok: true }, { 'set-cookie': clearCookie(), 'x-robots-tag': 'noindex' })
}
