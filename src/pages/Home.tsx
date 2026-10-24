import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Code2,
  GraduationCap,
  MessageCircle,
  MonitorPlay,
  Play,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react'
import { categories, courses, type CategoryId } from '../data/courses'
import { CourseCard } from '../components/CourseCard'
import { Reveal } from '../components/Reveal'
import { LeadForm } from '../components/LeadForm'
import { Faq, generalFaq } from '../components/Faq'
import { PricingCards } from '../components/PricingCards'
import { usePageTitle } from '../lib/usePageTitle'

const avatars = ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500']

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-brand-200/60 via-fuchsia-100/60 to-lime-100/60 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_40px_80px_-32px_rgba(30,27,75,0.45)]"
      >
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 truncate rounded-md bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-500">uitc.uz/kabinet/frontend-react/4-dars</span>
        </div>
        <div className="grid grid-cols-5">
          <div className="col-span-5 sm:col-span-3">
            <div className="relative aspect-video bg-ink-900">
              <div className="bg-grid-dark absolute inset-0" />
              <div className="absolute inset-0 p-4 font-mono text-[11px] leading-5 text-slate-400">
                <div><span className="text-fuchsia-400">function</span> <span className="text-sky-300">CourseCard</span>({'{'} course {'}'}) {'{'}</div>
                <div className="pl-4"><span className="text-fuchsia-400">return</span> (</div>
                <div className="pl-8 text-emerald-300">{'<Card title={course.title} />'}</div>
                <div className="pl-4">)</div>
                <div>{'}'}</div>
              </div>
              <button type="button" aria-label="Videoni ko‘rish" className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-xl transition hover:scale-105">
                <Play className="ml-0.5 h-6 w-6 fill-brand-600 text-brand-600" />
              </button>
              <div className="absolute right-0 bottom-0 left-0 h-1 bg-white/10"><div className="h-full w-2/3 bg-lime-accent" /></div>
            </div>
            <div className="p-4">
              <div className="text-xs font-semibold text-brand-600">4-modul · React Hooks</div>
              <div className="mt-1 font-display font-bold text-slate-900">useEffect va hayot sikli</div>
            </div>
          </div>
          <div className="col-span-2 hidden border-l border-slate-100 p-3 sm:block">
            <div className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Darslar</div>
            {['Komponentlar', 'State va props', 'useEffect', 'Custom hooks', 'Router'].map((l, i) => (
              <div key={l} className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] ${i === 2 ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600'}`}>
                {i < 2 ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <span className={`h-3.5 w-3.5 rounded-full border-2 ${i === 2 ? 'border-brand-500' : 'border-slate-300'}`} />}
                {l}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute -bottom-20 -left-6 hidden w-60 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl sm:block"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white">AK</span>
          <div>
            <div className="text-xs font-bold text-slate-900">Mentor Aziz</div>
            <div className="text-[11px] text-emerald-600">● onlayn</div>
          </div>
        </div>
        <p className="mt-2.5 rounded-xl rounded-tl-sm bg-slate-100 p-2.5 text-[12px] leading-snug text-slate-700">
          Zo‘r! Kodingiz to‘g‘ri ishlayapti. Endi dependency array’ni qo‘shing 👍
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute -top-5 -right-3 hidden items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xl sm:flex"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-accent"><Award className="h-5 w-5 text-ink-900" /></span>
        <div>
          <div className="text-xs font-bold text-slate-900">Sertifikat tayyor</div>
          <div className="text-[11px] text-slate-500">QR-kod bilan tasdiqlangan</div>
        </div>
      </motion.div>
    </div>
  )
}

const stats = [
  { v: '6 yil', l: 'IT ta’limdagi tajriba' },
  { v: '10 000+', l: 'bitiruvchilar' },
  { v: '87%', l: 'bitiruvchilar ishga joylashgan' },
  { v: '4.9', l: 'o‘rtacha kurs reytingi' },
]

const steps = [
  { icon: BookOpenCheck, t: 'Yo‘nalish tanlang', d: 'Bepul test va konsultatsiya orqali o‘zingizga mos kasbni toping.' },
  { icon: MonitorPlay, t: 'Video darslar', d: 'Qisqa, tushunarli darslar. Istalgan vaqtda, istalgan qurilmada.' },
  { icon: Code2, t: 'Amaliyot va loyihalar', d: 'Har moduldan keyin topshiriq, mentor kodingizni tekshiradi.' },
  { icon: Briefcase, t: 'Sertifikat va ish', d: 'Portfolio, rezyume va suhbatga tayyorlov — karyera markazi bilan.' },
]

const testimonials = [
  { n: 'Shoxruh A.', r: 'Frontend dasturchi', t: 'Offline o‘qishga vaqtim yo‘q edi. Online kursda ishdan keyin o‘qib, 6 oyda birinchi ishimni topdim. Mentorlar har doim javob berishdi.', c: 'bg-indigo-500' },
  { n: 'Malika R.', r: 'UI/UX dizayner', t: 'Platforma juda qulay — telefonda ham o‘qisa bo‘ladi. Portfolio loyihalari tufayli frilansda buyurtmalar ola boshladim.', c: 'bg-rose-500' },
  { n: 'Otabek N.', r: 'Python backend', t: 'Eng yoqqani — real loyihalar. Kurs oxirida Telegram bot va to‘lov tizimi bilan to‘liq backend yozdim.', c: 'bg-emerald-500' },
]

export function Home() {
  usePageTitle()
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const list = (cat === 'all' ? courses : courses.filter((c) => c.category === cat)).slice(0, 6)

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-grid mask-fade absolute inset-0 -z-10" />
        <div className="container-x grid items-center gap-16 pt-10 pb-20 lg:grid-cols-2 lg:pt-16 lg:pb-28">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> 6 yillik tajriba — endi online
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              className="h-display mt-6 text-[40px] leading-[1.05] text-ink-900 sm:text-6xl lg:text-[68px]"
            >
              IT kasbini egallang.{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-brand-600 to-fuchsia-600 bg-clip-text text-transparent">Online.</span>
                <svg className="absolute -bottom-2 left-0 z-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 9C50 3 150 3 198 9" stroke="#b6f23a" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
            >
              Video darslar, real loyihalar va shaxsiy mentor bilan noldan ishga tayyor mutaxassisgacha.
              O‘zingizga qulay vaqtda — telefon yoki kompyuterdan.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/kurslar" className="btn-primary px-7 py-4 text-base">
                Kursni tanlash <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#ariza" className="btn-ghost px-7 py-4 text-base">
                <Play className="h-4 w-4" /> Bepul dars ko‘rish
              </a>
            </motion.div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {avatars.map((a, i) => (
                  <span key={a} className={`grid h-10 w-10 place-items-center rounded-full border-2 border-white text-xs font-bold text-white ${a}`}>
                    {['SA', 'MR', 'ON', 'DK'][i]}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  <span className="ml-1.5 text-sm font-bold text-slate-900">4.9</span>
                </div>
                <div className="text-sm text-slate-500">10 000+ bitiruvchi bizga ishonadi</div>
              </div>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-slate-50/60">
        <div className="container-x grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06} className="text-center lg:border-r lg:border-slate-200 lg:last:border-0">
              <div className="h-display text-4xl text-ink-900 sm:text-5xl">{s.v}</div>
              <div className="mt-1 text-sm text-slate-500">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <Reveal>
              <div className="eyebrow">Kurslar</div>
              <h2 className="h-display mt-4 text-3xl text-ink-900 sm:text-5xl">Eng talabgir IT kasblari</h2>
              <p className="mt-3 max-w-xl text-slate-600">Har bir kurs bozor talabi asosida, amaldagi mutaxassislar tomonidan tuzilgan.</p>
            </Reveal>
            <Link to="/kurslar" className="btn-ghost self-start lg:self-auto">Barcha kurslar <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="no-scrollbar mt-10 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Yo‘nalishlar">
            {[{ id: 'all' as const, name: 'Hammasi' }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  cat === c.id ? 'bg-ink-900 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((c) => (
                <motion.div key={c.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
                  <CourseCard course={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="qanday" className="scroll-mt-20 bg-ink-900 py-20 text-white lg:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="eyebrow border-white/10 bg-white/5 text-lime-accent">Qanday o‘qiymiz</div>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl">Noldan ishgacha — 4 qadam</h2>
            <p className="mt-4 text-slate-400">6 yillik offline tajribamizni online formatga ko‘chirdik: tizimli, amaliy va natijaga yo‘naltirilgan.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-400/50 hover:bg-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600/20 text-brand-300 transition group-hover:bg-lime-accent group-hover:text-ink-900">
                      <s.icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-5xl font-extrabold text-white/5">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES — bento */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <div className="eyebrow">Platforma</div>
            <h2 className="h-display mt-4 text-3xl text-ink-900 sm:text-5xl">O‘qish uchun hamma narsa — bitta joyda</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
            <Reveal className="lg:col-span-2 lg:row-span-1">
              <div className="card relative h-full overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
                <div className="bg-grid-dark absolute inset-0 opacity-40" />
                <div className="relative max-w-md">
                  <MessageCircle className="h-8 w-8 text-lime-accent" />
                  <h3 className="mt-5 font-display text-2xl font-bold">Shaxsiy mentor — 24 soat ichida javob</h3>
                  <p className="mt-3 text-brand-100">Kodingizni tekshiradi, xatolarni tushuntiradi va haftalik jonli sessiyalarda savollarga javob beradi.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card h-full bg-lime-accent/90 p-8">
                <Smartphone className="h-8 w-8 text-ink-900" />
                <h3 className="mt-5 font-display text-xl font-bold text-ink-900">Istalgan qurilmada</h3>
                <p className="mt-2 text-sm text-ink-800/80">Telefon, planshet, kompyuter. Progress avtomatik saqlanadi.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card h-full p-8">
                <Zap className="h-8 w-8 text-amber-500" />
                <h3 className="mt-5 font-display text-xl font-bold">Interaktiv topshiriqlar</h3>
                <p className="mt-2 text-sm text-slate-600">Brauzerda kod yozing, avtomatik testlar natijani darhol ko‘rsatadi.</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card h-full p-8">
                <Users className="h-8 w-8 text-emerald-500" />
                <h3 className="mt-5 font-display text-xl font-bold">Hamjamiyat</h3>
                <p className="mt-2 text-sm text-slate-600">Yopiq Telegram guruh, hakatonlar va bitiruvchilar tarmog‘i.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="card h-full p-8">
                <BadgeCheck className="h-8 w-8 text-brand-600" />
                <h3 className="mt-5 font-display text-xl font-bold">Tasdiqlangan sertifikat</h3>
                <p className="mt-2 text-sm text-slate-600">QR-kod orqali ish beruvchi haqiqiyligini bir zumda tekshiradi.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Narxlar</div>
            <h2 className="h-display mt-4 text-3xl text-ink-900 sm:text-5xl">O‘zingizga qulay formatni tanlang</h2>
            <p className="mt-4 text-slate-600">Bo‘lib to‘lash imkoniyati va 14 kunlik pulni qaytarish kafolati bilan.</p>
          </Reveal>
          <div className="mt-14"><PricingCards /></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <div className="eyebrow">Bitiruvchilar</div>
            <h2 className="h-display mt-4 text-3xl text-ink-900 sm:text-5xl">Ular allaqachon IT’da ishlashmoqda</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.n} delay={i * 0.08}>
                <figure className="card flex h-full flex-col p-7">
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">“{t.t}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <span className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white ${t.c}`}>{t.n.slice(0, 1)}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{t.n}</div>
                      <div className="text-xs text-slate-500">{t.r}</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="eyebrow">Savollar</div>
            <h2 className="h-display mt-4 text-3xl text-ink-900 sm:text-5xl">Ko‘p beriladigan savollar</h2>
            <p className="mt-4 text-slate-600">Javob topmadingizmi? Bizga yozing — 15 daqiqada javob beramiz.</p>
            <a href="#ariza" className="btn-dark mt-6">Savol berish</a>
          </Reveal>
          <Reveal delay={0.05}><Faq items={generalFaq} /></Reveal>
        </div>
      </section>

      {/* LEAD CTA */}
      <section id="ariza" className="scroll-mt-20 py-20 lg:py-28">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[32px] bg-ink-900 p-8 sm:p-12 lg:p-16">
            <div className="bg-grid-dark absolute inset-0" />
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />
            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div className="text-white">
                <GraduationCap className="h-10 w-10 text-lime-accent" />
                <h2 className="h-display mt-6 text-3xl sm:text-5xl">Qaysi kurs sizga mos — bepul aniqlaymiz</h2>
                <p className="mt-4 max-w-md text-slate-400">Arizani qoldiring: menejer sizga qo‘ng‘iroq qiladi, maqsadingizni tinglaydi va birinchi darsni bepul ochib beradi.</p>
                <ul className="mt-8 space-y-3 text-sm text-slate-300">
                  {['Bepul kasbga yo‘naltirish testi', 'Birinchi modul — bepul', 'Bo‘lib to‘lash imkoniyati'].map((x) => (
                    <li key={x} className="flex items-center gap-2.5"><CheckCircle2 className="h-5 w-5 text-lime-accent" /> {x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
                <LeadForm dark />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
