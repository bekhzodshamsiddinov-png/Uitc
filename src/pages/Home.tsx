import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FolderGit2,
  GraduationCap,
  HeartHandshake,
  Loader2,
  Phone,
  PhoneCall,
  Presentation,
  Sparkles,
  Users,
} from 'lucide-react'
import { telHref, useContent, useCourses } from '../content/ContentContext'
import type { SectionText } from '../../api/_lib/content'
import { CourseCard } from '../components/CourseCard'
import { Reveal } from '../components/Reveal'
import { LeadForm } from '../components/LeadForm'
import { Faq } from '../components/Faq'
import { VideoTestimonials } from '../components/VideoTestimonials'
import { Location } from '../components/Location'
import { usePageTitle } from '../lib/usePageTitle'
import { sendLead } from '../lib/lead'
import { formatPhoneInput, validateLead, type LeadErrors } from '../../api/_lib/validate'

function QuickLead() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [errors, setErrors] = useState<LeadErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const startedAt = useRef(Date.now())

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const { data, errors } = validateLead({ name, phone, course: 'general', message: 'hero' })
    setErrors(errors)
    if (Object.keys(errors).length) return
    setStatus('sending')
    const res = await sendLead(data, { website: '', t: startedAt.current })
    setStatus(res === 'ok' ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700" role="status">
        <CheckCircle2 className="h-6 w-6 shrink-0" /> Rahmat! Tez orada qo‘ng‘iroq qilib, sinov darsi vaqtini kelishamiz.
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl bg-white p-2 shadow-[0_20px_50px_-24px_rgba(12,22,49,0.35)] ring-1 ring-slate-200">
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <label className="sr-only" htmlFor="q-name">Ismingiz</label>
        <input id="q-name" className="input border-transparent bg-surface" placeholder="Ismingiz" autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
        <label className="sr-only" htmlFor="q-phone">Telefon</label>
        <input id="q-phone" className="input border-transparent bg-surface" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} aria-invalid={!!errors.phone} />
        <button type="submit" disabled={status === 'sending'} className="btn-primary px-6 py-3.5 whitespace-nowrap">
          {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ro‘yxatdan o‘tish'}
        </button>
      </div>
      {(errors.name || errors.phone || status === 'error') && (
        <p className="px-2 pt-2 text-xs font-medium text-rose-500" role="alert">
          {errors.name ?? errors.phone ?? 'Xatolik yuz berdi. Iltimos, qo‘ng‘iroq qiling.'}
        </p>
      )}
    </form>
  )
}

const reasonIcons = [Presentation, Users, BrainCircuit, FolderGit2, ClipboardCheck, GraduationCap, CalendarCheck, Sparkles]
const stepIcons = [PhoneCall, CalendarCheck, Users, GraduationCap, Award, Sparkles]

