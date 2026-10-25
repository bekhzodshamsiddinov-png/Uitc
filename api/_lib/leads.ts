import { randomBytes } from 'node:crypto'
import { listAll, readJson, remove, writeJson } from './store.js'
import type { LeadInput } from './validate.js'

export const STATUSES = ['new', 'contacted', 'trial', 'enrolled', 'rejected'] as const
export type LeadStatus = (typeof STATUSES)[number]

export interface Lead {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  phone: string
  course: string
  who: 'child' | 'self' | 'unknown'
  source: string
  status: LeadStatus
  notes: { at: string; text: string }[]
}

const PREFIX = 'leads/'
const pathFor = (l: Pick<Lead, 'id' | 'createdAt'>) => `${PREFIX}${new Date(l.createdAt).getTime()}-${l.id}.json`
const ID_RE = /^\d{13}-[a-f0-9]{16}$/

export async function createLead(data: LeadInput): Promise<Lead> {
  const now = new Date().toISOString()
  const msg = data.message ?? ''
  const who = msg.includes('kim-uchun:child') ? 'child' : msg.includes('kim-uchun:self') ? 'self' : 'unknown'
  const source = msg === 'hero' ? 'hero' : msg.startsWith('kim-uchun') ? 'form' : 'other'
  const lead: Lead = {
    id: randomBytes(8).toString('hex'),
    createdAt: now,
    updatedAt: now,
    name: data.name,
    phone: data.phone,
    course: data.course,
    who,
    source,
    status: 'new',
    notes: [],
  }
  await writeJson(pathFor(lead), lead)
  return lead
}

// Per-instance cache: a lead blob only changes when we overwrite it, which bumps uploadedAt.
const cache = new Map<string, { at: number; lead: Lead }>()

export async function allLeads(): Promise<Lead[]> {
  const blobs = await listAll(PREFIX)
  const out: Lead[] = []
  const queue = [...blobs]
  const worker = async () => {
    for (let b = queue.shift(); b; b = queue.shift()) {
      const at = b.uploadedAt.getTime()
      const hit = cache.get(b.pathname)
      if (hit && hit.at === at) { out.push(hit.lead); continue }
      const lead = await readJson<Lead>(b.pathname)
      if (lead) { cache.set(b.pathname, { at, lead }); out.push(lead) }
    }
  }
  await Promise.all(Array.from({ length: 12 }, worker))
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** Lead key as exposed to the admin UI: "<createdMs>-<id>". */
export const leadKey = (l: Lead) => `${new Date(l.createdAt).getTime()}-${l.id}`

export async function getLead(key: string) {
  if (!ID_RE.test(key)) return null
  return readJson<Lead>(`${PREFIX}${key}.json`)
}

export async function saveLead(lead: Lead) {
  lead.updatedAt = new Date().toISOString()
  await writeJson(pathFor(lead), lead)
}

export async function deleteLead(key: string) {
  if (!ID_RE.test(key)) return false
  await remove(`${PREFIX}${key}.json`)
  for (const k of cache.keys()) if (k.endsWith(`${key}.json`)) cache.delete(k)
  return true
}
