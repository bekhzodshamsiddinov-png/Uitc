import { createHmac } from 'node:crypto'

// Forwards a validated lead to the SmartEdu CRM so sales staff see it in "Lidlar".
// Optional: runs only when both SMARTEDU_LEAD_URL and SMARTEDU_LEAD_SECRET are set.
// The request is signed (HMAC-SHA256 over "timestamp.body") with a shared secret;
// failures never block the visitor's submission.
export async function forwardToSmartEdu(lead: { name: string; phone: string; course: string; slug?: string; note?: string }) {
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
