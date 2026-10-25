import { validateLead } from './_lib/validate.js'
import { clientIp, json, originAllowed, readJson } from './_lib/http.js'
import { createLead } from './_lib/leads.js'
import { storeConfigured } from './_lib/store.js'

// POST /api/lead — public consultation form.
// Hardening: same-origin only, JSON only with a 4 KB cap, honeypot + timing trap,
// per-IP rate limit, strict server-side validation, HTML-escaped Telegram output,
// and all secrets in server-side env vars. Leads are stored in a private Blob store.

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const MIN_FILL_MS = 2500

// Best-effort per-instance limiter; the Vercel Firewall rate-limit rule on
// /api/lead is the global backstop.
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return list.length > MAX_PER_WINDOW
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return false
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    })
    return r.ok
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!originAllowed(req)) return json(403, { ok: false, error: 'forbidden' })
  const ip = clientIp(req)
  if (rateLimited(ip)) return json(429, { ok: false, error: 'too_many_requests' }, { 'retry-after': '600' })

  const body = await readJson(req, 4096)
  if (body instanceof Response) return body

  // Bots fill hidden fields and submit instantly; pretend success so they learn nothing.
  const startedAt = Number(body.t)
  if (body.website || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) return json(200, { ok: true })

  const { data, errors } = validateLead(body)
  if (Object.keys(errors).length) return json(422, { ok: false, errors })

  let saved = false
  if (storeConfigured()) {
    try {
      await createLead(data)
      saved = true
    } catch {
      saved = false
    }
  }

  const lang = /\btil:(ru|en)\b/.exec(data.message ?? '')?.[1]?.toUpperCase() ?? 'UZ'
  const who = data.message?.includes('child') ? 'Farzandi uchun' : data.message?.includes('self') ? 'O‘zi uchun' : '—'
  const sent = await notifyTelegram(
    `<b>Yangi ariza — United IT Clubs</b>\n👤 ${escapeHtml(data.name)}\n📞 ${escapeHtml(data.phone)}\n📚 ${escapeHtml(data.course)}\n👥 ${who}\n🌐 ${lang}`,
  )

  if (!saved && !sent) return json(502, { ok: false, error: 'unavailable' })
  return json(200, { ok: true })
}

export function GET() {
  return json(405, { ok: false, error: 'method_not_allowed' }, { allow: 'POST' })
}
