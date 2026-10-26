// Editable site content: shared types plus the server-side sanitiser that every
// admin save goes through. Nothing from the admin is trusted: strings are
// cleaned and length-capped, media must point at our own paths, and ids, phone
// numbers and coordinates are format-checked.

export type AudienceId = 'kids' | 'teens' | 'adults'
export const AUDIENCE_IDS: AudienceId[] = ['kids', 'teens', 'adults']

export interface Audience { id: AudienceId; name: string; ages: string; pitch: string }
export interface Module { title: string; topics: string[] }
export interface Course {
  slug: string
  title: string
  short: string
  subtitle: string
  duration: string
  level: string
  audiences: AudienceId[]
  ages: string
  image: string
  tags: string[]
  outcomes: string[]
  result: string
  forWhom: string[]
  modules: Module[]
  featured?: boolean
  hidden?: boolean
}
export interface VideoTestimonial {
  name?: string
  age?: number
  course?: string
  role?: string
  quote?: string
  src?: string
  poster?: string
  youtubeId?: string
}
export interface Contact { phones: string[]; telegram: string; city: string; landmark: string; lat: number; lng: number }
export interface Hero { badge: string; titleBefore: string; titleHighlight: string; titleAfter: string; subtitle: string; image: string; chips: string[] }
export interface Stat { value: string; label: string }
export interface Faq { q: string; a: string }
export interface Card { title: string; text: string }
export interface SectionText { eyebrow: string; title: string; subtitle: string }
export const SECTION_KEYS = ['audiences', 'courses', 'why', 'steps', 'students', 'parents', 'diploma', 'location', 'faq', 'lead'] as const
export type SectionKey = (typeof SECTION_KEYS)[number]
export interface About { title: string; text: string; image: string; values: Card[] }

export const LANGS = ['uz', 'ru', 'en'] as const
export type Lang = (typeof LANGS)[number]
/** Languages that are stored as translations on top of the Uzbek master copy. */
export const TR_LANGS = ['ru', 'en'] as const
export type TrLang = (typeof TR_LANGS)[number]

export interface SiteContent {
  contact: Contact
  hero: Hero
  stats: Stat[]
  audiences: Audience[]
  courses: Course[]
  studentVideos: VideoTestimonial[]
  parentVideos: VideoTestimonial[]
  faq: Faq[]
  marquee: string[]
  sections: Record<SectionKey, SectionText>
  reasons: Card[]
  steps: Card[]
  diplomaPoints: string[]
  leadPoints: string[]
  about: About
  /**
   * Russian and English texts. Each is a full copy of the content in that
   * language; only its texts are used — phones, media, slugs and other
   * structure always come from the Uzbek master copy.
   */
  tr?: Partial<Record<TrLang, SiteContent>>
}

/* ---------------- sanitiser ---------------- */

const clean = (s: unknown, max: number) =>
  typeof s === 'string' ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max) : ''

// Media may only reference files we serve ourselves.
export const MEDIA_RE = /^\/(images|brand)\/[\w.-]+\.(webp|png|jpe?g|svg|avif)$|^\/api\/media\?p=media\/[\w.-]{1,160}$/
const SLUG_RE = /^[a-z0-9-]{1,40}$/
const YT_RE = /^[\w-]{6,20}$/
const TG_RE = /^[A-Za-z0-9_]{5,32}$/
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/

class Bad extends Error {}
function need(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Bad(msg)
}
const arr = (v: unknown, max: number): unknown[] => (Array.isArray(v) ? v.slice(0, max) : [])
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {})
const strList = (v: unknown, maxItems: number, maxLen: number) => arr(v, maxItems).map((x) => clean(x, maxLen)).filter(Boolean)
const media = (v: unknown, field: string, required = false) => {
  const s = clean(v, 220)
  if (!s) {
    need(!required, `${field}: rasm/video tanlanmagan`)
    return ''
  }
  need(MEDIA_RE.test(s), `${field}: ruxsat etilmagan manzil`)
  return s
}

function video(v: unknown, i: number, kind: string): VideoTestimonial {
  const o = obj(v)
  const out: VideoTestimonial = {}
  const name = clean(o.name, 60); if (name) out.name = name
  const age = Number(o.age); if (Number.isInteger(age) && age >= 3 && age <= 99) out.age = age
  const course = clean(o.course, 40); if (course) out.course = course
  const role = clean(o.role, 40); if (role) out.role = role
  const quote = clean(o.quote, 240); if (quote) out.quote = quote
  const src = media(o.src, `${kind} #${i + 1} video`); if (src) out.src = src
  const poster = media(o.poster, `${kind} #${i + 1} muqova`); if (poster) out.poster = poster
  const yt = clean(o.youtubeId, 20)
  if (yt) { need(YT_RE.test(yt), `${kind} #${i + 1}: YouTube ID notöğri`); out.youtubeId = yt }
  return out
}

type Result = { ok: true; content: SiteContent } | { ok: false; error: string }
const TR_NAME: Record<TrLang, string> = { ru: 'Rusça', en: 'Inglizça' }

export function sanitizeContent(input: unknown): Result {
  const res = sanitizeOne(input)
  if (!res.ok) return res
  const tr = obj(obj(input).tr)
  const out: Partial<Record<TrLang, SiteContent>> = {}
  for (const lang of TR_LANGS) {
    if (!(lang in tr)) continue
    const t = sanitizeOne(tr[lang])
    if (!t.ok) return { ok: false, error: `${TR_NAME[lang]}: ${t.error}` }
    out[lang] = t.content
  }
  if (Object.keys(out).length) res.content.tr = out
  return res
}

