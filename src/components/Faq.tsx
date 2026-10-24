import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-display text-base font-bold text-slate-900">{it.q}</span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${isOpen ? 'rotate-45 border-brand-600 bg-brand-600 text-white' : 'border-slate-200 text-slate-500'}`}>
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-[15px] leading-relaxed text-slate-600">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export const generalFaq = [
  { q: 'Dasturlashni umuman bilmasam ham o‘qiy olamanmi?', a: 'Ha. Boshlang‘ich darajadagi kurslarimiz noldan boshlanadi. Har bir mavzu oddiy tilda tushuntiriladi, mentor esa savollaringizga 24 soat ichida javob beradi.' },
  { q: 'Darslar qanday formatda o‘tadi?', a: 'Darslar oldindan yozilgan yuqori sifatli video, amaliy topshiriqlar va haftalik jonli (live) mentor sessiyalaridan iborat. Siz o‘zingizga qulay vaqtda, telefon yoki kompyuterdan o‘qiysiz.' },
  { q: 'Kursga qancha muddat kirish huquqi beriladi?', a: 'Sotib olingan kursga umrbod kirish huquqi beriladi — barcha kelajakdagi yangilanishlar bilan birga.' },
  { q: 'Bo‘lib to‘lash mumkinmi?', a: 'Ha. Kurs narxini oylik to‘lovlarga bo‘lib to‘lashingiz mumkin. Payme, Click, Uzum va bank kartalari qabul qilinadi.' },
  { q: 'Pulni qaytarib olsa bo‘ladimi?', a: 'Kurs boshlangandan keyin 14 kun ichida kurs sizga mos kelmasa, to‘lovni to‘liq qaytaramiz — hech qanday savolsiz.' },
  { q: 'Sertifikat beriladimi?', a: 'Kursni va yakuniy loyihani muvaffaqiyatli tugatganingizdan so‘ng QR-kod bilan tekshiriladigan elektron sertifikat beriladi.' },
]
