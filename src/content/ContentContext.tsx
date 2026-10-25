import { createContext, useContext, type ReactNode } from 'react'
import type { Contact, SiteContent } from '../../api/_lib/content'
import { DEFAULT_CONTENT } from './defaults'

const Ctx = createContext<SiteContent>(DEFAULT_CONTENT)

export function ContentProvider({ value, children }: { value: SiteContent; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useContent = () => useContext(Ctx)
/** Courses that are visible on the public site. */
export const useCourses = () => useContext(Ctx).courses.filter((c) => !c.hidden)

export const telHref = (p: string) => 'tel:' + p.replace(/[^\d+]/g, '')
export const telegramUrl = (c: Contact) => `https://t.me/${c.telegram}`
export const mapLinks = (c: Contact) => ({
  google: `https://maps.google.com/maps?q=${c.lat},${c.lng}&ll=${c.lat},${c.lng}&z=16`,
  yandex: `https://yandex.uz/maps/?pt=${c.lng},${c.lat}&z=16&l=map`,
  embed: `https://maps.google.com/maps?q=${c.lat},${c.lng}&z=16&output=embed`,
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
    return data.content ? { ...DEFAULT_CONTENT, ...data.content } : DEFAULT_CONTENT
  } catch {
    return DEFAULT_CONTENT
  }
}
