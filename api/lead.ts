import { validateLead } from './_lib/validate.js'

// POST /api/lead — receives a consultation request and forwards it to Telegram.
// Hardening: method + content-type checks, body size cap, origin allow-list,
// honeypot + timing trap against bots, per-IP rate limit, strict validation,
// and secrets kept in server-side env vars only.

const MAX_BODY = 4 * 1024
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const MIN_FILL_MS = 2500

// Best-effort, per-instance limiter. For strict global limits put a Vercel
// Firewall rate-limit rule (or Upstash/KV) in front of this route.
const hits = new Map<string, number[]>()

const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...extra,
    },
  })

function rateLimited(ip: string) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return list.length > MAX_PER_WINDOW
}

function originAllowed(req: Request) {
  const origin = req.headers.get('origin')
  if (!origin) return false
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const allowed = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  try {
    const o = new URL(origin)
    if (allowed.length) return allowed.includes(o.origin)
    return o.host === host && o.protocol === 'https:'
  } catch {
    return false
  }
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function POST(req: Request) {
  if (!originAllowed(req)) return json(403, { ok: false, error: 'forbidden' })

  const ct = req.headers.get('content-type') ?? ''
  if (!ct.toLowerCase().startsWith('application/json')) return json(415, { ok: false, error: 'unsupported_media_type' })

  const len = Number(req.headers.get('content-length') ?? '0')
  if (len > MAX_BODY) return json(413, { ok: false, error: 'payload_too_large' })

  const ip = (req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown').trim()
  if (rateLimited(ip)) return json(429, { ok: false, error: 'too_many_requests' }, { 'retry-after': '600' })

  let raw: string
  try {
    raw = await req.text()
  } catch {
    return json(400, { ok: false, error: 'bad_request' })
  }
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'payload_too_large' })

  let body: Record<string, unknown>
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error()
    body = parsed
  } catch {
    return json(400, { ok: false, error: 'invalid_json' })
  }

  // Bots fill hidden fields and submit instantly; pretend success so they learn nothing.
  const startedAt = Number(body.t)
  if (body.website || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return json(200, { ok: true })
  }

  const { data, errors } = validateLead(body)
  if (Object.keys(errors).length) return json(422, { ok: false, errors })

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (token && chatId) {
    const text =
      `<b>Yangi ariza — UITC</b>\n` +
      `👤 ${escapeHtml(data.name)}\n📞 ${escapeHtml(data.phone)}\n📚 ${escapeHtml(data.course)}` +
      (data.message ? `\n💬 ${escapeHtml(data.message)}` : '')
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
        signal: AbortSignal.timeout(5000),
      })
      if (!r.ok) return json(502, { ok: false, error: 'upstream' })
    } catch {
      return json(502, { ok: false, error: 'upstream' })
    }
  }

  return json(200, { ok: true })
}

export function GET() {
  return json(405, { ok: false, error: 'method_not_allowed' }, { allow: 'POST' })
}
