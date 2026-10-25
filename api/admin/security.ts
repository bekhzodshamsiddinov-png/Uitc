import { readJson } from '../_lib/http.js'
import { adminJson, requireAdmin } from '../_lib/guard.js'
import {
  clearCookie, decrypt, effectiveHash, encrypt, hashPassword, issueSession, newTotpSecret, saveAccount,
  sessionCookie, verifyPassword, verifyTotp,
} from '../_lib/auth.js'

const strong = (pw: string) => pw.length >= 12 && pw.length <= 128 && /[a-z]/i.test(pw) && /\d/.test(pw)

export async function POST(req: Request) {
  const g = await requireAdmin(req, { allowBootstrap: true })
  if (g.error) return g.error
  const account = g.auth.account
  const body = await readJson(req, 2048)
  if (body instanceof Response) return body
  const str = (k: string, max = 200) => (typeof body[k] === 'string' ? (body[k] as string).slice(0, max) : '')

  switch (body.action) {
    case 'change-password': {
      if (!verifyPassword(str('current'), effectiveHash(account))) return adminJson(401, { ok: false, error: 'wrong_password' })
      const next = str('next')
      if (!strong(next)) return adminJson(422, { ok: false, error: 'weak_password' })
      if (verifyPassword(next, effectiveHash(account))) return adminJson(422, { ok: false, error: 'same_password' })
      account.passwordHash = hashPassword(next)
      account.sessionVersion += 1 // sign out every other session
      await saveAccount(account)
      return adminJson(200, { ok: true }, { 'set-cookie': sessionCookie(issueSession(account)) })
    }
    case 'totp-setup': {
      if (account.totpSecret) return adminJson(409, { ok: false, error: 'already_enabled' })
      const s = newTotpSecret()
      account.totpPending = encrypt(s)
      await saveAccount(account)
      const uri = `otpauth://totp/UITC%20Admin?secret=${s}&issuer=United%20IT%20Clubs&algorithm=SHA1&digits=6&period=30`
      return adminJson(200, { ok: true, secret: s, uri })
    }
    case 'totp-enable': {
      if (!account.totpPending) return adminJson(409, { ok: false, error: 'no_pending' })
      const s = decrypt(account.totpPending)
      const counter = verifyTotp(s, str('code', 6))
      if (counter === null) return adminJson(401, { ok: false, error: 'invalid_totp' })
      account.totpSecret = account.totpPending
      account.totpPending = undefined
      account.totpLastCounter = counter
      account.sessionVersion += 1
      await saveAccount(account)
      return adminJson(200, { ok: true }, { 'set-cookie': sessionCookie(issueSession(account)) })
    }
    case 'totp-disable': {
      if (!account.totpSecret) return adminJson(409, { ok: false, error: 'not_enabled' })
      if (!verifyPassword(str('password'), effectiveHash(account))) return adminJson(401, { ok: false, error: 'wrong_password' })
      if (verifyTotp(decrypt(account.totpSecret), str('code', 6), account.totpLastCounter) === null) return adminJson(401, { ok: false, error: 'invalid_totp' })
      account.totpSecret = undefined
      account.totpLastCounter = undefined
      account.sessionVersion += 1
      await saveAccount(account)
      return adminJson(200, { ok: true }, { 'set-cookie': sessionCookie(issueSession(account)) })
    }
    case 'logout-all': {
      account.sessionVersion += 1
      await saveAccount(account)
      return adminJson(200, { ok: true }, { 'set-cookie': clearCookie() })
    }
    default:
      return adminJson(400, { ok: false, error: 'unknown_action' })
  }
}
