import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FolderGit2,
  Infinity as InfinityIcon,
  Lock,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
} from 'lucide-react'
import { categories, courses, formatPrice, getCourse, monthly } from '../data/courses'
import { CourseCard, CourseCover } from '../components/CourseCard'
import { Faq, generalFaq } from '../components/Faq'
import { LeadForm } from '../components/LeadForm'
import { NotFound } from './NotFound'
import { usePageTitle } from '../lib/usePageTitle'

export function CourseDetail() {
  const { slug = '' } = useParams()
  const course = getCourse(slug)
  usePageTitle(course?.title ?? 'Kurs topilmadi')
  const [openMod, setOpenMod] = useState<number | null>(0)

  if (!course) return <NotFound />

  const cat = categories.find((c) => c.id === course.category)
  const related = courses.filter((c) => c.slug !== course.slug && c.category === course.category).concat(courses.filter((c) => c.slug !== course.slug)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3)

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="container-x relative py-12 lg:py-16">
          <nav className="flex items-center gap-1.5 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Bosh sahifa</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/kurslar" className="hover:text-white">Kurslar</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/kurslar?yonalish=${course.category}`} className="hover:text-white">{cat?.name}</Link>
          </nav>
          <div className="mt-6 max-w-3xl lg:max-w-[calc(100%-420px)]">
            <div className="flex flex-wrap gap-2">
              {course.bestseller && <span className="chip bg-lime-accent text-ink-900">Ommabop</span>}
              {course.isNew && <span className="chip bg-white text-ink-900">Yangi</span>}
              <span className="chip bg-white/10 text-white">{course.level}</span>
            </div>
            <h1 className="h-display mt-5 text-3xl leading-tight sm:text-5xl">{course.title}</h1>
            <p className="mt-4 text-lg text-slate-300">{course.subtitle}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> <b className="text-white">{course.rating}</b> ({course.reviews} sharh)</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.students.toLocaleString('ru-RU')} o‘quvchi</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {course.months} oy</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-sm font-bold">{course.mentor.initials}</span>
              <div className="text-sm">
                <div className="font-semibold text-white">{course.mentor.name}</div>
                <div className="text-slate-400">{course.mentor.role} · {course.mentor.years} yil tajriba</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_380px] lg:py-16">
        <div className="min-w-0 space-y-14">
          {/* Outcomes */}
          <section>
            <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">Nimalarni o‘rganasiz</h2>
            <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 p-6 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-3 text-[15px] text-slate-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> {o}
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { i: PlayCircle, v: course.lessons, l: 'video dars' },
              { i: Clock, v: `${course.hours} soat`, l: 'kontent' },
              { i: FolderGit2, v: course.projects, l: 'real loyiha' },
              { i: Award, v: '1', l: 'sertifikat' },
            ].map((s) => (
              <div key={s.l} className="card p-5">
                <s.i className="h-6 w-6 text-brand-600" />
                <div className="mt-3 font-display text-2xl font-extrabold text-ink-900">{s.v}</div>
                <div className="text-sm text-slate-500">{s.l}</div>
              </div>
            ))}
          </section>

          {/* Curriculum */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">O‘quv dasturi</h2>
              <span className="text-sm text-slate-500">{course.modules.length} modul · {course.lessons} dars · {course.hours} soat</span>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              {course.modules.map((m, i) => {
                const open = openMod === i
                return (
                  <div key={m.title} className="border-b border-slate-200 last:border-0">
                    <button type="button" onClick={() => setOpenMod(open ? null : i)} aria-expanded={open} className="flex w-full items-center gap-4 bg-slate-50/70 px-5 py-4 text-left hover:bg-slate-50">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white font-display text-sm font-bold text-brand-700 ring-1 ring-slate-200">{i + 1}</span>
                      <span className="flex-1 font-semibold text-slate-900">{m.title}</span>
                      <span className="hidden text-xs text-slate-500 sm:block">{m.lessons.length} dars</span>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          {m.lessons.map((l) => (
                            <li key={l.title} className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700">
                              {l.free ? <PlayCircle className="h-4 w-4 text-brand-600" /> : <Lock className="h-4 w-4 text-slate-300" />}
                              <span className="flex-1">{l.title}</span>
                              {l.free && <span className="chip bg-emerald-50 text-emerald-700">Bepul</span>}
                              <span className="w-14 text-right text-xs text-slate-400">{l.minutes} daq</span>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">Talablar</h2>
            <ul className="mt-5 space-y-2.5">
              {course.requirements.map((r) => (
                <li key={r} className="flex items-center gap-3 text-slate-700"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {r}</li>
              ))}
            </ul>
          </section>

          {/* Mentor */}
          <section>
            <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">Mentor</h2>
            <div className="card mt-6 flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 font-display text-2xl font-extrabold text-white">{course.mentor.initials}</span>
              <div>
                <div className="font-display text-xl font-bold">{course.mentor.name}</div>
                <div className="text-sm font-medium text-brand-700">{course.mentor.role}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {course.mentor.years} yillik amaliy tajriba. Yirik loyihalarda ishlagan va yuzlab o‘quvchilarni IT sohasiga olib kirgan.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">Savollar</h2>
            <div className="mt-6"><Faq items={generalFaq.slice(0, 4)} /></div>
          </section>
        </div>

        {/* Sticky purchase card */}
        <aside className="lg:-mt-72">
          <div className="card overflow-hidden shadow-[0_32px_64px_-32px_rgba(30,27,75,0.45)] lg:sticky lg:top-24">
            <CourseCover course={course} className="aspect-video" />
            <div className="p-6">
              {course.oldPrice && <div className="text-sm text-slate-400 line-through">{formatPrice(course.oldPrice)}</div>}
              <div className="h-display text-3xl whitespace-nowrap text-ink-900">{formatPrice(course.price)}</div>
              <div className="mt-1 text-sm text-slate-500">yoki <b className="text-brand-700">{formatPrice(monthly(course))}</b> / oy × {course.months}</div>
              <Link to={`/tolov/${course.slug}`} className="btn-primary mt-6 w-full py-4 text-base">Kursni sotib olish</Link>
              <a href="#kurs-ariza" className="btn-ghost mt-3 w-full">Bepul konsultatsiya</a>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2.5"><InfinityIcon className="h-4 w-4 text-slate-400" /> Umrbod kirish huquqi</li>
                <li className="flex items-center gap-2.5"><Smartphone className="h-4 w-4 text-slate-400" /> Telefon va kompyuterda</li>
                <li className="flex items-center gap-2.5"><Award className="h-4 w-4 text-slate-400" /> Tugatganlik sertifikati</li>
                <li className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-slate-400" /> 14 kun ichida pulni qaytarish</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <section id="kurs-ariza" className="scroll-mt-20 bg-slate-50 py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h-display text-3xl text-ink-900">Savolingiz bormi?</h2>
            <p className="mt-3 text-slate-600">Raqamingizni qoldiring — menejer kurs haqida batafsil gapirib beradi va birinchi darsni bepul ochadi.</p>
          </div>
          <div className="card p-6 sm:p-8"><LeadForm defaultCourse={course.slug} /></div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">Sizga yoqishi mumkin</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
