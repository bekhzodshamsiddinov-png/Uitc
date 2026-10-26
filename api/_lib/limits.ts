// Rate limits shared by every function instance (stored in the private Blob
// store). Slower than the in-memory burst check, but an attacker cannot dodge
// them by landing on a fresh instance.
import { createHash } from 'node:crypto'
import { readJson, writeJson } from './store.js'

interface Counter { count: number; first: number }

// IPs are stored only as salted hashes.
const hashKey = (s: string) => createHash('sha256').update(`uitc-limit:${process.env.ADMIN_SESSION_SECRET ?? ''}:${s}`).digest('hex').slice(0, 32)

/** Counts one hit; returns true when `max` hits within `windowMs` are exceeded. */
export async function sharedLimited(name: string, key: string, max: number, windowMs: number) {
  const path = `security/${name}-${hashKey(key)}.json`
  const now = Date.now()
  const cur = await readJson<Counter>(path)
  const next = !cur || now - cur.first > windowMs ? { count: 1, first: now } : { count: cur.count + 1, first: cur.first }
  if (next.count > max) return true
  await writeJson(path, next)
  return false
}
