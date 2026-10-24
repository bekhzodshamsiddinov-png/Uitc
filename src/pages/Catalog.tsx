import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { categories, courses, type CategoryId, type Level } from '../data/courses'
import { CourseCard } from '../components/CourseCard'
import { usePageTitle } from '../lib/usePageTitle'

const levels: Level[] = ['Boshlang‘ich', 'O‘rta', 'Yuqori']
const sorts = [
  { id: 'popular', label: 'Ommabop' },
  { id: 'rating', label: 'Reyting' },
  { id: 'price-asc', label: 'Arzonroq' },
  { id: 'price-desc', label: 'Qimmatroq' },
] as const

const isCategory = (v: string | null): v is CategoryId => !!v && categories.some((c) => c.id === v)
const isLevel = (v: string | null): v is Level => !!v && (levels as string[]).includes(v)

export function Catalog() {
  usePageTitle('Kurslar')
  const [params, setParams] = useSearchParams()
  // Only accept known values from the URL; anything else is ignored.
  const q = (params.get('q') ?? '').slice(0, 80)
  const cat = isCategory(params.get('yonalish')) ? (params.get('yonalish') as CategoryId) : null
  const level = isLevel(params.get('daraja')) ? (params.get('daraja') as Level) : null
  const sort = sorts.find((s) => s.id === params.get('saralash'))?.id ?? 'popular'

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const needle = q.toLowerCase()
    const r = courses.filter(
      (c) =>
        (!cat || c.category === cat) &&
        (!level || c.level === level) &&
        (!needle || c.title.toLowerCase().includes(needle) || c.tags.some((t) => t.toLowerCase().includes(needle))),
    )
    const by = {
      popular: (a: typeof r[0], b: typeof r[0]) => b.students - a.students,
      rating: (a: typeof r[0], b: typeof r[0]) => b.rating - a.rating,
      'price-asc': (a: typeof r[0], b: typeof r[0]) => a.price - b.price,
      'price-desc': (a: typeof r[0], b: typeof r[0]) => b.price - a.price,
    }[sort]
    return [...r].sort(by)
  }, [q, cat, level, sort])

  const active = !!(q || cat || level)

  return (
    <div className="pb-24">
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="container-x py-12 lg:py-16">
          <h1 className="h-display text-4xl text-ink-900 sm:text-5xl">Barcha kurslar</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Kasbingizni tanlang. Har bir kursda birinchi darslar bepul — ko‘rib, keyin qaror qiling.</p>
          <label className="relative mt-8 block max-w-2xl">
            <span className="sr-only">Kurs qidirish</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              maxLength={80}
              onChange={(e) => set('q', e.target.value || null)}
              placeholder="Masalan: React, Python, Figma…"
              className="input py-4 pl-12 text-base shadow-sm"
            />
          </label>
        </div>
      </section>

      <div className="container-x grid gap-10 pt-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 font-display font-bold text-slate-900">
            <SlidersHorizontal className="h-4 w-4" /> Filtrlar
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">Yo‘nalish</div>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {categories.map((c) => {
                const count = courses.filter((x) => x.category === c.id).length
                const on = cat === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set('yonalish', on ? null : c.id)}
                    aria-pressed={on}
                    className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      on ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'
                    }`}
                  >
                    {c.name}
                    <span className={`text-xs ${on ? 'text-brand-100' : 'text-slate-400'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">Daraja</div>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set('daraja', level === l ? null : l)}
                  aria-pressed={level === l}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${level === l ? 'bg-ink-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          {active && (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
              <X className="h-4 w-4" /> Filtrlarni tozalash
            </button>
          )}
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500"><span className="font-semibold text-slate-900">{list.length}</span> ta kurs topildi</p>
            <label className="flex items-center gap-2 text-sm text-slate-500">
              Saralash:
              <select value={sort} onChange={(e) => set('saralash', e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-100">
                {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
          {list.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((c) => <CourseCard key={c.slug} course={c} />)}
            </div>
          ) : (
            <div className="card grid place-items-center px-6 py-20 text-center">
              <Search className="h-10 w-10 text-slate-300" />
              <h2 className="mt-4 font-display text-xl font-bold">Hech narsa topilmadi</h2>
              <p className="mt-2 text-sm text-slate-500">Boshqa so‘z bilan qidirib ko‘ring yoki filtrlarni tozalang.</p>
              <button type="button" onClick={() => setParams({}, { replace: true })} className="btn-primary mt-6">Filtrlarni tozalash</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
