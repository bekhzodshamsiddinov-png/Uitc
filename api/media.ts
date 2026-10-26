// GET /api/media?p=media/<file> — serves images and videos uploaded from the
// admin panel out of the private Blob store. Supports HTTP Range so videos
// stream and seek (Safari requires this). Only image/video types are served.
import { head } from '@vercel/blob'

const PATH_RE = /^media\/[\w.-]{1,160}$/
const ALLOWED = /^(image\/(jpeg|png|webp|avif)|video\/(mp4|webm|quicktime))$/
const meta = new Map<string, { url: string; type: string; size: number }>()

const err = (status: number) => new Response(null, { status, headers: { 'cache-control': 'no-store' } })

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams.get('p') ?? ''
  if (!PATH_RE.test(p)) return err(400)
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return err(503)

  let m = meta.get(p)
  if (!m) {
    try {
      const h = await head(p)
      m = { url: h.url, type: h.contentType, size: h.size }
      if (meta.size > 2000) meta.clear()
      meta.set(p, m)
    } catch {
      return err(404)
    }
  }
  if (!ALLOWED.test(m.type)) return err(415)

  const range = req.headers.get('range')
  if (range && !/^bytes=\d*-\d*$/.test(range)) return err(416)
  const upstream = await fetch(m.url, { headers: { authorization: `Bearer ${token}`, ...(range ? { range } : {}) } })
  if (!upstream.ok && upstream.status !== 206) return err(upstream.status === 416 ? 416 : 502)

  const headers = new Headers({
    'content-type': m.type,
    // File names carry a random suffix, so they never change. s-maxage lets the
    // CDN serve repeat views instead of streaming every request through here.
    'cache-control': `public, max-age=31536000${upstream.status === 200 ? ', s-maxage=31536000' : ''}, immutable`,
    'accept-ranges': 'bytes',
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'; sandbox",
    'content-disposition': 'inline',
  })
  for (const h of ['content-length', 'content-range', 'etag', 'last-modified']) {
    const v = upstream.headers.get(h)
    if (v) headers.set(h, v)
  }
  return new Response(upstream.body, { status: upstream.status, headers })
}