function sanitizeOne(input: unknown): Result {
  try {
    const root = obj(input)

    const c = obj(root.contact)
    const phones = strList(c.phones, 4, 20)
    need(phones.length >= 1, 'Kamida bitta telefon raqam kerak')
    phones.forEach((p) => need(PHONE_RE.test(p), `Telefon raqam notöğri: ${p}`))
    const telegram = clean(c.telegram, 32).replace(/^@/, '')
    need(TG_RE.test(telegram), 'Telegram username notöğri (faqat lotin harflari, raqam va _)')
    const lat = Number(c.lat), lng = Number(c.lng)
    need(Number.isFinite(lat) && lat >= -90 && lat <= 90 && Number.isFinite(lng) && lng >= -180 && lng <= 180, 'Koordinatalar notöğri')
    const contact: Contact = { phones, telegram, city: clean(c.city, 80), landmark: clean(c.landmark, 120), lat, lng }

    const h = obj(root.hero)
    const hero: Hero = {
      badge: clean(h.badge, 80),
      titleBefore: clean(h.titleBefore, 60),
      titleHighlight: clean(h.titleHighlight, 30),
      titleAfter: clean(h.titleAfter, 60),
      subtitle: clean(h.subtitle, 400),
      image: media(h.image, 'Hero rasmi', true),
      chips: strList(h.chips, 4, 40),
    }
    need(hero.titleBefore || hero.titleHighlight, 'Hero sarlavhasi böş')

    const stats = arr(root.stats, 4).map((s) => ({ value: clean(obj(s).value, 12), label: clean(obj(s).label, 40) })).filter((s) => s.value)

    const audiences = AUDIENCE_IDS.map((id) => {
      const a = obj(arr(root.audiences, 3).find((x) => obj(x).id === id))
      return { id, name: clean(a.name, 30) || id, ages: clean(a.ages, 30), pitch: clean(a.pitch, 200) }
    })

    const seen = new Set<string>()
    const courses = arr(root.courses, 24).map((v, i): Course => {
      const o = obj(v)
      const slug = clean(o.slug, 40)
      need(SLUG_RE.test(slug), `Kurs #${i + 1}: URL nomi faqat kiçik lotin harflari, raqam va "-" bölsin`)
      need(!seen.has(slug), `Kurs URL nomi takrorlangan: ${slug}`)
      seen.add(slug)
      const title = clean(o.title, 100)
      need(title, `Kurs #${i + 1}: nomi böş`)
      return {
        slug,
        title,
        short: clean(o.short, 30) || title.slice(0, 30),
        subtitle: clean(o.subtitle, 300),
        duration: clean(o.duration, 30),
        level: clean(o.level, 30),
        audiences: arr(o.audiences, 3).filter((x): x is AudienceId => AUDIENCE_IDS.includes(x as AudienceId)),
        ages: clean(o.ages, 30),
        image: media(o.image, `Kurs “${title}” rasmi`, true),
        tags: strList(o.tags, 10, 30),
        outcomes: strList(o.outcomes, 12, 160),
        result: clean(o.result, 300),
        forWhom: strList(o.forWhom, 8, 120),
        modules: arr(o.modules, 16).map((m) => ({ title: clean(obj(m).title, 100), topics: strList(obj(m).topics, 20, 120) })).filter((m) => m.title),
        featured: o.featured === true || undefined,
        hidden: o.hidden === true || undefined,
      }
    })
    need(courses.some((x) => !x.hidden), 'Kamida bitta körinadigan kurs bölişi kerak')

    const cards = (v: unknown, max: number) =>
      arr(v, max).map((x) => ({ title: clean(obj(x).title, 80), text: clean(obj(x).text, 300) })).filter((x) => x.title)
    const sec = obj(root.sections)
    const sections = Object.fromEntries(
      SECTION_KEYS.map((k) => {
        const o = obj(sec[k])
        return [k, { eyebrow: clean(o.eyebrow, 40), title: clean(o.title, 120), subtitle: clean(o.subtitle, 400) }]
      }),
    ) as Record<SectionKey, SectionText>
    const ab = obj(root.about)
    const about: About = {
      title: clean(ab.title, 140),
      text: clean(ab.text, 1500),
      image: media(ab.image, '“Biz haqimizda” rasmi', true),
      values: cards(ab.values, 8),
    }

    const faq = arr(root.faq, 30).map((f) => ({ q: clean(obj(f).q, 200), a: clean(obj(f).a, 1200) })).filter((f) => f.q && f.a)

    return {
      ok: true,
      content: {
        contact,
        hero,
        stats,
        audiences,
        courses,
        studentVideos: arr(root.studentVideos, 30).map((v, i) => video(v, i, 'Öquvçi fikri')),
        parentVideos: arr(root.parentVideos, 30).map((v, i) => video(v, i, 'Ota-ona fikri')),
        faq,
        marquee: strList(root.marquee, 16, 40),
        sections,
        reasons: cards(root.reasons, 8),
        steps: cards(root.steps, 6),
        diplomaPoints: strList(root.diplomaPoints, 6, 120),
        leadPoints: strList(root.leadPoints, 6, 120),
        about,
      },
    }
  } catch (e) {
    if (e instanceof Bad) return { ok: false, error: e.message }
    return { ok: false, error: 'Ma’lumot formati notöğri' }
  }
}
