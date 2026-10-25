import { readJson } from '../_lib/http.js'
import { adminJson, requireAdmin } from '../_lib/guard.js'
import { allLeads, deleteLead, getLead, leadKey, saveLead, STATUSES, type Lead, type LeadStatus } from '../_lib/leads.js'
import { clean } from '../_lib/validate.js'

const view = (l: Lead) => ({ key: leadKey(l), ...l })

// Neutralise spreadsheet formula injection (=, +, -, @ at cell start) and quote properly.
const csvCell = (v: string) => {
  const s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v
  return `"${s.replace(/"/g, '""')}"`
}

export async function GET(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  const leads = await allLeads()
  const url = new URL(req.url)
  if (url.searchParams.get('format') === 'csv') {
    const head = ['Sana', 'Ism', 'Telefon', 'Kurs', 'Kim uchun', 'Holat', 'Izohlar']
    const rows = leads.map((l) => [
      new Date(l.createdAt).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
      l.name, l.phone, l.course, l.who, l.status, l.notes.map((n) => n.text).join(' | '),
    ].map(csvCell).join(','))
    return new Response('﻿' + [head.map(csvCell).join(','), ...rows].join('\r\n'), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="uitc-arizalar-${new Date().toISOString().slice(0, 10)}.csv"`,
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
        'x-robots-tag': 'noindex',
      },
    })
  }
  return adminJson(200, { ok: true, leads: leads.map(view) })
}

export async function PATCH(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  const body = await readJson(req, 4096)
  if (body instanceof Response) return body
  const lead = await getLead(String(body.key ?? ''))
  if (!lead) return adminJson(404, { ok: false, error: 'not_found' })
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as LeadStatus)) return adminJson(422, { ok: false, error: 'bad_status' })
    lead.status = body.status as LeadStatus
  }
  const note = clean(body.note, 1000)
  if (note) lead.notes = [...lead.notes, { at: new Date().toISOString(), text: note }].slice(-100)
  await saveLead(lead)
  return adminJson(200, { ok: true, lead: view(lead) })
}

export async function DELETE(req: Request) {
  const g = await requireAdmin(req)
  if (g.error) return g.error
  const key = new URL(req.url).searchParams.get('key') ?? ''
  if (!(await deleteLead(key))) return adminJson(404, { ok: false, error: 'not_found' })
  return adminJson(200, { ok: true })
}
