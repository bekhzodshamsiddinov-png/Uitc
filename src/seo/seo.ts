// Search-engine metadata for every public page: title, description, canonical
// URL, language alternates (hreflang), Open Graph and schema.org JSON-LD.
// The same function feeds the build-time prerender (static HTML that crawlers
// read) and the browser (updates <head> on client-side navigation).
import type { Course, Lang, SiteContent } from '../../api/_lib/content'
import { LANGS } from '../../api/_lib/content'
import { localize } from '../content/localize'
import { langFromPath, stripLang, withLang } from '../i18n'
import { UI } from '../i18n/ui'

export interface Seo {
  lang: Lang
  title: string
  description: string
  canonical: string
  alternates: { hreflang: string; href: string }[]
  image: string
  locale: string
  noindex: boolean
  jsonLd: Record<string, unknown>[]
}

const BRAND = 'United IT Clubs'
const LOCALE: Record<Lang, string> = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' }
const PAGES = ['/', '/kurslar', '/biz-haqimizda', '/maxfiylik']

/** Shortens to ~155 characters at a word boundary (what Google shows). */
function clip(s: string, max = 155) {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[,.;:—-]+$/, '') + '…'
}

/** Every page that should be prerendered and listed in the sitemap. */
export function publicPaths(master: SiteContent) {
  const slugs = master.courses.filter((c) => !c.hidden).map((c) => `/kurs/${c.slug}`)
  return LANGS.flatMap((l) => [...PAGES, ...slugs].map((p) => withLang(l, p)))
}

export function seoFor(pathname: string, master: SiteContent, origin: string): Seo {
  const lang = langFromPath(pathname)
  const bare = stripLang(pathname).replace(/\/+$/, '') || '/'
  const c = localize(master, lang)
  const ui = UI[lang]
  const url = (l: Lang, p = bare) => origin + withLang(l, p)
  const home = url(lang, '/')

  const org = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${origin}/#org`,
    name: BRAND,
    alternateName: 'UITC',
    slogan: 'Programming & Designing',
    url: home,
    logo: `${origin}/brand/uitc-logo.png`,
    image: `${origin}/images/hero.webp`,
    description: ui['meta.desc'],
    telephone: c.contact.phones.map((p) => p.replace(/[^\d+]/g, '')),
    sameAs: [`https://t.me/${c.contact.telegram}`],
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.contact.landmark,
      addressLocality: c.contact.city,
      addressRegion: 'Namangan',
      addressCountry: 'UZ',
    },
    geo: { '@type': 'GeoCoordinates', latitude: c.contact.lat, longitude: c.contact.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${c.contact.lat},${c.contact.lng}`,
    areaServed: 'Namangan',
    knowsLanguage: ['uz', 'ru', 'en'],
  }
  const crumbs = (items: [string, string][]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  })
  const courseLd = (k: Course) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: k.title,
    description: k.subtitle,
    url: url(lang, `/kurs/${k.slug}`),
    image: origin + k.image.replace(/^(?!\/)/, '/'),
    inLanguage: lang,
    educationalLevel: k.level,
    teaches: k.outcomes,
    provider: { '@id': `${origin}/#org` },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite', location: { '@id': `${origin}/#org` } },
  })

  let title = ui['meta.title']
  let description = ui['meta.desc']
  let noindex = false
  const jsonLd: Record<string, unknown>[] = [org]

  if (bare === '/') {
    // Google shows this as the site name above the result.
    jsonLd.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, alternateName: ['UITC', 'uitc.uz'], url: `${origin}/`, inLanguage: lang })
    if (c.faq.length) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      })
    }
  } else if (bare === '/kurslar') {
    title = `${ui['catalog.title']} — ${BRAND}`
    description = ui['catalog.text']
    const visible = c.courses.filter((k) => !k.hidden)
    jsonLd.push(crumbs([[ui['course.home'], home], [ui['catalog.title'], url(lang)]]))
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: visible.map((k, i) => ({ '@type': 'ListItem', position: i + 1, url: url(lang, `/kurs/${k.slug}`), name: k.title })),
    })
  } else if (bare.startsWith('/kurs/')) {
    const k = c.courses.find((x) => !x.hidden && `/kurs/${x.slug}` === bare)
    if (k) {
      title = `${k.title} — ${BRAND}`
      description = `${k.subtitle} ${k.duration}, ${k.ages}.`
      jsonLd.push(courseLd(k))
      jsonLd.push(crumbs([[ui['course.home'], home], [ui['course.courses'], url(lang, '/kurslar')], [k.title, url(lang)]]))
    } else {
      title = `${ui['course.notFound']} — ${BRAND}`
      noindex = true
    }
  } else if (bare === '/biz-haqimizda') {
    title = `${ui['about.eyebrow']} — ${BRAND}`
    description = c.about.text || description
    jsonLd.push(crumbs([[ui['course.home'], home], [ui['about.eyebrow'], url(lang)]]))
  } else if (bare === '/maxfiylik') {
    title = `${ui['legal.title']} — ${BRAND}`
    description = ui['legal.p1']
  } else {
    title = `${ui['nf.title']} — ${BRAND}`
    noindex = true
  }

  return {
    lang,
    title,
    description: clip(description),
    canonical: url(lang),
    alternates: [...LANGS.map((l) => ({ hreflang: l, href: url(l) })), { hreflang: 'x-default', href: url('uz') }],
    image: `${origin}/og.jpg`,
    locale: LOCALE[lang],
    noindex,
    jsonLd,
  }
}

