import { useRef, useState } from 'react'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { courses } from '../data/courses'
import { sendLead } from '../lib/lead'
import { formatPhoneInput, validateLead, type LeadErrors } from '../../api/_lib/validate'

type Status = 'idle' | 'sending' | 'done' | 'error'

export function LeadForm({ defaultCourse = '', dark = false }: { defaultCourse?: string; dark?: boolean }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [course, setCourse] = useState(defaultCourse)
  const [website, setWebsite] = useState('') // honeypot
  const [errors, setErrors] = useState<LeadErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverMsg, setServerMsg] = useState('')
  const startedAt = useRef(Date.now())

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, errors } = validateLead({ name, phone, course: course || 'general' })
    setErrors(errors)
    if (Object.keys(errors).length) return
    setStatus('sending')
    setServerMsg('')
    const res = await sendLead(data, { website, t: startedAt.current })
    if (res === 'ok') return setStatus('done')
    setStatus('error')
    setServerMsg(
      res === 'rate_limited'
        ? 'Juda ko‘p urinish. Iltimos, birozdan so‘ng qayta urinib ko‘ring.'
        : 'Yuborishda xatolik. Internetni tekshirib, qayta urinib ko‘ring yoki bizga qo‘ng‘iroq qiling.',
    )
  }

  const label = dark ? 'text-slate-300' : 'text-slate-700'
  const err = 'mt-1.5 text-xs font-medium text-rose-500'

  if (status === 'done') {
    return (
      <div className={`flex flex-col items-center rounded-2xl p-8 text-center ${dark ? 'bg-white/5' : 'bg-emerald-50'}`} role="status">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className={`mt-4 font-display text-xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Arizangiz qabul qilindi!</h3>
        <p className={`mt-2 text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          Menejerimiz 15 daqiqa ichida siz bilan bog‘lanadi va mos kursni tanlashga yordam beradi.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="lead-name" className={`mb-1.5 block text-sm font-medium ${label}`}>Ismingiz</label>
        <input
          id="lead-name"
          className="input"
          autoComplete="name"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masalan, Jasur"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'lead-name-err' : undefined}
        />
        {errors.name && <p id="lead-name-err" className={err}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="lead-phone" className={`mb-1.5 block text-sm font-medium ${label}`}>Telefon raqam</label>
        <input
          id="lead-phone"
          className="input"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'lead-phone-err' : undefined}
        />
        {errors.phone && <p id="lead-phone-err" className={err}>{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="lead-course" className={`mb-1.5 block text-sm font-medium ${label}`}>Qiziqtirgan yo‘nalish</label>
        <select id="lead-course" className="input appearance-none" value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">Hali aniq emas — maslahat kerak</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>{c.title}</option>
          ))}
        </select>
      </div>
      {/* Honeypot: hidden from people, visible to naive bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-3.5 text-base">
        {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Yuborilmoqda…</> : 'Bepul konsultatsiya olish'}
      </button>
      {serverMsg && <p className="text-center text-sm font-medium text-rose-500" role="alert">{serverMsg}</p>}
      <p className={`flex items-center justify-center gap-1.5 text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
        <ShieldCheck className="h-3.5 w-3.5" /> Ma’lumotlaringiz himoyalangan va uchinchi shaxslarga berilmaydi
      </p>
    </form>
  )
}
