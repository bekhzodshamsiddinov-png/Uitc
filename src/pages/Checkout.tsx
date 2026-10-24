import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Lock, ShieldCheck, Tag } from 'lucide-react'
import { formatPrice, getCourse, monthly } from '../data/courses'
import { CourseCover } from '../components/CourseCard'
import { NotFound } from './NotFound'
import { usePageTitle } from '../lib/usePageTitle'
import { sendLead } from '../lib/lead'
import { formatPhoneInput, validateLead, type LeadErrors } from '../../api/_lib/validate'

const methods = [
  { id: 'payme', name: 'Payme', color: 'bg-cyan-500' },
  { id: 'click', name: 'Click', color: 'bg-sky-600' },
  { id: 'uzum', name: 'Uzum Bank', color: 'bg-violet-600' },
  { id: 'card', name: 'Uzcard / Humo / Visa', color: 'bg-slate-800' },
] as const

export function Checkout() {
  const { slug = '' } = useParams()
  const course = getCourse(slug)
  usePageTitle('To‘lov')
  const [plan, setPlan] = useState<'full' | 'monthly'>('full')
  const [method, setMethod] = useState<(typeof methods)[number]['id']>('payme')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [agree, setAgree] = useState(false)
  const [promo, setPromo] = useState('')
  const [promoMsg, setPromoMsg] = useState('')
  const [errors, setErrors] = useState<LeadErrors & { agree?: string }>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const startedAt = useRef(Date.now())

  if (!course) return <NotFound />

  const total = plan === 'full' ? course.price : monthly(course)
  const saving = course.oldPrice ? course.oldPrice - course.price : 0

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, errors } = validateLead({ name, phone, course: course.slug, message: `checkout:${plan}:${method}` })
    const all = { ...errors, ...(agree ? {} : { agree: 'Shartlarga rozilik bering.' }) }
    setErrors(all)
    if (Object.keys(all).length) return
    setStatus('sending')
    const res = await sendLead(data, { website: '', t: startedAt.current })
    setStatus(res === 'ok' ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className="container-x grid min-h-[60vh] place-items-center py-20">
        <div className="max-w-md text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="h-display mt-6 text-3xl">Buyurtma qabul qilindi</h1>
          <p className="mt-3 text-slate-600">
            «{course.title}» kursi uchun buyurtmangiz qabul qilindi. Menejerimiz to‘lovni yakunlash uchun tez orada siz bilan bog‘lanadi.
          </p>
          <Link to="/kurslar" className="btn-primary mt-8">Kurslarga qaytish</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 pb-24">
      <div className="container-x py-8">
        <Link to={`/kurs/${course.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Kursga qaytish
        </Link>
        <h1 className="h-display mt-4 text-3xl text-ink-900 sm:text-4xl">Buyurtmani rasmiylashtirish</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><Lock className="h-4 w-4" /> Xavfsiz shifrlangan ulanish (HTTPS)</p>
      </div>

      <form onSubmit={submit} noValidate className="container-x grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold">1. To‘lov rejasi</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {([
                { id: 'full', t: 'To‘liq to‘lov', p: formatPrice(course.price), d: saving ? `${formatPrice(saving)} tejaysiz` : 'Bir martalik to‘lov' },
                { id: 'monthly', t: 'Bo‘lib to‘lash', p: `${formatPrice(monthly(course))} / oy`, d: `${course.months} oy davomida, 0% ustama` },
              ] as const).map((o) => (
                <label key={o.id} className={`cursor-pointer rounded-xl border-2 p-4 transition ${plan === o.id ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="plan" value={o.id} checked={plan === o.id} onChange={() => setPlan(o.id)} className="sr-only" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{o.t}</span>
                    <span className={`h-5 w-5 rounded-full border-2 ${plan === o.id ? 'border-[6px] border-brand-600' : 'border-slate-300'}`} />
                  </div>
                  <div className="mt-2 font-display text-lg font-extrabold">{o.p}</div>
                  <div className="text-xs text-slate-500">{o.d}</div>
                </label>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-bold">2. Ma’lumotlaringiz</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium text-slate-700">Ism familiya</label>
                <input id="co-name" className="input" autoComplete="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
                {errors.name && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Telefon</label>
                <input id="co-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-lg font-bold">3. To‘lov usuli</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {methods.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${method === m.id ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                  <span className={`grid h-10 w-10 place-items-center rounded-lg text-white ${m.color}`}><CreditCard className="h-5 w-5" /></span>
                  <span className="flex-1 font-semibold">{m.name}</span>
                  <span className={`h-5 w-5 rounded-full border-2 ${method === m.id ? 'border-[6px] border-brand-600' : 'border-slate-300'}`} />
                </label>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              Karta ma’lumotlari UITC serverlarida saqlanmaydi — to‘lov to‘g‘ridan-to‘g‘ri to‘lov tizimining himoyalangan sahifasida amalga oshiriladi.
            </p>
          </section>
        </div>

        <aside>
          <div className="card overflow-hidden lg:sticky lg:top-24">
            <CourseCover course={course} className="aspect-[2/1]" />
            <div className="p-6">
              <h3 className="font-display font-bold leading-snug">{course.title}</h3>
              <div className="mt-1 text-sm text-slate-500">{course.months} oy · {course.lessons} dars · Umrbod kirish</div>
              <div className="mt-5 flex gap-2">
                <label className="relative flex-1">
                  <span className="sr-only">Promokod</span>
                  <Tag className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="input py-2.5 pl-9 text-sm uppercase" placeholder="Promokod" maxLength={20} value={promo} onChange={(e) => { setPromo(e.target.value.replace(/[^a-z0-9]/gi, '')); setPromoMsg('') }} />
                </label>
                <button type="button" className="btn-ghost py-2.5" onClick={() => setPromoMsg(promo ? 'Promokod topilmadi yoki muddati tugagan.' : 'Promokodni kiriting.')}>Qo‘llash</button>
              </div>
              {promoMsg && <p className="mt-2 text-xs font-medium text-rose-500">{promoMsg}</p>}
              <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Kurs narxi</dt><dd>{formatPrice(course.oldPrice ?? course.price)}</dd></div>
                {saving > 0 && <div className="flex justify-between text-emerald-600"><dt>Chegirma</dt><dd>−{formatPrice(saving)}</dd></div>}
                <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                  <dt className="font-semibold">{plan === 'full' ? 'Jami' : 'Birinchi oy'}</dt>
                  <dd className="h-display text-2xl">{formatPrice(total)}</dd>
                </div>
              </dl>
              <label className="mt-5 flex items-start gap-2.5 text-xs text-slate-600">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-brand-600" />
                <span>
                  <Link to="/oferta" className="font-semibold text-brand-700 hover:underline">Ommaviy oferta</Link> va{' '}
                  <Link to="/maxfiylik" className="font-semibold text-brand-700 hover:underline">maxfiylik siyosati</Link> bilan tanishdim va roziman
                </span>
              </label>
              {errors.agree && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.agree}</p>}
              <button type="submit" disabled={status === 'sending'} className="btn-primary mt-5 w-full py-4 text-base">
                {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />} {formatPrice(total)} to‘lash
              </button>
              {status === 'error' && <p className="mt-3 text-center text-sm text-rose-500" role="alert">Xatolik yuz berdi. Qayta urinib ko‘ring.</p>}
              <p className="mt-4 text-center text-xs text-slate-400">14 kun ichida pulni qaytarish kafolati</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
