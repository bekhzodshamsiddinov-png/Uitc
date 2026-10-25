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
  { q: 'Darslar qayerda va qanday o‘tadi?', a: 'Darslar akademiyamizda jonli (offline) formatda, kichik guruhlarda o‘tadi. Har bir o‘quvchi zamonaviy kompyuterda ishlaydi, ustoz esa yonida turib yordam beradi.' },
  { q: 'Qaysi yoshdan qabul qilasizlar?', a: '7 yoshdan 50 yoshgacha. Guruhlar yosh va darajaga qarab shakllantiriladi: bolalar, o‘smirlar va kattalar alohida o‘qiydi.' },
  { q: 'Kompyuterni umuman bilmasam ham bo‘ladimi?', a: 'Albatta. Foundation kursi aynan noldan boshlaydiganlar uchun. Bepul sinov darsida darajangizni aniqlab, mos guruhni tavsiya qilamiz.' },
  { q: 'Bepul sinov darsi qanday o‘tadi?', a: 'Ariza qoldirasiz, administratorimiz qo‘ng‘iroq qilib qulay vaqtni kelishadi. Sinov darsida ustoz bilan tanishasiz, muhitni ko‘rasiz va hech qanday majburiyatsiz qaror qilasiz.' },
  { q: 'Kurs narxi qancha?', a: 'Narx kurs va guruh formatiga bog‘liq. Aniq narx va chegirmalarni konsultatsiyada aytamiz — ariza qoldiring yoki qo‘ng‘iroq qiling.' },
  { q: 'Kurs oxirida nima beriladi?', a: 'Yakuniy loyihani himoya qilgan o‘quvchilarga UITC diplomi beriladi. Eng muhimi — real loyihalardan iborat portfolio va amaliy ko‘nikma.' },
  { q: 'Ota-onalar farzandining natijasini qanday biladi?', a: 'Har oy ustoz ota-onaga farzandining davomati, uy vazifalari va yutuqlari haqida hisobot beradi.' },
]
