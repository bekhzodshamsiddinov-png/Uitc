import { useSearchParams } from 'react-router-dom'
import { useContent, useCourses } from '../content/ContentContext'
import type { Audience, AudienceId } from '../../api/_lib/content'
import { CourseCard } from '../components/CourseCard'
import { LeadForm } from '../components/LeadForm'
import { usePageTitle } from '../lib/usePageTitle'

const isAudience = (audiences: Audience[], v: string | null): v is AudienceId => !!v && audiences.some((a) => a.id === v)

export function Catalog() {
  usePageTitle('Kurslar')
  const [params, setParams] = useSearchParams()
  const { audiences } = useContent()
  const courses = useCourses()
  // Only accept known values from the URL; anything else is ignored.
  const raw = params.get('kim')
  const who = isAudience(audiences, raw) ? raw : null
  const list = who ? courses.filter((c) => c.audiences.includes(who)) : courses

  return (
    <div className="pb-20">
      <section className="px-3 pt-3">
        <div className="container-x rounded-[32px] bg-white py-12 lg:py-16">
          <div className="eyebrow">Kurslar</div>
          <h1 className="h-display mt-4 text-4xl text-ink-900 sm:text-6xl">Barcha kurslar</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">Darslar jonli formatda, tajribali ustozlar bilan. Qaysi kurs mosligini bilmasangiz — bepul sinov darsida aniqlaymiz.</p>
          <div className="no-scrollbar mt-8 -mx-4 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Yosh toifasi">
            {[{ id: null, name: 'Hammasi', ages: '' }, ...audiences].map((a) => {
              const on = who === a.id
              return (
                <button
                  key={a.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setParams(a.id ? { kim: a.id } : {}, { replace: true })}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${on ? 'bg-ink-900 text-white' : 'bg-surface text-slate-700 hover:bg-slate-200'}`}
                >
                  {a.name}{a.ages && <span className={`ml-1.5 text-xs ${on ? 'text-slate-400' : 'text-slate-400'}`}>{a.ages}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container-x mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((c) => <CourseCard key={c.slug} course={c} />)}
      </div>

      <section id="ariza" className="container-x mt-16 grid items-center gap-10 rounded-[32px] bg-ink-900 p-6 sm:p-12 lg:grid-cols-2">
        <div className="text-white">
          <h2 className="h-display text-3xl sm:text-4xl">Qaysi kurs mos — birga aniqlaymiz</h2>
          <p className="mt-3 text-slate-400">Ariza qoldiring, administratorimiz qo‘ng‘iroq qilib maslahat beradi.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 sm:p-8"><LeadForm idPrefix="cat" /></div>
      </section>
    </div>
  )
}
