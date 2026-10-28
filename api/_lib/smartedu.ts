import { createHmac } from 'node:crypto'

// Forwards a validated lead to the SmartEdu CRM so sales staff see it in "Lidlar".
// Optional: runs only when both SMARTEDU_LEAD_URL and SMARTEDU_LEAD_SECRET are set.
// The request is signed (HMAC-SHA256 over "timestamp.body") with a shared secret;
// failures never block the visitor's submission.
// utm: reklama belgilari (utm_source, utm_campaign, ...) — CRM kanal va kampaniyani shundan aniqlaydi.
export async function forwardToSmartEdu(lead: { name: string; phone: string; course: string; slug?: string; note?: string; utm?: Record<string, string>; page?: string }) {
  const url = process.env.SMARTEDU_LEAD_URL
  const secret = process.env.SMARTEDU_LEAD_SECRET
  if (!url || !secret || !url.startsWith('https://')) return false
  try {
    const body = JSON.stringify(lead)
    const ts = Date.now()
    const sig = createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-smartedu-timestamp': String(ts), 'x-smartedu-signature': sig },
      body,
      signal: AbortSignal.timeout(4000),
    })
    if (!r.ok) console.warn(`smartedu forward failed: ${r.status}`)
    return r.ok
  } catch (e) {
    console.warn('smartedu forward failed:', e instanceof Error ? e.message : e)
    return false
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid']

/** Brauzerdan kelgan reklama belgilarini faqat ruxsat etilgan kalitlar va qisqa matn bilan qoldiradi */
export function pickUtm(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const out: Record<string, string> = {}
  for (const k of UTM_KEYS) {
    const v = (raw as Record<string, unknown>)[k]
    if (typeof v === 'string' && v.trim()) out[k] = v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 120)
  }
  return Object.keys(out).length ? out : undefined
}
