import { usePageTitle } from '../lib/usePageTitle'

const docs = {
  privacy: {
    title: 'Maxfiylik siyosati',
    sections: [
      ['Qanday ma’lumot yig‘amiz', 'Ariza va ro‘yxatdan o‘tishda faqat ismingiz va telefon raqamingiz so‘raladi. To‘lov kartasi ma’lumotlari UITC serverlarida saqlanmaydi — ular bevosita to‘lov tizimi tomonidan qayta ishlanadi.'],
      ['Ma’lumotdan foydalanish', 'Ma’lumotlar faqat siz bilan bog‘lanish, o‘quv jarayonini tashkil etish va xizmat sifatini oshirish uchun ishlatiladi. Uchinchi shaxslarga sotilmaydi va berilmaydi.'],
      ['Himoya', 'Barcha ulanishlar HTTPS (TLS) orqali shifrlanadi. Serverga kirish cheklangan, so‘rovlar validatsiya va rate-limit bilan himoyalangan.'],
      ['Huquqlaringiz', 'Siz istalgan vaqtda ma’lumotlaringizni ko‘rish, tuzatish yoki o‘chirishni so‘rashingiz mumkin: info@uitc.uz.'],
    ],
  },
  offer: {
    title: 'Ommaviy oferta',
    sections: [
      ['Umumiy qoidalar', 'Ushbu hujjat UITC tomonidan taqdim etiladigan online ta’lim xizmatlaridan foydalanish shartlarini belgilaydi. To‘lovni amalga oshirish oferta shartlarini qabul qilishni anglatadi.'],
      ['Xizmat', 'Sotib olingan kursga kirish huquqi shaxsiy hisobingiz orqali taqdim etiladi. Hisobni boshqalarga berish taqiqlanadi.'],
      ['To‘lov va qaytarish', 'Kurs boshlanganidan keyin 14 kun ichida murojaat qilinsa, to‘lov to‘liq qaytariladi.'],
      ['Mualliflik huquqi', 'Kurs materiallarini ko‘chirish, tarqatish va qayta sotish taqiqlanadi.'],
    ],
  },
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
