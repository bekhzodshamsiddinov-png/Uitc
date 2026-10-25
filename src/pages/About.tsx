import { Link } from 'react-router-dom'
import { BrainCircuit, Heart, Presentation, Target } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { usePageTitle } from '../lib/usePageTitle'

export function About() {
  usePageTitle('Biz haqimizda')
  return (
    <div className="pb-16">
      <section className="px-3 pt-3">
        <div className="container-x grid items-center gap-10 rounded-[32px] bg-white py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="eyebrow">Biz haqimizda</div>
            <h1 className="h-display mt-6 text-4xl text-ink-900 sm:text-6xl">6 yildan beri IT kasblariga yo‘l ochamiz</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              UITC — 7 yoshdan 50 yoshgacha bo‘lgan har bir kishiga zamonaviy IT ko‘nikmalarini jonli darslarda o‘rgatadigan akademiya.
              Kompyuter bilan birinchi tanishuvdan Fullstack dasturchi bo‘lishgacha — barcha bosqichda yoningizdamiz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/kurslar" className="btn-primary">Kurslarni ko‘rish</Link>
              <Link to="/#ariza" className="btn-ghost">Sinov darsiga yozilish</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px]">
            <img src="/images/hero.webp" alt="UITC akademiyasida dars jarayoni" width={900} height={1117} className="aspect-[4/3] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Target, t: 'Natija', d: 'Maqsadimiz — sertifikat emas, real ko‘nikma va loyiha.' },
            { i: Presentation, t: 'Jonli ta’lim', d: 'Ustoz bilan yuzma-yuz: savol, amaliyot va darhol fikr-mulohaza.' },
            { i: BrainCircuit, t: 'Zamonaviylik', d: 'Barcha dasturlarda sun’iy intellekt vositalari bilan ishlash.' },
            { i: Heart, t: 'G‘amxo‘rlik', d: 'Har bir o‘quvchining rivoji va motivatsiyasi biz uchun muhim.' },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/70">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><v.i className="h-6 w-6" /></span>
                <h3 className="mt-5 font-display text-xl font-extrabold text-ink-900">{v.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