/* ---------- rendering ---------- */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// JSON inside <script>: "<" must not appear raw, or "</script>" in content could break out.
const ld = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c')

function tags(s: Seo): [string, Record<string, string>, string?][] {
  const other = Object.values(LOCALE).filter((l) => l !== s.locale)
  return [
    ['meta', { name: 'description', content: s.description }],
    ['meta', { name: 'robots', content: s.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' }],
    ['link', { rel: 'canonical', href: s.canonical }],
    ...s.alternates.map((a): [string, Record<string, string>] => ['link', { rel: 'alternate', hreflang: a.hreflang, href: a.href }]),
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: BRAND }],
    ['meta', { property: 'og:title', content: s.title }],
    ['meta', { property: 'og:description', content: s.description }],
    ['meta', { property: 'og:url', content: s.canonical }],
    ['meta', { property: 'og:image', content: s.image }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:locale', content: s.locale }],
    ...other.map((l): [string, Record<string, string>] => ['meta', { property: 'og:locale:alternate', content: l }]),
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: s.title }],
    ['meta', { name: 'twitter:description', content: s.description }],
    ['meta', { name: 'twitter:image', content: s.image }],
    ['script', { type: 'application/ld+json' }, ld(s.jsonLd)],
  ]
}

/** <head> markup for the prerendered HTML. Every tag carries data-seo so the browser can replace them. */
export function renderHead(s: Seo) {
  return [
    `<title>${esc(s.title)}</title>`,
    ...tags(s).map(([tag, attrs, body]) => {
      const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
      return tag === 'script' ? `<script data-seo${a}>${body}</script>` : `<${tag} data-seo${a} />`
    }),
  ].join('\n    ')
}

/** Updates <head> after client-side navigation. */
export function applySeo(s: Seo) {
  document.documentElement.lang = s.lang
  document.title = s.title
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  const frag = document.createDocumentFragment()
  for (const [tag, attrs, body] of tags(s)) {
    const el = document.createElement(tag)
    el.setAttribute('data-seo', '')
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    if (body) el.textContent = body
    frag.appendChild(el)
  }
  document.head.appendChild(frag)
}

export function sitemapXml(master: SiteContent, origin: string, lastmod: string) {
  const urls = publicPaths(master).map((p) => {
    const s = seoFor(p, master, origin)
    const alts = s.alternates.map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`).join('')
    const prio = stripLang(p) === '/' ? '1.0' : stripLang(p).startsWith('/kurs') ? '0.9' : '0.6'
    return `<url><loc>${esc(s.canonical)}</loc><lastmod>${lastmod}</lastmod><priority>${prio}</priority>${alts}</url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
}
