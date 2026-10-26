// Admin authentication: scrypt password hashes, HMAC-signed session cookies,
// optional TOTP two-factor auth and brute-force lockouts.
import { createCipheriv, createDecipheriv, createHash, createHmac, hkdfSync, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { getCookie } from './http.js'
import { readJson, writeJson } from './store.js'

export const COOKIE = '__Host-uitc_admin'
const SESSION_TTL_S = 8 * 60 * 60
const ACCOUNT_PATH = 'admin/account.json'

export interface Account {
  passwordHash?: string
  sessionVersion: number
  totpSecret?: string // AES-GCM encrypted
  totpPending?: string // AES-GCM encrypted, awaiting confirmation
  totpLastCounter?: number
  /** Sessions signed out individually; kept until they would have expired anyway. */
  revoked?: { sid: string; exp: number }[]
  updatedAt?: string
}

const b64u = (b: Buffer) => b.toString('base64url')

function secret(): Buffer {
  const s = process.env.ADMIN_SESSION_SECRET ?? ''
  if (s.length < 32) throw new Error('ADMIN_SESSION_SECRET is missing or too short')
  return Buffer.from(s)
}
const subKey = (info: string) => Buffer.from(hkdfSync('sha256', secret(), Buffer.alloc(0), info, 32))

export const adminConfigured = () => (process.env.ADMIN_SESSION_SECRET ?? '').length >= 32 && !!process.env.ADMIN_PASSWORD_HASH

/* ---------- passwords (scrypt) ---------- */

const SCRYPT = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

export function hashPassword(pw: string) {
  const salt = randomBytes(16)
  const hash = scryptSync(pw.normalize('NFKC'), salt, 32, SCRYPT)
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${b64u(salt)}$${b64u(hash)}`
}

export function verifyPassword(pw: string, stored: string) {
  const [alg, n, r, p, salt, hash] = stored.split('$')
  if (alg !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'base64url')
  const got = scryptSync(pw.normalize('NFKC'), Buffer.from(salt, 'base64url'), expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024,
  })
  return got.length === expected.length && timingSafeEqual(got, expected)
}

/* ---------- account state ---------- */

export async function loadAccount(): Promise<Account> {
  return (await readJson<Account>(ACCOUNT_PATH)) ?? { sessionVersion: 1 }
}
export async function saveAccount(a: Account) {
  await writeJson(ACCOUNT_PATH, { ...a, updatedAt: new Date().toISOString() })
}
export const effectiveHash = (a: Account) => a.passwordHash ?? process.env.ADMIN_PASSWORD_HASH ?? ''
// The bootstrap password from the environment must be replaced after first login.
export const mustChangePassword = (a: Account) => !a.passwordHash

/* ---------- sessions ---------- */

interface Session { v: number; iat: number; exp: number; sid: string }

export function issueSession(a: Account) {
  const now = Math.floor(Date.now() / 1000)
  const payload: Session = { v: a.sessionVersion, iat: now, exp: now + SESSION_TTL_S, sid: b64u(randomBytes(12)) }
  const body = b64u(Buffer.from(JSON.stringify(payload)))
  const sig = b64u(createHmac('sha256', subKey('session')).update(body).digest())
  return `${body}.${sig}`
}

export const sessionCookie = (token: string) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_S}`
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`

export async function readSession(req: Request): Promise<{ account: Account; session: Session } | null> {
  if (!adminConfigured()) return null
  const token = getCookie(req, COOKIE)
  if (!token || token.length > 512) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', subKey('session')).update(body).digest()
  const given = Buffer.from(sig, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  let s: Session
  try {
    s = JSON.parse(Buffer.from(body, 'base64url').toString())
  } catch {
    return null
  }
  if (typeof s.exp !== 'number' || s.exp < Date.now() / 1000) return null
  const account = await loadAccount()
  if (s.v !== account.sessionVersion) return null // revoked by password change / "log out everywhere"
  if (account.revoked?.some((r) => r.sid === s.sid)) return null // signed out
  return { account, session: s }
}

/** Signs out one session server-side, so a copied cookie stops working too. */
export async function revokeSession(account: Account, s: Session) {
  const now = Date.now() / 1000
  account.revoked = [...(account.revoked ?? []).filter((r) => r.exp > now), { sid: s.sid, exp: s.exp }].slice(-50)
  await saveAccount(account)
}

/* ---------- symmetric encryption for stored secrets ---------- */

export function encrypt(plain: string) {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', subKey('totp'), iv)
  const enc = Buffer.concat([c.update(plain, 'utf8'), c.final()])
  return [iv, c.getAuthTag(), enc].map(b64u).join('.')
}
export function decrypt(token: string) {
  const [iv, tag, enc] = token.split('.').map((s) => Buffer.from(s, 'base64url'))
  const d = createDecipheriv('aes-256-gcm', subKey('totp'), iv)
  d.setAuthTag(tag)
  return Buffer.concat([d.update(enc), d.final()]).toString('utf8')
}

/* ---------- TOTP (RFC 6238) ---------- */

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
export function base32(buf: Buffer) {
  let bits = 0, value = 0, out = ''
  for (const byte of buf) {
    value = (value << 8) | byte; bits += 8
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5 }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31]
  return out
}
function unbase32(s: string) {
  let bits = 0, value = 0
  const out: number[] = []
  for (const ch of s.replace(/=+$/, '').toUpperCase()) {
    const i = B32.indexOf(ch)
    if (i < 0) continue
    value = (value << 5) | i; bits += 5
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8 }
  }
  return Buffer.from(out)
}
function hotp(key: Buffer, counter: number) {
  const msg = Buffer.alloc(8)
  msg.writeBigUInt64BE(BigInt(counter))
  const h = createHmac('sha1', key).update(msg).digest()
  const o = h[h.length - 1] & 15
  const code = ((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]
  return String(code % 1_000_000).padStart(6, '0')
}
export const newTotpSecret = () => base32(randomBytes(20))

/** Returns the matched time-step counter, or null. Accepts ±1 step of clock drift. */
export function verifyTotp(secretB32: string, code: string, lastCounter = -1): number | null {
  if (!/^\d{6}$/.test(code)) return null
  const key = unbase32(secretB32)
  const now = Math.floor(Date.now() / 30000)
  for (const c of [now - 1, now, now + 1]) {
    if (c <= lastCounter) continue // replay protection
    const expected = Buffer.from(hotp(key, c))
    if (timingSafeEqual(expected, Buffer.from(code))) return c
  }
  return null
}

/* ---------- brute-force protection ---------- */

interface Lock { fails: number; first: number; until?: number }
const ipKey = (ip: string) => 'security/login-' + createHash('sha256').update(subKey('ip')).update(ip).digest('hex').slice(0, 32) + '.json'
const GLOBAL = 'security/login-global.json'
const IP_MAX = 5, GLOBAL_MAX = 30, WINDOW = 15 * 60 * 1000

/**
 * The global lock stops slow distributed guessing, but it also lets anyone lock
 * the real admin out. With 2FA on, guessing the password alone is useless, so
 * callers pass `global: false` and only the per-IP lock applies.
 */
export async function lockStatus(ip: string, global = true): Promise<number> {
  const [a, g] = await Promise.all([readJson<Lock>(ipKey(ip)), global ? readJson<Lock>(GLOBAL) : null])
  const now = Date.now()
  return Math.max(a?.until && a.until > now ? a.until : 0, g?.until && g.until > now ? g.until : 0)
}

export async function recordFailure(ip: string) {
  const now = Date.now()
  for (const [key, max] of [[ipKey(ip), IP_MAX], [GLOBAL, GLOBAL_MAX]] as const) {
    const cur = (await readJson<Lock>(key)) ?? { fails: 0, first: now }
    const fresh = now - cur.first > WINDOW ? { fails: 0, first: now } : cur
    fresh.fails += 1
    if (fresh.fails >= max) fresh.until = now + WINDOW
    await writeJson(key, fresh)
  }
}

export async function clearFailures(ip: string) {
  await writeJson(ipKey(ip), { fails: 0, first: Date.now() })
}
