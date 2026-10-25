// Issues short-lived client tokens so the admin browser can upload images and
// videos straight into the private Blob store (bypasses the 4.5 MB function
// body limit). Only signed-in admins get a token, and only for allowed types.
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { readJson } from '../_lib/http.js'
import { adminJson, requireAdmin } from '../_lib/guard.js'

const NAME_RE = /^media\/[\w.-]{1,120}\.(jpe?g|png|webp|avif|mp4|webm|mov)$/i
const KINDS = {
  image: { types: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'], max: 8 * 1024 * 1024 },
  video: { types: ['video/mp4', 'video/webm', 'video/quicktime'], max: 300 * 1024 * 1024 },
} as const

export async function POST(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  const body = await readJson(req, 16 * 1024)
  if (body instanceof Response) return body
  if (body.type !== 'blob.generate-client-token') return adminJson(400, { ok: false, error: 'unsupported' })
  try {
    const result = await handleUpload({
      request: req,
      body: body as unknown as HandleUploadBody,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const kind = clientPayload === 'video' ? KINDS.video : clientPayload === 'image' ? KINDS.image : null
        if (!kind || !NAME_RE.test(pathname)) throw new Error('bad_upload')
        return {
          allowedContentTypes: [...kind.types],
          maximumSizeInBytes: kind.max,
          addRandomSuffix: true,
          cacheControlMaxAge: 31536000,
          validUntil: Date.now() + 10 * 60 * 1000,
        }
      },
    })
    return adminJson(200, result)
  } catch {
    return adminJson(400, { ok: false, error: 'bad_upload' })
  }
}