function Heading({ s, center = false, dark = false, icon }: { s: SectionText; center?: boolean; dark?: boolean; icon?: ReactNode }) {
  return (
    <>
      {s.eyebrow && <div className={`eyebrow ${dark ? 'border-white/10 bg-white/5 text-lime-accent' : ''}`}>{icon}{s.eyebrow}</div>}
      {s.title && <h2 className={`h-display text-3xl sm:text-5xl ${s.eyebrow ? 'mt-4' : ''} ${dark ? '' : 'text-ink-900'} ${center ? 'mx-auto' : ''}`}>{s.title}</h2>}
      {s.subtitle && <p className={`mt-4 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{s.subtitle}</p>}
    </>
  )
}

export function Home() {
  usePageTitle()
  const c = useContent()
  const courses = useCourses()
  const { hero, sections: sec } = c
  const phones = c.contact.phones

  return (
    <>
      {/* HERO */}
      <section className="px-3 pt-3">
        <div className="container-x relative overflow-hidden rounded-[32px] bg-white">
          <div className="grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:py-14">
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-700">
                <Sparkles className="h-3.5 w-3.5" /> {hero.badge}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.6 }}
                className="h-display mt-6 text-[42px] leading-[1.02] text-ink-900 sm:text-6xl lg:text-[72px]"
              >
                {hero.titleBefore}{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-brand-600">{hero.titleHighlight}</span>
                  <svg className="absolute -bottom-1 left-0 z-0 w-full" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 10C60 3 140 3 197 10" stroke="#ffc83d" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                {hero.titleAfter}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.6 }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
              >
                {hero.subtitle}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-8 max-w-xl">
                <div className="mb-3 text-sm font-semibold text-ink-900">Bepul sinov darsiga yoziling:</div>
                <QuickLead />
              </motion.div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                {hero.chips.map((x) => (
                  <span key={x} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {x}</span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[520px]"
            >
              <div className="absolute -inset-4 -z-0 rounded-[40px] bg-gradient-to-br from-brand-500 to-brand-700 rotate-3" />
              <div className="relative overflow-hidden rounded-[32px] bg-ink-900">
                <img src={hero.image} alt="UITC akademiyasida o‘quvchilar dars jarayonida" width={900} height={1117} fetchPriority="high" className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="absolute top-8 -left-4 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:flex">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-accent"><BrainCircuit className="h-5 w-5 text-ink-900" /></span>
                <div className="text-sm font-bold text-ink-900">AI bilan<br /><span className="font-medium text-slate-500">integratsiya</span></div>
              </div>
              <div className="absolute bottom-10 -left-6 hidden rounded-2xl bg-white px-4 py-3 shadow-xl sm:block">
                <div className="text-xs font-semibold text-slate-500">Fullstack dasturchi</div>
                <div className="font-display text-2xl font-extrabold text-ink-900">6 oyda</div>
              </div>
              <div className="absolute -right-3 bottom-24 hidden items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xl sm:flex">
                <Award className="h-4 w-4 text-sun" /> Diplom bilan
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mt-3 overflow-hidden bg-ink-900 py-4" aria-hidden="true">
        <div className="flex w-max animate-[marquee_160s_linear_infinite] hover:[animation-play-state:paused] gap-10 font-display text-lg font-bold whitespace-nowrap text-white/90">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {c.marquee.map((t) => (
                <span key={t} className="inline-flex items-center gap-10">{t}<span className="text-brand-500">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="py-16">
        <div className="container-x grid grid-cols-2 gap-4 lg:grid-cols-4">
          {c.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-slate-200/70 sm:p-8">
                <div className="h-display text-4xl text-ink-900 sm:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm text-slate-500">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AUDIENCES */}
      <section id="kim-uchun" className="scroll-mt-24 pb-20">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <Heading s={sec.audiences} />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {c.audiences.map((a, i) => {
              const list = courses.filter((c) => c.audiences.includes(a.id))
              const tone = ['bg-sun/90 text-ink-900', 'bg-brand-600 text-white', 'bg-ink-900 text-white'][i]
              return (
                <Reveal key={a.id} delay={i * 0.08}>
                  <div className={`flex h-full flex-col rounded-3xl p-8 ${tone}`}>
                    <div className="text-sm font-bold opacity-80">{a.ages}</div>
                    <h3 className="h-display mt-2 text-3xl">{a.name}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed opacity-90">{a.pitch}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {list.map((c) => (
                        <Link key={c.slug} to={`/kurs/${c.slug}`} className="rounded-full bg-white/20 px-3.5 py-1.5 text-sm font-semibold backdrop-blur transition hover:bg-white/35">
                          {c.short}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="px-3">
        <div className="container-x rounded-[32px] bg-white py-16 lg:py-20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <Reveal>
              <Heading s={sec.courses} />
            </Reveal>
            <Link to="/kurslar" className="btn-ghost self-start lg:self-auto">Batafsil <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.06}><CourseCard course={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <Heading s={sec.why} />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.reasons.map((card, i) => {
              const r = { icon: reasonIcons[i % reasonIcons.length], t: card.title, d: card.text, big: i === 0 }
              return (
              <Reveal key={i} delay={i * 0.05} className={r.big ? 'lg:row-span-2' : ''}>
                <div className={`h-full rounded-3xl p-8 ${r.big ? 'relative overflow-hidden bg-ink-900 text-white' : 'bg-white ring-1 ring-slate-200/70'}`}>
                  {r.big && <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-brand-600/40 blur-3xl" />}
                  <span className={`relative grid h-12 w-12 place-items-center rounded-2xl ${r.big ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'}`}>
                    <r.icon className="h-6 w-6" />
                  </span>
                  <h3 className={`relative mt-6 font-display font-extrabold ${r.big ? 'text-3xl' : 'text-xl text-ink-900'}`}>{r.t}</h3>
                  <p className={`relative mt-2 leading-relaxed ${r.big ? 'text-lg text-slate-300' : 'text-sm text-slate-600'}`}>{r.d}</p>
                </div>
              </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="px-3">
        <div className="container-x relative overflow-hidden rounded-[32px] bg-ink-900 py-16 text-white lg:py-20">
          <div className="bg-grid-dark absolute inset-0 opacity-60" />
          <Reveal className="relative mx-auto max-w-2xl text-center">
            <Heading s={sec.steps} center dark />
          </Reveal>
          <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {c.steps.map((st, i) => {
              const s = { icon: stepIcons[i % stepIcons.length], t: st.title, d: st.text }
              return (
              <Reveal key={i} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600"><s.icon className="h-6 w-6" /></span>
                    <span className="font-display text-4xl font-extrabold text-white/10">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold">{s.t}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{s.d}</p>
                </div>
              </Reveal>
              )
            })}
          </div>
          <div className="relative mt-10 flex justify-center">
            <a href="#ariza" className="btn-primary px-8 py-4 text-base">Sinov darsiga yozilish <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      {/* STUDENT VIDEOS */}
      <section id="fikrlar" className="scroll-mt-24 py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <Heading s={sec.students} />
          </Reveal>
          <div className="mt-10"><VideoTestimonials items={c.studentVideos} /></div>
        </div>
      </section>

      {/* PARENT VIDEOS */}
      <section className="px-3">
        <div className="container-x rounded-[32px] bg-white py-16 lg:py-20">
          <Reveal className="max-w-3xl">
            <Heading s={sec.parents} icon={<HeartHandshake className="h-3.5 w-3.5" />} />
          </Reveal>
          <div className="mt-10"><VideoTestimonials items={c.parentVideos} /></div>
        </div>
      </section>

      {/* DIPLOMA */}
      <section className="py-20 lg:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Heading s={sec.diploma} />
            <ul className="mt-8 space-y-4">
              {c.diplomaPoints.map((x) => (
                <li key={x} className="flex items-center gap-3 font-medium text-ink-900"><CheckCircle2 className="h-5 w-5 text-brand-600" /> {x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mx-auto max-w-lg">
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-brand-600" />
              <div className="relative rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-slate-200">
                <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-[linear-gradient(135deg,#fff,#fff7f0)] px-8 py-10 text-center">
                  <div className="font-display text-sm font-extrabold tracking-[0.3em] text-brand-600 uppercase">UITC IT akademiyasi</div>
                  <div className="h-display mt-3 text-4xl text-ink-900">Diplom</div>
                  <div className="mx-auto mt-4 h-px w-24 bg-brand-200" />
                  <p className="mt-4 text-sm text-slate-500">ushbu diplom egasi</p>
                  <div className="mt-1 font-display text-2xl font-bold text-ink-900 italic">Ism Familiya</div>
                  <p className="mt-2 text-sm text-slate-500">«Fullstack dasturlash» kursini muvaffaqiyatli tamomladi</p>
                  <div className="mt-8 flex items-end justify-between text-left text-xs text-slate-400">
                    <div><div className="h-px w-20 bg-slate-300" />Direktor</div>
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-white shadow-lg"><Award className="h-8 w-8" /></span>
                    <div className="text-right"><div className="ml-auto h-px w-20 bg-slate-300" />Ustoz</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LOCATION */}
      <section id="manzil" className="scroll-mt-24 px-3 pb-20 lg:pb-28">
        <div className="container-x">
          <Reveal className="mb-10 max-w-2xl">
            <Heading s={sec.location} />
          </Reveal>
          <Reveal><Location /></Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="savollar" className="scroll-mt-24 px-3">
        <div className="container-x grid gap-12 rounded-[32px] bg-white py-16 lg:grid-cols-[1fr_1.4fr] lg:py-20">
          <Reveal>
            <Heading s={sec.faq} />
            <div className="mt-6 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              {phones.map((p) => <a key={p} href={telHref(p)} className="btn-ghost"><Phone className="h-4 w-4" /> {p}</a>)}
            </div>
          </Reveal>
          <Reveal delay={0.05}><Faq items={c.faq} /></Reveal>
        </div>
      </section>

      {/* LEAD */}
      <section id="ariza" className="scroll-mt-24 px-3 py-20 lg:py-28">
        <div className="container-x relative overflow-hidden rounded-[32px] bg-brand-600 p-6 sm:p-12 lg:p-16">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sun/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-ink-900/40 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div className="text-white">
              {sec.lead.eyebrow && <div className="mb-4 text-sm font-bold tracking-wide text-white/80 uppercase">{sec.lead.eyebrow}</div>}
              <h2 className="h-display text-4xl sm:text-6xl">{sec.lead.title}</h2>
              <p className="mt-5 max-w-md text-lg text-white/85">{sec.lead.subtitle}</p>
              <ul className="mt-8 space-y-3 font-medium">
                {c.leadPoints.map((x) => (
                  <li key={x} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-sun" /> {x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <LeadForm idPrefix="main" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
