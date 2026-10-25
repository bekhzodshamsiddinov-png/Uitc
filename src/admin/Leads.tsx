import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Inbox, Loader2, MessageSquarePlus, Phone, RefreshCw, Search, Trash2, X } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import { api, errorText, fmtDate, statusMeta, STATUS_ORDER, type Lead, type LeadStatus } from './api'
import { useCourseName } from './Dashboard'

const whoLabel = { child: 'Farzandi uchun', self: 'O‘zi uchun', unknown: '—' } as const
const langLabel = { uz: 'O‘zbekcha', ru: 'Ruscha', en: 'Inglizcha' } as const
const isStatus = (v: string | null): v is LeadStatus => !!v && (STATUS_ORDER as string[]).includes(v)

function StatusBadge({ s }: { s: LeadStatus }) {
  return <span className={`chip whitespace-nowrap ring-1 ${statusMeta[s].cls}`}><span className={`h-1.5 w-1.5 rounded-full ${statusMeta[s].dot}`} />{statusMeta[s].label}</span>
}

function Drawer({ lead, onClose, onUpdate, onDelete }: { lead: Lead; onClose: () => void; onUpdate: (l: Lead) => void; onDelete: (key: string) => void }) {
  const courseName = useCourseName()
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)

  const patch = async (body: Record<string, unknown>) => {
    setBusy(true)
    setError('')
    try {
      const r = await api<{ lead: Lead }>('leads', { method: 'PATCH', body: { key: lead.key, ...body } })
      onUpdate(r.lead)
      return true
    } catch (e) {
      setError(errorText(e))
      return false
    } finally {
      setBusy(false)
    }
  }
  const addNote = async (e: FormEvent) => {
    e.preventDefault()
    if (note.trim() && (await patch({ note }))) setNote('')
  }
  const remove = async () => {
    setBusy(true)
    try {
      await api(`leads?key=${encodeURIComponent(lead.key)}`, { method: 'DELETE' })
      onDelete(lead.key)
      onClose()
    } catch (e) {
      setError(errorText(e))
      setBusy(false)
    }
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end bg-ink-900/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside
        initial={{ x: 40 }}
        animate={{ x: 0 }}
        exit={{ x: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
        role="dialog"
        aria-label="Ariza tafsilotlari"
      >
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <div className="text-xs font-semibold text-slate-400">{fmtDate(lead.createdAt)}</div>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-ink-900">{lead.name}</h2>
            <div className="mt-2"><StatusBadge s={lead.status} /></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Yopish" className="grid h-9 w-9 place-items-center rounded-xl hover:bg-surface"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-6 p-6">
          <a href={`tel:${lead.phone}`} className="btn-primary w-full py-3.5 text-base"><Phone className="h-4 w-4" /> {lead.phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')}</a>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-surface p-3"><dt className="text-xs text-slate-500">Kurs</dt><dd className="mt-0.5 font-semibold">{courseName(lead.course)}</dd></div>
            <div className="rounded-xl bg-surface p-3"><dt className="text-xs text-slate-500">Kim uchun</dt><dd className="mt-0.5 font-semibold">{whoLabel[lead.who] ?? '—'}</dd></div>
            <div className="rounded-xl bg-surface p-3"><dt className="text-xs text-slate-500">Sayt tili</dt><dd className="mt-0.5 font-semibold">{langLabel[lead.lang ?? 'uz']}</dd></div>
          </dl>

          <div>
            <div className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">Holatni o‘zgartirish</div>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy || s === lead.status}
                  onClick={() => patch({ status: s })}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition ${s === lead.status ? statusMeta[s].cls : 'bg-white text-slate-600 ring-slate-200 hover:ring-slate-300'}`}
                >
                  {statusMeta[s].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">Izohlar</div>
            {lead.notes.length ? (
              <ul className="space-y-2">
                {[...lead.notes].reverse().map((n) => (
                  <li key={n.at} className="rounded-xl bg-surface p-3 text-sm">
                    <p className="whitespace-pre-wrap text-slate-700">{n.text}</p>
                    <div className="mt-1 text-[11px] text-slate-400">{fmtDate(n.at)}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">Hali izoh yo‘q.</p>
            )}
            <form onSubmit={addNote} className="mt-3 flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder="Masalan: shanba 10:00 sinov darsiga keladi" className="input py-2.5 text-sm" />
              <button type="submit" disabled={busy || !note.trim()} className="btn-dark px-3.5" aria-label="Izoh qo‘shish"><MessageSquarePlus className="h-4 w-4" /></button>
            </form>
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-600" role="alert">{error}</p>}
        </div>

        <div className="mt-auto border-t border-slate-100 p-6">
          {confirmDel ? (
            <div className="flex items-center gap-2">
              <span className="flex-1 text-sm text-slate-600">Ariza butunlay o‘chiriladi. Ishonchingiz komilmi?</span>
              <button type="button" onClick={() => setConfirmDel(false)} className="btn-ghost py-2">Bekor</button>
              <button type="button" onClick={remove} disabled={busy} className="btn bg-rose-600 py-2 text-white hover:bg-rose-700">O‘chirish</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDel(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"><Trash2 className="h-4 w-4" /> Arizani o‘chirish</button>
          )}
        </div>
      </motion.aside>
    </motion.div>
  )
}

export function Leads({ leads, error, onReload, onUpdate, onDelete }: { leads: Lead[] | null; error: string; onReload: () => void; onUpdate: (l: Lead) => void; onDelete: (key: string) => void }) {
  const [params, setParams] = useSearchParams()
  const courseName = useCourseName()
  const { courses } = useContent()
  const [q, setQ] = useState('')
  const [openKey, setOpenKey] = useState<string | null>(null)
  const status = isStatus(params.get('holat')) ? (params.get('holat') as LeadStatus) : null
  const course = params.get('kurs') ?? ''

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    if (!leads) return []
    const needle = q.trim().toLowerCase()
    const digits = needle.replace(/\D/g, '')
    return leads.filter(
      (l) =>
        (!status || l.status === status) &&
        (!course || l.course === course) &&
        (!needle || l.name.toLowerCase().includes(needle) || (digits.length >= 3 && l.phone.includes(digits))),
    )
  }, [leads, q, status, course])

  const open = leads?.find((l) => l.key === openKey) ?? null

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Arizalar</h1>
          <p className="mt-1 text-sm text-slate-500">Saytdan kelgan barcha so‘rovlar. Qatorni bosib tafsilotlarni oching.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onReload} className="btn-ghost py-2"><RefreshCw className="h-4 w-4" /> Yangilash</button>
          <a href="/api/admin/leads?format=csv" className="btn-dark py-2"><Download className="h-4 w-4" /> Excel (CSV)</a>
        </div>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {[null, ...STATUS_ORDER].map((s) => {
          const n = leads ? (s ? leads.filter((l) => l.status === s).length : leads.length) : 0
          const on = status === s
          return (
            <button key={s ?? 'all'} type="button" onClick={() => set('holat', s)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${on ? 'bg-ink-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'}`}>
              {s ? statusMeta[s].label : 'Hammasi'} <span className={on ? 'text-slate-400' : 'text-slate-400'}>{n}</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Qidirish</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Ism yoki telefon raqam bo‘yicha qidirish" className="input pl-10" />
        </label>
        <select value={course} onChange={(e) => set('kurs', e.target.value || null)} className="input sm:w-56" aria-label="Kurs bo‘yicha filtr">
          <option value="">Barcha kurslar</option>
          {courses.map((c) => <option key={c.slug} value={c.slug}>{c.short}</option>)}
          <option value="general">Maslahat</option>
        </select>
      </div>

      {!leads ? (
        <div className="grid min-h-[40vh] place-items-center text-slate-500">
          {error ? <button type="button" onClick={onReload} className="btn-ghost"><RefreshCw className="h-4 w-4" /> {error} Qayta urinish</button> : <Loader2 className="h-7 w-7 animate-spin" />}
        </div>
      ) : filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-slate-200/70">
          <Inbox className="h-10 w-10 text-slate-300" />
          <p className="mt-3 font-semibold text-ink-900">{leads.length ? 'Mos ariza topilmadi' : 'Hozircha arizalar yo‘q'}</p>
          <p className="mt-1 text-sm text-slate-500">{leads.length ? 'Filtrlarni o‘zgartirib ko‘ring.' : 'Saytdagi forma to‘ldirilganda arizalar shu yerda paydo bo‘ladi.'}</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 md:block">
            <table className="w-full text-sm">
              <thead className="bg-surface/70 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <tr><th className="px-5 py-3">Ism</th><th className="px-5 py-3">Telefon</th><th className="px-5 py-3">Kurs</th><th className="px-5 py-3">Kim uchun</th><th className="px-5 py-3">Holat</th><th className="px-5 py-3">Sana</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((l) => (
                  <tr key={l.key} onClick={() => setOpenKey(l.key)} className="cursor-pointer transition hover:bg-surface/60">
                    <td className="px-5 py-3.5 font-semibold text-ink-900">{l.name}{l.notes.length > 0 && <span className="ml-2 text-xs font-normal text-slate-400">· {l.notes.length} izoh</span>}</td>
                    <td className="px-5 py-3.5 font-mono text-[13px]">{l.phone}</td>
                    <td className="px-5 py-3.5">{courseName(l.course)}</td>
                    <td className="px-5 py-3.5 text-slate-500">{whoLabel[l.who] ?? '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge s={l.status} /></td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{fmtDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-3 md:hidden">
            {filtered.map((l) => (
              <li key={l.key}>
                <button type="button" onClick={() => setOpenKey(l.key)} className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-ink-900">{l.name}</div>
                      <div className="font-mono text-sm text-slate-600">{l.phone}</div>
                    </div>
                    <StatusBadge s={l.status} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{courseName(l.course)} · {fmtDate(l.createdAt)}</div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <AnimatePresence>{open && <Drawer key={open.key} lead={open} onClose={() => setOpenKey(null)} onUpdate={onUpdate} onDelete={onDelete} />}</AnimatePresence>
    </div>
  )
}
