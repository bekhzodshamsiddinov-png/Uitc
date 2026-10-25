// Private Vercel Blob storage for leads and admin state. Nothing here is
// publicly reachable: the store is created with `access: 'private'` and every
// read goes through an authenticated function.
import { del, get, list, put } from '@vercel/blob'

export const storeConfigured = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)

export async function readJson<T>(pathname: string): Promise<T | null> {
  const res = await get(pathname, { access: 'private', useCache: false })
  if (!res || res.statusCode !== 200 || !res.stream) return null
  const text = await new Response(res.stream).text()
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

export async function writeJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  })
}

export async function remove(pathname: string) {
  await del(pathname)
}

export async function listAll(prefix: string) {
  const out: { pathname: string; uploadedAt: Date; size: number }[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix, cursor, limit: 1000 })
    out.push(...page.blobs.map((b) => ({ pathname: b.pathname, uploadedAt: b.uploadedAt, size: b.size })))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor && out.length < 10000)
  return out
}
