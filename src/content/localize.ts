// Builds the content for one language. The Uzbek copy is the master: phones,
// coordinates, media, slugs, audiences and visibility always come from it, so
// the admin uploads a photo or video once. Texts come from the translation
// (or its bundled defaults); anything without a translation falls back to Uzbek.
import type { Course, Lang, SiteContent, TrLang, VideoTestimonial } from '../../api/_lib/content'
import { DEFAULT_CONTENT } from './defaults'
import { DEFAULT_RU } from './defaults.ru'
import { DEFAULT_EN } from './defaults.en'

export const DEFAULT_TR: Record<TrLang, SiteContent> = { ru: DEFAULT_RU, en: DEFAULT_EN }

/** Fills fields added in later versions, so older saved content keeps working. */
export const withDefaults = (c: SiteContent, d: SiteContent = DEFAULT_CONTENT): SiteContent => ({
  ...d,
  ...c,
  sections: { ...d.sections, ...c.sections },
  about: { ...d.about, ...c.about },
})

const videoKey = (v: VideoTestimonial, i: number) => v.youtubeId || v.src || v.poster || `#${i}`

function videos(master: VideoTestimonial[], tr: VideoTestimonial[] | undefined): VideoTestimonial[] {
  if (!tr) return master
  const byKey = new Map(tr.map((v, i) => [videoKey(v, i), v]))
  return master.map((m, i) => {
    const t = byKey.get(videoKey(m, i)) ?? tr[i]
    return t ? { ...m, name: t.name, course: t.course, role: t.role, quote: t.quote } : m
  })
}

function course(m: Course, t: Course | undefined): Course {
  if (!t) return m
  const { slug, image, audiences, featured, hidden } = m
  return { ...m, ...t, slug, image, audiences, featured, hidden }
}

/** The translation document for `lang` (published one, else bundled defaults). */
export function trDoc(master: SiteContent, lang: TrLang): SiteContent {
  return withDefaults(master.tr?.[lang] ?? DEFAULT_TR[lang], DEFAULT_TR[lang])
}

export function localize(master: SiteContent, lang: Lang): SiteContent {
  if (lang === 'uz') return master
  const t = trDoc(master, lang)
  return {
    ...t,
    contact: { ...master.contact, city: t.contact.city || master.contact.city, landmark: t.contact.landmark || master.contact.landmark },
    hero: { ...t.hero, image: master.hero.image },
    audiences: master.audiences.map((a) => ({ ...a, ...t.audiences.find((x) => x.id === a.id), id: a.id })),
    courses: master.courses.map((m) => course(m, t.courses.find((x) => x.slug === m.slug))),
    studentVideos: videos(master.studentVideos, t.studentVideos),
    parentVideos: videos(master.parentVideos, t.parentVideos),
    about: { ...t.about, image: master.about.image },
    logos: master.logos,
    tr: undefined,
  }
}
