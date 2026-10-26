import { burstLimited, clientIp, json, originAllowed, readJson } from '../_lib/http.js'
import {
  adminConfigured, clearFailures, decrypt, effectiveHash, issueSession, loadAccount, lockStatus,
  mustChangePassword, recordFailure, saveAccount, sessionCookie, verifyPassword, verifyTotp,
} from '../_lib/auth.js'
import { storeConfigured } from '../_lib/store.js'

const H = { 'x-robots-tag': 'noindex, nofollow' }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function POST(req: Request) {
  const started = Date.now()
  // Uniform ~600ms minimum response time so timing does not reveal what failed.
  const reply = async (status: number, body: unknown, extra: Record<string, string> = {}) => {
    const wait = 600 - (Date.now() - started)
    if (wait > 0) await sleep(wait)
    return json(status, body, { ...H, ...extra })
  }

  if (!adminConfigured() || !storeConfigured()) return reply(503, { ok: false, error: 'not_configured' })
  if (!originAllowed(req) || req.headers.get('x-uitc-admin') !== '1') return reply(403, { ok: false, error: 'forbidden' })

  const ip = clientIp(req)
  const locked = (until: number) => reply(429, { ok: false, error: 'locked', retryAt: until }, { 'retry-after': String(Math.max(1, Math.ceil((until - Date.now()) / 1000))) })
  // Parallel bursts would all pass the shared check before any failure is saved.
  if (burstLimited(`login:${ip}`, 8, 15 * 60 * 1000)) return locked(Date.now() + 15 * 60 * 1000)

  const account = await loadAccount()
  const totp = !!account.totpSecret
  const lockedUntil = await lockStatus(ip, !totp)
  if (lockedUntil) return locked(lockedUntil)

  const body = await readJson(req, 2048)
  if (body instanceof Response) return body
  const password = typeof body.password === 'string' ? body.password.slice(0, 200) : ''
  const code = typeof body.code === 'string' ? body.code.replace(/\s/g, '').slice(0, 6) : ''

  // Ask for the 2FA code before looking at the password, so this answer never
  // reveals whether a guessed password was right.
  if (totp && !code) return reply(401, { ok: false, error: 'totp_required' })

  const hash = effectiveHash(account)
  const passwordOk = !!password && !!hash && verifyPassword(password, hash)
  const counter = totp ? verifyTotp(decrypt(account.totpSecret!), code, account.totpLastCounter) : 0
  if (!passwordOk || counter === null) {
    await recordFailure(ip)
    return reply(401, { ok: false, error: 'invalid_credentials' })
  }
  if (totp) {
    account.totpLastCounter = counter
    await saveAccount(account)
  }

  await clearFailures(ip)
  return reply(200, { ok: true, mustChangePassword: mustChangePassword(account) }, { 'set-cookie': sessionCookie(issueSession(account)) })
}

export const GET = () => json(405, { ok: false }, { allow: 'POST', ...H })
