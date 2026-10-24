import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Bitta kurs',
    price: '590 000',
    unit: 'so‘mdan',
    desc: 'Aniq bir kasbni egallamoqchi bo‘lganlar uchun.',
    features: ['Tanlangan kursga umrbod kirish', 'Amaliy topshiriqlar', 'Hamjamiyat chat', 'Sertifikat'],
    cta: 'Kursni tanlash',
    to: '/kurslar',
    highlight: false,
  },
  {
    name: 'Pro obuna',
    price: '349 000',
    unit: 'so‘m / oy',
    desc: 'Barcha kurslar va shaxsiy mentor — eng ommabop tanlov.',
    features: ['Barcha 9+ kursga to‘liq kirish', 'Shaxsiy mentor va kod review', 'Haftalik jonli sessiyalar', 'Karyera markazi va rezyume', 'Barcha sertifikatlar'],
    cta: '7 kun bepul sinab ko‘rish',
    to: '/royxatdan-otish?tarif=pro',
    highlight: true,
  },
  {
    name: 'Kompaniyalar uchun',
    price: 'Kelishuv',
    unit: 'asosida',
    desc: 'Xodimlarni o‘qitish va malakasini oshirish.',
    features: ['Korporativ kabinet va hisobotlar', 'Maxsus o‘quv dasturi', 'Shaxsiy menejer', 'Hisob-faktura orqali to‘lov'],
    cta: 'Bog‘lanish',
    to: '/#ariza',
    highlight: false,
  },
]

export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.name}
          className={`relative flex flex-col rounded-3xl p-8 ${
            p.highlight ? 'bg-ink-900 text-white shadow-[0_32px_64px_-24px_rgba(30,27,75,0.6)] lg:-my-4 lg:py-12' : 'card'
          }`}
        >
          {p.highlight && <span className="chip absolute -top-3 left-8 bg-lime-accent text-ink-900">Eng ommabop</span>}
          <h3 className="font-display text-lg font-bold">{p.name}</h3>
          <p className={`mt-1 text-sm ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{p.desc}</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="h-display text-4xl">{p.price}</span>
            <span className={`text-sm ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{p.unit}</span>
          </div>
          <ul className="mt-8 flex-1 space-y-3 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.highlight ? 'bg-lime-accent text-ink-900' : 'bg-brand-50 text-brand-600'}`}>
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link to={p.to} className={`mt-8 w-full ${p.highlight ? 'btn-lime' : 'btn-ghost'}`}>{p.cta}</Link>
        </div>
      ))}
    </div>
  )
}
