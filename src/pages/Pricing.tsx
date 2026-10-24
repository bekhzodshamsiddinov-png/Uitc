import { Check, Minus } from 'lucide-react'
import { PricingCards } from '../components/PricingCards'
import { Faq, generalFaq } from '../components/Faq'
import { usePageTitle } from '../lib/usePageTitle'

const rows: [string, boolean, boolean, boolean][] = [
  ['Video darslar', true, true, true],
  ['Amaliy topshiriqlar', true, true, true],
  ['Sertifikat', true, true, true],
  ['Barcha kurslarga kirish', false, true, true],
  ['Shaxsiy mentor va kod review', false, true, true],
  ['Jonli sessiyalar', false, true, true],
  ['Karyera markazi', false, true, true],
  ['Korporativ hisobotlar', false, false, true],
]

export function Pricing() {
  usePageTitle('Narxlar')
  return (
    <div>
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="h-display text-4xl text-ink-900 sm:text-6xl">Oddiy va shaffof narxlar</h1>
            <p className="mt-4 text-lg text-slate-600">Yashirin to‘lovlar yo‘q. Bo‘lib to‘lash va 14 kunlik qaytarish kafolati.</p>
          </div>
          <div className="mt-16"><PricingCards /></div>
        </div>
      </section>
      <section className="py-16 lg:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="h-display text-center text-3xl">Tariflarni solishtirish</h2>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-slate-50 text-left">
                <tr><th className="p-4 font-semibold">Imkoniyat</th><th className="p-4 text-center font-semibold">Bitta kurs</th><th className="p-4 text-center font-semibold text-brand-700">Pro</th><th className="p-4 text-center font-semibold">Kompaniya</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(([l, ...v]) => (
                  <tr key={l}>
                    <td className="p-4 text-slate-700">{l}</td>
                    {v.map((x, i) => (
                      <td key={i} className="p-4 text-center">{x ? <Check className="mx-auto h-5 w-5 text-emerald-500" /> : <Minus className="mx-auto h-5 w-5 text-slate-300" />}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-16"><Faq items={generalFaq} /></div>
        </div>
      </section>
    </div>
  )
}
