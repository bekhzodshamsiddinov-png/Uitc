import { Link } from 'react-router-dom'
import { Award, BarChart3, Bell, BookOpen, Flame, Home, LogOut, MessageSquare, PlayCircle, Settings, Trophy } from 'lucide-react'
import { courses } from '../data/courses'
import { CourseCover } from '../components/CourseCard'
import { Logo } from '../components/Logo'
import { usePageTitle } from '../lib/usePageTitle'

const mine = [
  { c: courses[0], progress: 64, next: 'useEffect va hayot sikli' },
  { c: courses[4], progress: 22, next: 'Auto layout' },
]

const menu = [
  { i: Home, l: 'Bosh panel', active: true },
  { i: BookOpen, l: 'Mening kurslarim' },
  { i: MessageSquare, l: 'Mentor chat' },
  { i: Trophy, l: 'Reyting' },
  { i: Award, l: 'Sertifikatlar' },
  { i: Settings, l: 'Sozlamalar' },
]

export function Cabinet() {
  usePageTitle('Kabinet')
  const week = [40, 75, 30, 90, 60, 20, 0]
  return (
    <div className="flex min-h-dvh bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
        <Logo />
        <nav className="mt-10 space-y-1">
          {menu.map((m) => (
            <button key={m.l} type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${m.active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <m.i className="h-[18px] w-[18px]" /> {m.l}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-ink-900 p-5 text-white">
          <div className="font-display font-bold">Pro obunaga o‘ting</div>
          <p className="mt-1 text-xs text-slate-400">Barcha kurslar va shaxsiy mentor.</p>
          <Link to="/narxlar" className="btn-lime mt-4 w-full py-2">Batafsil</Link>
        </div>
        <Link to="/" className="mt-4 flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:text-slate-900"><LogOut className="h-4 w-4" /> Chiqish</Link>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden lg:block">
            <div className="text-sm text-slate-500">Xayrli kun 👋</div>
            <div className="font-display text-xl font-bold">Jasur</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="chip bg-amber-100 text-amber-800">Demo</span>
            <button type="button" aria-label="Bildirishnomalar" className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200">
              <Bell className="h-5 w-5" /><span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">J</span>
          </div>
        </header>

        <div className="space-y-8 p-4 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { i: Flame, v: '12 kun', l: 'Ketma-ket o‘qish', c: 'text-orange-500 bg-orange-50' },
              { i: PlayCircle, v: '86', l: 'Ko‘rilgan darslar', c: 'text-brand-600 bg-brand-50' },
              { i: Trophy, v: '1 240', l: 'XP ballar', c: 'text-emerald-600 bg-emerald-50' },
            ].map((s) => (
              <div key={s.l} className="card flex items-center gap-4 p-5">
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${s.c}`}><s.i className="h-6 w-6" /></span>
                <div><div className="font-display text-2xl font-extrabold">{s.v}</div><div className="text-sm text-slate-500">{s.l}</div></div>
              </div>
            ))}
          </div>

          <section>
            <h2 className="font-display text-xl font-bold">Davom ettirish</h2>
            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              {mine.map(({ c, progress, next }) => (
                <div key={c.slug} className="card flex flex-col overflow-hidden sm:flex-row">
                  <CourseCover course={c} className="aspect-video sm:aspect-auto sm:w-48" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-xs font-semibold text-brand-600">Keyingi dars</div>
                    <div className="mt-0.5 font-semibold">{next}</div>
                    <div className="mt-1 text-sm text-slate-500">{c.title}</div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" style={{ width: `${progress}%` }} /></div>
                      <span className="text-sm font-bold">{progress}%</span>
                    </div>
                    <Link to={`/kurs/${c.slug}`} className="btn-primary mt-4 self-start py-2.5"><PlayCircle className="h-4 w-4" /> Davom etish</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Haftalik faollik</h2>
                <BarChart3 className="h-5 w-5 text-slate-400" />
              </div>
              <div className="mt-6 flex h-40 items-end gap-3">
                {week.map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end"><div className={`w-full rounded-lg ${i === 3 ? 'bg-brand-600' : 'bg-brand-100'}`} style={{ height: `${Math.max(h, 4)}%` }} /></div>
                    <span className="text-xs text-slate-500">{['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold">Yaqin jonli sessiyalar</h2>
              <ul className="mt-4 space-y-3">
                {[['React: savol-javob', 'Bugun, 20:00'], ['Portfolio review', 'Payshanba, 19:00'], ['Figma workshop', 'Shanba, 11:00']].map(([t, d]) => (
                  <li key={t} className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5">
                    <div><div className="text-sm font-semibold">{t}</div><div className="text-xs text-slate-500">{d}</div></div>
                    <button type="button" className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-slate-200">Eslatish</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
