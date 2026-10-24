import { Link } from 'react-router-dom'
import { Heart, Lightbulb, Target, Users } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { usePageTitle } from '../lib/usePageTitle'

const timeline = [
  ['2020', 'Birinchi offline guruh ochildi'],
  ['2021', 'Frontend va Backend yo‘nalishlari kengaydi'],
  ['2023', 'Mobil, dizayn va data kurslari qo‘shildi'],
  ['2025', 'Bitiruvchilar soni 10 000 dan oshdi'],
  ['2026', 'UITC online platformasi ishga tushdi'],
]

export function About() {
  usePageTitle('Biz haqimizda')
  return (
    <div>
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="bg-grid mask-fade absolute inset-0 -z-10" />
        <div className="container-x max-w-4xl text-center">
          <div className="eyebrow">Biz haqimizda</div>
          <h1 className="h-display mt-6 text-4xl text-ink-900 sm:text-6xl">6 yildan beri odamlarni IT’ga olib kiramiz</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Offline auditoriyalarda yig‘ilgan tajribamizni endi butun O‘zbekiston va undan tashqaridagi o‘quvchilar uchun online formatga olib chiqdik.
          </p>
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Target, t: 'Natija', d: 'Bizning maqsad — sertifikat emas, sizning birinchi ishingiz.' },
            { i: Lightbulb, t: 'Amaliyot', d: 'Darslarning 70% — real loyihalar va topshiriqlar.' },
            { i: Users, t: 'Mentorlik', d: 'Har bir o‘quvchi yonida tajribali mutaxassis.' },
            { i: Heart, t: 'G‘amxo‘rlik', d: 'Qiyin paytda ham motivatsiyani yo‘qotmaslikka yordam beramiz.' },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="card h-full p-7">
                <v.i className="h-8 w-8 text-brand-600" />
                <h3 className="mt-5 font-display text-xl font-bold">{v.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="h-display text-3xl">Bizning yo‘limiz</h2>
          <ol className="mt-10 space-y-0 border-l-2 border-brand-100">
            {timeline.map(([y, t]) => (
              <li key={y} className="relative pb-10 pl-8 last:pb-0">
                <span className="absolute top-1 -left-[9px] h-4 w-4 rounded-full border-4 border-white bg-brand-600 ring-2 ring-brand-100" />
                <div className="font-display text-sm font-bold text-brand-700">{y}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{t}</div>
              </li>
            ))}
          </ol>
          <div className="mt-14 flex flex-wrap gap-3">
            <Link to="/kurslar" className="btn-primary">Kurslarni ko‘rish</Link>
            <Link to="/#ariza" className="btn-ghost">Biz bilan bog‘lanish</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
