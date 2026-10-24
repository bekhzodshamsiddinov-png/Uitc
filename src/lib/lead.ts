import type { LeadInput } from '../../api/_lib/validate'

export type LeadResult = 'ok' | 'rate_limited' | 'error'

export async function sendLead(data: LeadInput, extra: { website: string; t: number }): Promise<LeadResult> {
  try {
    const r = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ ...data, ...extra }),
    })
    if (r.status === 429) return 'rate_limited'
    return r.ok ? 'ok' : 'error'
  } catch {
    return 'error'
  }
}
