import { useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { telHref, useContent, useCourses } from '../content/ContentContext'
import { sendLead } from '../lib/lead'
import { formatPhoneInput, validateLead, type LeadErrors } from '../../api/_lib/validate'

type Status = 'idle' | 'sending' | 'done' | 'error'
const whoOptions = [
  { id: 'child', label: 'Farzandim uchun' },
  { id: 'self', label: 'O‘zim uchun' },
] as const

export function LeadForm({ defaultCourse = '', dark = false, idPrefix = 'lead' }: { defaultCourse?: string; dark?: boolean; idPrefix?: string }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [who, setWho] = useState<(typeof whoOptions)[number]['id']>('child')
  const [course, setCourse] = useState(defaultCourse)
  const [website, setWebsite] = useState('') // honeypot
  const [errors, setErrors] = useState<LeadErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const startedAt = useRef(Date.now())
  const courses = useCourses()
  const phones = useContent().contact.phones

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const { data, errors } = validateLead({ name, phone, course: course || 'general', message: `kim-uchun:${who}` })
    setErrors(errors)
    if (Object.keys(errors).length) return
    setStatus('sending')
    setServerMsg('')
    const res = await sendLead(data, { website, t: startedAt.current })
    if (res === 'ok') return setStatus('done')
    setStatus('error')
    setServerMsg(
      res === 'rate_limited'
        ? 'Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring yoki bizga qo‘ng‘iroq qiling.'
        : 'Yuborishda xatolik. Internetni tekshiring yoki bizga qo‘ng‘iroq qiling.',
    )
  }

  const label = `mb-1.5 block text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`
  const err = 'mt-1.5 text-xs font-medium text-rose-500'
  const id = (s: string) => `${idPrefix}-${s}`

  if (status === 'done') {
    return (
      <div className={`flex flex-col items-center rounded-2xl p-8 text-center ${dark ? 'bg-white/5' : 'bg-emerald-50'}`} role="status">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className={`mt-4 font-display text-xl font-bold ${dark ? 'text-white' : 'text-ink-900'}`}>Arizangiz qabul qilindi!</h3>
        <p className={`mt-2 text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          Administratorimiz tez orada qo‘ng‘iroq qilib, bepul sinov darsi vaqtini kelishib oladi.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className={`grid grid-cols-2 gap-1 rounded-xl p-1 ${dark ? 'bg-white/10' : 'bg-surface'}`} role="radiogroup" aria-label="Kim uchun">
        {whoOptions.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={who === o.id}
            onClick={() => setWho(o.id)}
            className={`rounded-lg py-2.5 text-sm font-semibold transition ${
              who === o.id ? 'bg-white text-ink-900 shadow-sm' : dark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div>
        <label htmlFor={id('name')} className={label}>{who === 'child' ? 'Ota-ona ismi' : 'Ismingiz'}</label>
        <input id={id('name')} className="input" autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingizni kiriting" aria-invalid={!!errors.name} />
        {errors.name && <p className={err}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={id('phone')} className={label}>Telefon raqam</label>
        <input id={id('phone')} className="input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} aria-invalid={!!errors.phone} />
        {errors.phone && <p className={err}>{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor={id('course')} className={label}>Qiziqtirgan kurs</label>
        <select id={id('course')} className="input" value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">Bilmayman — maslahat kerak</option>
          {courses.map((c) => <option key={c.slug} value={c.slug}>{c.short} · {c.duration}</option>)}
        </select>
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-4 text-base">
        {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Yuborilmoqda…</> : 'Bepul sinov darsiga yozilish'}
      </button>
      {serverMsg && (
        <p className="text-center text-sm font-medium text-rose-500" role="alert">
          {serverMsg} <a className="underline" href={telHref(phones[0])}>{phones[0]}</a>
        </p>
      )}
      <p className={`flex items-center justify-center gap-1.5 text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
        <ShieldCheck className="h-3.5 w-3.5" /> Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi
      </p>
    </form>
  )
}
