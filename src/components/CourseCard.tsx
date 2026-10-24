import { Link } from 'react-router-dom'
import { Clock, PlayCircle, Star, Users } from 'lucide-react'
import { type Course, categories, formatPrice, monthly } from '../data/courses'

export function CourseCover({ course, className = '' }: { course: Course; className?: string }) {
  const cat = categories.find((c) => c.id === course.category)
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${course.accent} ${className}`}>
      <div className="bg-grid-dark absolute inset-0 opacity-60" />
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="chip bg-white/20 text-white backdrop-blur">{cat?.name}</span>
          {course.bestseller && <span className="chip bg-lime-accent text-ink-900">Ommabop</span>}
          {!course.bestseller && course.isNew && <span className="chip bg-white text-ink-900">Yangi</span>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {course.tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-md bg-black/20 px-2 py-0.5 font-mono text-[11px] font-medium text-white/90 backdrop-blur">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/kurs/${course.slug}`}
      className="group card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_48px_-24px_rgba(30,27,75,0.35)]"
    >
      <CourseCover course={course} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {course.rating}
            <span className="font-normal text-slate-400">({course.reviews})</span>
          </span>
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.students.toLocaleString('ru-RU')}</span>
          <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{course.level}</span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug font-bold text-slate-900 group-hover:text-brand-700">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{course.subtitle}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.months} oy</span>
          <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" /> {course.lessons} dars</span>
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4 mt-5">
          <div>
            {course.oldPrice && <div className="text-xs text-slate-400 line-through">{formatPrice(course.oldPrice)}</div>}
            <div className="font-display text-lg font-extrabold text-slate-900">{formatPrice(course.price)}</div>
          </div>
          <div className="text-right text-xs text-slate-500">
            yoki oyiga<br />
            <span className="font-semibold text-brand-700">{formatPrice(monthly(course))}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
