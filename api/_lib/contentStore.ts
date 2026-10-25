import { listAll, readJson, remove, writeJson } from './store.js'
import type { SiteContent } from './content.js'

export const CURRENT = 'content/site.json'
const HISTORY = 'content/history/'
const KEEP = 30

export interface Stored { content: SiteContent; savedAt: string; version: number }

export const loadStored = () => readJson<Stored>(CURRENT)

/** Saves new content, keeping the previous version in history for one-click restore. */
export async function saveContent(content: SiteContent): Promise<Stored> {
  const prev = await loadStored()
  if (prev) await writeJson(`${HISTORY}${Date.parse(prev.savedAt)}-v${prev.version}.json`, prev)
  const next: Stored = { content, savedAt: new Date().toISOString(), version: (prev?.version ?? 0) + 1 }
  await writeJson(CURRENT, next)
  const old = (await listAll(HISTORY)).sort((a, b) => b.pathname.localeCompare(a.pathname)).slice(KEEP)
  await Promise.all(old.map((b) => remove(b.pathname)))
  return next
}

export async function listHistory() {
  const items = await listAll(HISTORY)
  return items
    .map((b) => {
      const m = /history\/(\d+)-v(\d+)\.json$/.exec(b.pathname)
      return m ? { id: `${m[1]}-v${m[2]}`, savedAt: new Date(Number(m[1])).toISOString(), version: Number(m[2]) } : null
    })
    .filter((x): x is { id: string; savedAt: string; version: number } => !!x)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
}

export async function loadHistory(id: string) {
  if (!/^\d{13}-v\d{1,6}$/.test(id)) return null
  return readJson<Stored>(`${HISTORY}${id}.json`)
}
