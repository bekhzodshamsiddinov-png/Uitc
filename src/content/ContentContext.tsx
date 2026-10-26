import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Contact, SiteContent } from '../../api/_lib/content'
import { DEFAULT_CONTENT } from './defaults'
import { localize, withDefaults } from './localize'
import { useLang } from '../i18n'

const Ctx = createContext<SiteContent>(DEFAULT_CONTENT)

/** `value` is the Uzbek master copy with its translations attached. */
export function ContentProvider({ value, children }: { value: SiteContent; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** Master copy (with translations) — for the admin panel. */
export const useMasterContent = () => useContext(Ctx)

/** Content in the language of the current page. */
export function useContent() {
  const master = useContext(Ctx)
  const lang = useLang()
  return useMemo(() => localize(master, lang), [master, lang])
}
/** Courses that are visible on the public site. */
export function useCourses() {
  const { courses } = useContent()
  return useMemo(() => courses.filter((c) => !c.hidden), [courses])
}

export const telHref = (p: string) => 'tel:' + p.replace(/[^\d+]/g, '')
export const telegramUrl = (c: Contact) => `https://t.me/${c.telegram}`
// Coordinates are numbers checked by the server, so they are safe in URLs.
export const mapLinks = (c: Contact) => ({
  // Official Maps URL: opens the Google Maps app on phones with a pin on the spot.
  google: `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`,
  yandex: `https://yandex.uz/maps/?ll=${c.lng},${c.lat}&pt=${c.lng},${c.lat}&z=17&l=map`,
  // Yandex's map widget is built for embedding: no API key, red pin on the spot.
  embed: `https://yandex.uz/map-widget/v1/?ll=${c.lng},${c.lat}&z=17&pt=${c.lng},${c.lat},pm2rdl`,
})

/**
 * Loads published content before first render (CDN-cached, so this is fast).
 * Falls back to the bundled defaults if the API is slow or unavailable.
 */
export async function loadContent(timeoutMs = 1500): Promise<SiteContent> {
  try {
    const r = await fetch('/api/content', { signal: AbortSignal.timeout(timeoutMs), credentials: 'omit' })
    if (!r.ok) return DEFAULT_CONTENT
    const data = (await r.json()) as { content?: SiteContent }
    return data.content ? withDefaults(data.content) : DEFAULT_CONTENT
  } catch {
    return DEFAULT_CONTENT
  }
}
