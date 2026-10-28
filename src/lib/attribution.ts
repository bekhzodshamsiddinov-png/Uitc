// Reklama belgilari (utm_*, fbclid): odam target orqali kelsa, 30 kun eslab qolinadi va
// ariza bilan CRM ga yuboriladi — lid "Instagram target, kampaniya, video" bo'lib tushadi.
const KEY = 'uitc-attr'
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const
const TTL = 30 * 24 * 60 * 60 * 1000

export type Attribution = Partial<Record<(typeof KEYS)[number], string>> & { landing?: string }

const clean = (v: string) => v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 120)

export function captureAttribution() {
  try {
    const q = new URLSearchParams(location.search)
    const a: Attribution = {}
    for (const k of KEYS) {
      const v = q.get(k)
      if (v) a[k] = clean(v)
    }
    if (!Object.keys(a).length) return
    a.landing = clean(location.pathname)
    localStorage.setItem(KEY, JSON.stringify({ a, at: Date.now() }))
  } catch {
    /* storage may be blocked */
  }
}

export function getAttribution(): Attribution | undefined {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return undefined
    const { a, at } = JSON.parse(raw) as { a: Attribution; at: number }
    if (!a || typeof at !== 'number' || Date.now() - at > TTL) return undefined
    return a
  } catch {
    return undefined
  }
}
