import { validateLead } from './_lib/validate.js'
import { burstLimited, clientIp, json, originAllowed, readJson } from './_lib/http.js'
import { sharedLimited } from './_lib/limits.js'
import { createLead } from './_lib/leads.js'
import { storeConfigured } from './_lib/store.js'

// POST /api/lead — public consultation form.
// Hardening: same-origin only, JSON only with a 4 KB cap, honeypot + timing trap,
// per-IP and global rate limits, strict server-side validation, HTML-escaped
// Telegram output, and all secrets in server-side env vars. Leads are stored in
// a private Blob store.

const MIN_FILL_MS = 2500
const HOUR = 60 * 60 * 1000
// Real visitors send one or two requests; these caps stop scripted flooding of
// the inbox, Telegram and storage even from many IPs.
const PER_IP_PER_HOUR = 6
const ALL_PER_DAY = 300

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
  const tooMany = () => json(429, { ok: false, error: 'too_many_requests' }, { 'retry-after': '3600' })
  if (burstLimited(`lead:${ip}`, 5, 10 * 60 * 1000)) return tooMany()

  const body = await readJson(req, 4096)
  if (body instanceof Response) return body

  // Bots fill hidden fields and submit instantly; pretend success so they learn nothing.
  const startedAt = Number(body.t)
  if (body.website || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) return json(200, { ok: true })

  const { data, errors } = validateLead(body)
  if (Object.keys(errors).length) return json(422, { ok: false, errors })

  if (storeConfigured()) {
    try {
      if (await sharedLimited('lead-ip', ip, PER_IP_PER_HOUR, HOUR)) return tooMany()
      if (await sharedLimited('lead-all', 'all', ALL_PER_DAY, 24 * HOUR)) return tooMany()
    } catch {
      // Storage hiccup: fall through; the in-memory limit above still applies.
    }
  }

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
