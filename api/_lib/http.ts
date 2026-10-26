// Small HTTP helpers shared by every function.

export const MAX_BODY = 8 * 1024

const baseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
}

export const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...baseHeaders, ...extra } })

const bursts = new Map<string, number[]>()
/**
 * Per-instance sliding-window limiter. Instances are reused across requests, so
 * this cheaply stops bursts before the slower shared (Blob-backed) checks run.
 */
export function burstLimited(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const list = (bursts.get(key) ?? []).filter((t) => now - t < windowMs)
  list.push(now)
  bursts.set(key, list)
  if (bursts.size > 5000) bursts.clear()
  return list.length > max
}

export const clientIp = (req: Request) =>
  (req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown').trim().slice(0, 64)

// Same-origin check: the browser always sends Origin on POST/PATCH/DELETE.
export function originAllowed(req: Request) {
  const origin = req.headers.get('origin')
  if (!origin) return false
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const allowed = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  try {
    const o = new URL(origin)
    if (allowed.length) return allowed.includes(o.origin)
    return o.host === host && o.protocol === 'https:'
  } catch {
    return false
  }
}

export async function readJson(req: Request, max = MAX_BODY): Promise<Record<string, unknown> | Response> {
  const ct = req.headers.get('content-type') ?? ''
  if (!ct.toLowerCase().startsWith('application/json')) return json(415, { ok: false, error: 'unsupported_media_type' })
  if (Number(req.headers.get('content-length') ?? '0') > max) return json(413, { ok: false, error: 'payload_too_large' })
  let raw: string
  try {
    raw = await req.text()
  } catch {
    return json(400, { ok: false, error: 'bad_request' })
  }
  if (raw.length > max) return json(413, { ok: false, error: 'payload_too_large' })
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error()
    return parsed as Record<string, unknown>
  } catch {
    return json(400, { ok: false, error: 'invalid_json' })
  }
}

export const getCookie = (req: Request, name: string) => {
  const raw = req.headers.get('cookie') ?? ''
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return undefined
}
