import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, CalendarDays, Check, ChevronDown, ChevronRight, Phone, Presentation, Target, Users } from 'lucide-react'
import { telHref, useContent, useCourses } from '../content/ContentContext'
import { CourseCard } from '../components/CourseCard'
import { Faq } from '../components/Faq'
import { LeadForm } from '../components/LeadForm'
import { NotFound } from './NotFound'
import { usePageTitle } from '../lib/usePageTitle'
import { useLp, useT } from '../i18n'

export function CourseDetail() {
  const { slug = '' } = useParams()
  const courses = useCourses()
  const { faq, contact } = useContent()
  const phones = contact.phones
  const course = courses.find((c) => c.slug === slug)
  const t = useT()
  const lp = useLp()
  usePageTitle(course?.title ?? t('course.notFound'))
  const [openMod, setOpenMod] = useState<number | null>(0)

  if (!course) return <NotFound />
  const related = courses.filter((c) => c.slug !== course.slug).slice(0, 3)

  return (
    <div className="pb-8">
      <section className="px-3 pt-3">
        <div className="container-x relative overflow-hidden rounded-[32px] bg-ink-900 text-white">
          <div className="bg-grid-dark absolute inset-0 opacity-60" />
          <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
          <div className="relative grid items-center gap-10 py-12 lg:grid-cols-[1.3fr_1fr] lg:py-16">
            <div>
              <nav className="flex items-center gap-1.5 text-sm text-slate-400" aria-label="Breadcrumb">
                <Link to={lp('/')} className="hover:text-white">{t('course.home')}</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link to={lp('/kurslar')} className="hover:text-white">{t('course.courses')}</Link>
              </nav>
              <h1 className="h-display mt-6 text-4xl leading-tight sm:text-6xl">{course.title}</h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300">{course.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { i: CalendarDays, t: course.duration },
                  { i: Users, t: course.ages },
                  { i: Target, t: course.level },
                  { i: Presentation, t: t('course.live') },
                ].map((x) => (
                  <span key={x.t} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    <x.i className="h-4 w-4 text-brand-400" /> {x.t}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#kurs-ariza" className="btn-primary px-7 py-4 text-base">{t('form.submit')}</a>
                <a href={telHref(phones[0])} className="btn border border-white/20 px-7 py-4 text-base text-white hover:bg-white/10"><Phone className="h-4 w-4" /> {phones[0]}</a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="overflow-hidden rounded-[28px] bg-[#f3ebe1] ring-8 ring-white/10">
                <img src={course.image} alt="" width={560} height={560} className="aspect-square w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0 space-y-14">
          <section>
            <h2 className="h-display text-2xl text-ink-900 sm:text-4xl">{t('course.learn')}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-[15px] text-slate-700 ring-1 ring-slate-200/70">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  {o}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="h-display text-2xl text-ink-900 sm:text-4xl">{t('course.plan')}</h2>
            <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70">
              {course.modules.map((m, i) => {
                const open = openMod === i
                return (
                  <div key={m.title} className="border-b border-slate-100 last:border-0">
                    <button type="button" onClick={() => setOpenMod(open ? null : i)} aria-expanded={open} className="flex w-full items-center gap-4 px-5 py-5 text-left hover:bg-surface/60">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display font-extrabold ${open ? 'bg-brand-600 text-white' : 'bg-surface text-ink-900'}`}>{i + 1}</span>
                      <span className="flex-1 font-display text-lg font-bold text-ink-900">{m.title}</span>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          {m.topics.map((t) => (
                            <li key={t} className="flex items-center gap-3 py-2.5 pr-5 pl-[76px] text-[15px] text-slate-600 last:pb-5">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {t}
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

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200/70">
              <h3 className="font-display text-xl font-extrabold text-ink-900">{t('course.forWhom')}</h3>
              <ul className="mt-4 space-y-2.5">
                {course.forWhom.map((f) => <li key={f} className="flex items-start gap-2.5 text-slate-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {f}</li>)}
              </ul>
            </div>
            <div className="rounded-3xl bg-brand-600 p-7 text-white">
              <Award className="h-8 w-8 text-sun" />
              <h3 className="mt-4 font-display text-xl font-extrabold">{t('course.result')}</h3>
              <p className="mt-2 text-white/90">{course.result}</p>
            </div>
          </section>

          <section>
            <h2 className="h-display text-2xl text-ink-900 sm:text-4xl">{t('course.faq')}</h2>
            <div className="mt-6"><Faq items={faq.slice(0, 5)} /></div>
          </section>
        </div>

        <aside id="kurs-ariza" className="scroll-mt-24">
          <div className="rounded-3xl bg-white p-6 shadow-[0_30px_60px_-30px_rgba(12,22,49,0.4)] ring-1 ring-slate-200 lg:sticky lg:top-28 sm:p-7">
            <h3 className="font-display text-2xl font-extrabold text-ink-900">{t('course.trial')}</h3>
            <p className="mt-1.5 text-sm text-slate-500">{t('course.trialText')}</p>
            <div className="mt-6"><LeadForm defaultCourse={course.slug} idPrefix="course" /></div>
          </div>
        </aside>
      </div>

      <section className="container-x pb-12">
        <h2 className="h-display text-2xl text-ink-900 sm:text-3xl">{t('course.others')}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => <CourseCard key={c.slug} course={c} />)}
        </div>
      </section>
    </div>
  )
}
