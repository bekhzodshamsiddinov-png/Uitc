import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Inbox, Loader2, RefreshCw, TrendingUp, UserCheck } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import { fmtDate, statusMeta, STATUS_ORDER, type Lead } from './api'

export function useCourseName() {
  const { courses } = useContent()
  return (slug: string) => courses.find((c) => c.slug === slug)?.short ?? (slug === 'general' ? 'Maslahat' : slug)
}
const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' })

export function Dashboard({ leads, error, onReload }: { leads: Lead[] | null; error: string; onReload: () => void }) {
  const courseName = useCourseName()
  const { courses } = useContent()
  if (!leads) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-500">
        {error ? <button type="button" onClick={onReload} className="btn-ghost"><RefreshCw className="h-4 w-4" /> {error} Qayta uriniş</button> : <Loader2 className="h-7 w-7 animate-spin" />}
      </div>
    )
  }

  const now = new Date()
  const today = dayKey(now)
  const weekAgo = now.getTime() - 7 * 864e5
  const total = leads.length
  const todayCount = leads.filter((l) => dayKey(new Date(l.createdAt)) === today).length
  const weekCount = leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length
  const newCount = leads.filter((l) => l.status === 'new').length
  const enrolled = leads.filter((l) => l.status === 'enrolled').length
  const conv = total ? Math.round((enrolled / total) * 100) : 0

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getTime() - (13 - i) * 864e5)
    const k = dayKey(d)
    return { k, label: d.toLocaleDateString('uz-UZ', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit' }), n: leads.filter((l) => dayKey(new Date(l.createdAt)) === k).length }
  })
  const maxDay = Math.max(1, ...days.map((d) => d.n))
  const byCourse = [...courses.map((c) => c.slug), 'general']
    .map((slug) => ({ slug, n: leads.filter((l) => (slug === 'general' ? !courses.some((c) => c.slug === l.course) : l.course === slug)).length }))
    .sort((a, b) => b.n - a.n)
  const maxCourse = Math.max(1, ...byCourse.map((c) => c.n))

  const kpis = [
    { label: 'Jami arizalar', value: total, icon: Inbox, tone: 'bg-ink-900 text-white' },
    { label: 'Bugun', value: todayCount, icon: CalendarDays, tone: 'bg-white' },
    { label: 'Sönggi 7 kun', value: weekCount, icon: TrendingUp, tone: 'bg-white' },
    { label: 'Javob kutmoqda', value: newCount, icon: Inbox, tone: newCount ? 'bg-brand-600 text-white' : 'bg-white' },
    { label: 'Öqişga yozildi', value: `${enrolled} · ${conv}%`, icon: UserCheck, tone: 'bg-white' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900">Boş panel</h1>
          <p className="mt-1 text-sm text-slate-500">Arizalar va sotuv holati bir qaraşda.</p>
        </div>
        <button type="button" onClick={onReload} className="btn-ghost py-2"><RefreshCw className="h-4 w-4" /> Yangilaş</button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-2xl p-5 ring-1 ring-slate-200/70 ${k.tone}`}>
            <k.icon className="h-5 w-5 opacity-60" />
            <div className="mt-3 font-display text-3xl font-extrabold">{k.value}</div>
            <div className="mt-0.5 text-sm opacity-70">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
          <h2 className="font-display text-lg font-bold">Sönggi 14 kun</h2>
          <div className="mt-6 flex h-48 items-end gap-1.5 sm:gap-2.5">
            {days.map((d) => (
              <div key={d.k} className="group flex flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] font-bold text-ink-900 opacity-0 transition group-hover:opacity-100">{d.n}</span>
                <div className={`w-full rounded-md ${d.k === today ? 'bg-brand-600' : 'bg-ink-900/80'} transition group-hover:bg-brand-500`} style={{ height: `${Math.max(4, Math.round((d.n / maxDay) * 140))}px` }} />
                <span className="hidden text-[10px] text-slate-400 sm:block">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
          <h2 className="font-display text-lg font-bold">Kurslar böyiça</h2>
          <ul className="mt-5 space-y-3.5">
            {byCourse.map((c) => (
              <li key={c.slug}>
                <div className="flex justify-between text-sm"><span className="font-medium text-slate-700">{courseName(c.slug)}</span><span className="font-bold">{c.n}</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-brand-600" style={{ width: `${(c.n / maxCourse) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
          <h2 className="font-display text-lg font-bold">Holatlar</h2>
          <ul className="mt-5 space-y-2">
            {STATUS_ORDER.map((s) => {
              const n = leads.filter((l) => l.status === s).length
              return (
                <li key={s}>
                  <Link to={`/admin/arizalar?holat=${s}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusMeta[s].dot}`} />
                    <span className="flex-1 text-sm font-medium">{statusMeta[s].label}</span>
                    <span className="font-bold">{n}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Sönggi arizalar</h2>
            <Link to="/admin/arizalar" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">Barçasi <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {leads.length ? (
            <ul className="mt-4 divide-y divide-slate-100">
              {leads.slice(0, 6).map((l) => (
                <li key={l.key} className="flex items-center gap-3 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface font-bold text-ink-900">{l.name.slice(0, 1).toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{l.name}</div>
                    <div className="text-xs text-slate-500">{courseName(l.course)} · {fmtDate(l.createdAt)}</div>
                  </div>
                  <span className={`chip ring-1 ${statusMeta[l.status].cls}`}>{statusMeta[l.status].label}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-xl bg-surface p-6 text-center text-sm text-slate-500">Hozirça arizalar yöq. Saytdagi forma töldirilganda şu yerda paydo böladi.</p>
          )}
        </section>
      </div>
    </div>
  )
}
