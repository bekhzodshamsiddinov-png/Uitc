import { validateLead } from './_lib/validate.js'
import { burstLimited, clientIp, json, originAllowed, readJson } from './_lib/http.js'
import { sharedLimited } from './_lib/limits.js'
import { createLead } from './_lib/leads.js'
import { storeConfigured } from './_lib/store.js'
import { notifyAll } from './_lib/telegram.js'
import { loadStored } from './_lib/contentStore.js'

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

/** Course title as published in the admin panel (falls back to the slug). */
async function courseName(slug: string) {
  if (slug === 'general') return 'Bilmaydi — maslahat kerak'
  try {
    const stored = storeConfigured() ? await loadStored() : null
    const c = stored?.content.courses.find((x) => x.slug === slug)
    if (c) return c.title
  } catch {
    // ignore: the slug is still informative
  }
  return { foundation: 'Foundation — Kompyuter savodxonligi', ai: 'Sun’iy intellekt (AI)', youtube: 'YouTube va kontent yaratiş', fullstack: 'Fullstack dasturlaş (AI integrated)' }[slug] ?? slug
}

// Link back to this site's admin panel (origin was already checked).
const origin = (req: Request) => req.headers.get('origin') ?? ''

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
  const who = data.message?.includes('child') ? 'Farzandi uçun' : data.message?.includes('self') ? 'Özi uçun' : '—'
  const phone = data.phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
  const sent = await notifyAll(
    `🆕 <b>Yangi ariza — United IT Clubs</b>\n\n👤 ${escapeHtml(data.name)}\n📞 ${escapeHtml(phone)}\n📚 ${escapeHtml(await courseName(data.course))}\n👥 ${who}\n🌐 Sayt tili: ${lang}\n\n<a href="${origin(req)}/admin/arizalar">Admin panelda oçiş →</a>`,
  )

  if (!saved && !sent) return json(502, { ok: false, error: 'unavailable' })
  return json(200, { ok: true })
}

export function GET() {
  return json(405, { ok: false, error: 'method_not_allowed' }, { allow: 'POST' })
}
