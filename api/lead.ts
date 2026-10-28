import { validateLead } from './_lib/validate.js'
import { burstLimited, clientIp, json, originAllowed, readJson } from './_lib/http.js'
import { sharedLimited } from './_lib/limits.js'
import { createLead } from './_lib/leads.js'
import { storeConfigured } from './_lib/store.js'
import { notifyAll } from './_lib/telegram.js'
import { loadStored } from './_lib/contentStore.js'
import { forwardToSmartEdu } from './_lib/smartedu.js'

// POST /api/lead — public consultation form.
// Hardening: same-origin only, JSON only with a 4 KB cap, honeypot + timing trap,
// per-IP and global rate limits, strict server-side validation, HTML-escaped
// Telegram output, and all secrets in server-side env vars. Leads are stored in
// a private Blob store.

const MIN_FILL_MS = 2500
const HOUR = 60 * 60 * 1000
// Real visitors send one or two requests; these caps stop scripted flooding of
// the inbox, Telegram and storage even from many IPs.
// Mobile operators put many customers behind one IP (CGNAT), so per-IP caps
// stay generous; the daily total is what stops flooding.
const PER_IP_PER_HOUR = 20
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
  // Rejections are logged (reason only, no personal data) so they show up in Vercel logs.
  const reject = (status: number, error: string, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}) => {
    console.warn(`lead rejected: ${status} ${error}`)
    return json(status, { ok: false, error, ...extra }, headers)
  }
  if (!originAllowed(req)) return reject(403, 'forbidden')
  const ip = clientIp(req)
  const tooMany = () => reject(429, 'too_many_requests', {}, { 'retry-after': '600' })
  // Only a guard against scripted bursts; the per-IP hourly cap below counts
  // valid leads only, so a few typos never lock a real visitor out.
  if (burstLimited(`lead:${ip}`, 30, 10 * 60 * 1000)) return tooMany()

  const body = await readJson(req, 4096)
  if (body instanceof Response) return body

  // Bots fill hidden fields and submit instantly; pretend success so they learn nothing.
  const startedAt = Number(body.t)
  if (body.website || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) return json(200, { ok: true })

  const { data, errors } = validateLead(body)
  if (Object.keys(errors).length) return reject(422, 'invalid', { errors })

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
    } catch (e) {
      console.error('lead save failed:', e instanceof Error ? e.message : e)
      saved = false
    }
  }

  const lang = /\btil:(ru|en)\b/.exec(data.message ?? '')?.[1]?.toUpperCase() ?? 'UZ'
  const course = await courseName(data.course)
  const crm = await forwardToSmartEdu({ name: data.name, phone: data.phone, course, slug: data.course, note: `Sayt tili: ${lang}` })
  const who = data.message?.includes('child') ? 'Farzandi uçun' : data.message?.includes('self') ? 'Özi uçun' : '—'
  const phone = data.phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
  const sent = await notifyAll(
    `🆕 <b>Yangi ariza — United IT Clubs</b>\n\n👤 ${escapeHtml(data.name)}\n📞 ${escapeHtml(phone)}\n📚 ${escapeHtml(course)}\n👥 ${who}\n🌐 Sayt tili: ${lang}\n\n<a href="${origin(req)}/admin/arizalar">Admin panelda oçiş →</a>`,
  )

  console.info(`lead accepted: saved=${saved} telegram=${sent} crm=${crm}`)
  if (!saved && !sent && !crm) return reject(502, 'unavailable')
  return json(200, { ok: true })
}

export function GET() {
  return json(405, { ok: false, error: 'method_not_allowed' }, { allow: 'POST' })
}
