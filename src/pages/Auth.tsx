import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Info, Loader2, ShieldCheck } from 'lucide-react'
import { Logo } from '../components/Logo'
import { usePageTitle } from '../lib/usePageTitle'
import { formatPhoneInput, normalizePhone } from '../../api/_lib/validate'

// UI for phone + one-time-code sign in. The real OTP verification must live on a
// backend (send code via SMS gateway, verify server-side, set an HttpOnly,
// Secure, SameSite=Strict session cookie). Nothing sensitive is stored client-side.

export function Auth({ mode }: { mode: 'login' | 'register' }) {
  usePageTitle(mode === 'login' ? 'Kirish' : 'Ro‘yxatdan o‘tish')
  const navigate = useNavigate()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('+998 ')
  const [name, setName] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!timer) return
    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\+998\d{9}$/.test(normalizePhone(phone))) return setError('Telefon raqamni to‘liq kiriting.')
    if (mode === 'register' && name.trim().length < 2) return setError('Ismingizni kiriting.')
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('code')
      setTimer(60)
      refs.current[0]?.focus()
    }, 600)
  }

  const onDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, '')
    if (d.length > 1) {
      const next = d.slice(0, 6).split('')
      setCode([...next, ...Array(6 - next.length).fill('')])
      refs.current[Math.min(next.length, 5)]?.focus()
      return
    }
    const next = [...code]
    next[i] = d
    setCode(next)
    if (d && i < 5) refs.current[i + 1]?.focus()
  }

  const verify = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.join('').length !== 6) return setError('6 xonali kodni kiriting.')
    setError('')
    setLoading(true)
    setTimeout(() => navigate('/kabinet'), 600)
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Saytga qaytish</Link>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {step === 'phone' ? (
            <form onSubmit={sendCode} noValidate>
              <h1 className="h-display text-3xl text-ink-900">{mode === 'login' ? 'Xush kelibsiz!' : 'Bepul boshlang'}</h1>
              <p className="mt-2 text-slate-500">{mode === 'login' ? 'Telefon raqamingiz orqali kiring.' : 'Hisob yarating va birinchi darslarni bepul ko‘ring.'}</p>
              <div className="mt-8 space-y-4">
                {mode === 'register' && (
                  <div>
                    <label htmlFor="au-name" className="mb-1.5 block text-sm font-medium text-slate-700">Ismingiz</label>
                    <input id="au-name" className="input" autoComplete="given-name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <div>
                  <label htmlFor="au-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Telefon raqam</label>
                  <input id="au-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} />
                </div>
                {error && <p className="text-sm font-medium text-rose-500" role="alert">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SMS kod olish'}
                </button>
              </div>
              <p className="mt-6 text-center text-sm text-slate-500">
                {mode === 'login' ? <>Hisobingiz yo‘qmi? <Link to="/royxatdan-otish" className="font-semibold text-brand-700">Ro‘yxatdan o‘ting</Link></> : <>Hisobingiz bormi? <Link to="/kirish" className="font-semibold text-brand-700">Kirish</Link></>}
              </p>
            </form>
          ) : (
            <form onSubmit={verify} noValidate>
              <button type="button" onClick={() => setStep('phone')} className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Raqamni o‘zgartirish</button>
              <h1 className="h-display text-3xl text-ink-900">Kodni kiriting</h1>
              <p className="mt-2 text-slate-500"><b className="text-slate-800">{phone}</b> raqamiga 6 xonali kod yuborildi.</p>
              <div className="mt-8 flex justify-between gap-2">
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { refs.current[i] = el }}
                    value={d}
                    onChange={(e) => onDigit(i, e.target.value)}
                    onKeyDown={(e) => e.key === 'Backspace' && !d && i > 0 && refs.current[i - 1]?.focus()}
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    aria-label={`${i + 1}-raqam`}
                    className="h-14 w-12 rounded-xl border border-slate-200 text-center font-display text-2xl font-bold focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                  />
                ))}
              </div>
              {error && <p className="mt-3 text-sm font-medium text-rose-500" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-3.5">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tasdiqlash'}
              </button>
              <p className="mt-4 text-center text-sm text-slate-500">
                {timer ? <>Kodni qayta yuborish: 0:{String(timer).padStart(2, '0')}</> : <button type="button" onClick={() => setTimer(60)} className="font-semibold text-brand-700">Kodni qayta yuborish</button>}
              </p>
            </form>
          )}
          <div className="mt-10 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" /> Demo rejim: SMS va hisob tizimi backend ulangandan so‘ng ishga tushadi.
          </div>
        </div>
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" /> Parolsiz, xavfsiz kirish — bir martalik SMS kod orqali</p>
      </div>
      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl" />
        <div className="relative flex h-full flex-col justify-end p-14 text-white">
          <blockquote className="h-display max-w-lg text-4xl leading-tight">“Eng yaxshi investitsiya — o‘zingizga qilingan investitsiya.”</blockquote>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[['6 yil', 'tajriba'], ['10 000+', 'bitiruvchi'], ['4.9', 'reyting']].map(([v, l]) => (
              <div key={l}><div className="font-display text-3xl font-extrabold text-lime-accent">{v}</div><div className="text-sm text-slate-400">{l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
