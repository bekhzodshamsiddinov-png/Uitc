import { adminJson, requireAdmin } from '../_lib/guard.js'
import { mustChangePassword } from '../_lib/auth.js'

export async function GET(req: Request) {
  const g = await requireAdmin(req, { allowBootstrap: true })
  if (g.error) return g.error
  const { account, session } = g.auth
  return adminJson(200, {
    ok: true,
    totpEnabled: !!account.totpSecret,
    mustChangePassword: mustChangePassword(account),
    expiresAt: session.exp * 1000,
  })
}
