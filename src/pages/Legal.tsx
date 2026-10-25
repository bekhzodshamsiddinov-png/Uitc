import { usePageTitle } from '../lib/usePageTitle'

const docs = {
  privacy: {
    title: 'Maxfiylik siyosati',
    sections: [
      ['Qanday ma’lumot yig‘amiz', 'Ariza qoldirishda faqat ismingiz, telefon raqamingiz va qiziqtirgan kursingiz so‘raladi.'],
      ['Ma’lumotdan foydalanish', 'Ma’lumotlar faqat siz bilan bog‘lanish va o‘quv jarayonini tashkil etish uchun ishlatiladi. Uchinchi shaxslarga sotilmaydi va berilmaydi.'],
      ['Himoya', 'Barcha ulanishlar HTTPS (TLS) orqali shifrlanadi. Serverga kirish cheklangan, so‘rovlar validatsiya va rate-limit bilan himoyalangan.'],
      ['Huquqlaringiz', 'Siz istalgan vaqtda ma’lumotlaringizni o‘chirishni so‘rashingiz mumkin — biz bilan telefon orqali bog‘laning.'],
    ],
  }
}

export function Legal({ doc }: { doc: keyof typeof docs }) {
  const d = docs[doc]
  usePageTitle(d.title)
  return (
    <div className="container-x max-w-3xl py-16 lg:py-24">
      <h1 className="h-display text-4xl text-ink-900">{d.title}</h1>
      <p className="mt-3 text-sm text-slate-500">Loyiha matni — yuridik tekshiruvdan o‘tkazilishi kerak.</p>
      <div className="mt-10 space-y-8">
        {d.sections.map(([h, p]) => (
          <section key={h}>
            <h2 className="font-display text-xl font-bold">{h}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{p}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
