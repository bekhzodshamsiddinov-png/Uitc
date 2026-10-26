import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import type { Lang } from '../../api/_lib/content'
import { UI, type UiKey } from './ui'

export const LANG_LABELS: Record<Lang, { short: string; name: string }> = {
  uz: { short: 'UZ', name: 'Özbekça' },
  ru: { short: 'RU', name: 'Русский' },
  en: { short: 'EN', name: 'English' },
}

/** Uzbek lives at the root; Russian and English under /ru and /en. */
export function langFromPath(pathname: string): Lang {
  const seg = pathname.split('/')[1]
  return seg === 'ru' || seg === 'en' ? seg : 'uz'
}

/** Removes the language prefix: "/ru/kurslar" → "/kurslar". */
export function stripLang(pathname: string) {
  const lang = langFromPath(pathname)
  if (lang === 'uz') return pathname || '/'
  return pathname.slice(lang.length + 1) || '/'
}

/** Adds the language prefix to an internal path ("/", "/kurslar", "/#ariza"). */
export function withLang(lang: Lang, path: string) {
  if (lang === 'uz') return path
  if (path === '/') return `/${lang}`
  if (path.startsWith('/#')) return `/${lang}${path.slice(1)}`
  return `/${lang}${path}`
}

export const useLang = (): Lang => langFromPath(useLocation().pathname)

/** Builds links that stay in the current language. */
export function useLp() {
  const lang = useLang()
  return useCallback((path: string) => withLang(lang, path), [lang])
}

export function useT() {
  const lang = useLang()
  return useCallback(
    (key: UiKey, vars?: Record<string, string | number>) => {
      let s = UI[lang][key] ?? UI.uz[key]
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
      return s
    },
    [lang],
  )
}
