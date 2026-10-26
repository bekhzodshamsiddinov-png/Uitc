import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays, Users } from 'lucide-react'
import type { Course } from '../../api/_lib/content'
import { useLp, useT } from '../i18n'

export function CourseCard({ course, eager = false }: { course: Course; key?: string; eager?: boolean }) {
  const t = useT()
  const lp = useLp()
  return (
    <Link
      to={lp(`/kurs/${course.slug}`)}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(12,22,49,0.45)] hover:ring-brand-200"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#f3ebe1]">
        <img src={course.image} alt="" loading={eager ? 'eager' : 'lazy'} width={560} height={560} className="aspect-[4/3] w-full object-cover object-center transition duration-500 group-hover:scale-105" />
        <span className="chip absolute top-3 left-3 bg-white/90 text-ink-900 backdrop-blur">{course.ages}</span>
        {course.featured && <span className="chip absolute top-3 right-3 bg-brand-600 text-white">{t('card.career')}</span>}
      </div>
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <h3 className="font-display text-xl font-extrabold text-ink-900">{course.short}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">{course.subtitle}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5"><CalendarDays className="h-3.5 w-3.5 text-brand-600" /> {course.duration}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5"><Users className="h-3.5 w-3.5 text-brand-600" /> {course.level}</span>
        </div>
        <span className="mt-auto flex items-center justify-between pt-6 text-sm font-bold text-ink-900">
          {t('card.plan')}
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white transition group-hover:bg-brand-600">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </span>
      </div>
    </Link>
  )
}
