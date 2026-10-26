import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react'
import { BrandMark } from '../components/Logo'
import { api, ApiError, errorText } from './api'

export function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [needCode, setNeedCode] = useState(false)
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('login', { method: 'POST', body: { password, code: needCode ? code : undefined } })
      setPassword('')
      onDone()
    } catch (err) {
      if (err instanceof ApiError && err.code === 'totp_required') {
        setNeedCode(true)
      } else setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_top,#13203f,#0c1631)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <BrandMark className="h-14 w-14" color="#ffffff" />
          <div className="mt-4 font-brand text-2xl font-semibold tracking-wide uppercase">United IT Clubs</div>
          <div className="mt-1 text-sm text-slate-400">Boşqaruv paneli</div>
        </div>
        <form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-2xl" noValidate>
          <h1 className="font-display text-xl font-extrabold text-ink-900">Tizimga kiriş</h1>
          <p className="mt-1 text-sm text-slate-500">Faqat vakolatli xodimlar uçun.</p>
          <label htmlFor="adm-pw" className="mt-6 mb-1.5 block text-sm font-medium text-slate-700">Parol</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="adm-pw"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              autoFocus
              required
              maxLength={200}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-11 pl-10"
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Parolni yaşiriş' : 'Parolni körsatiş'} className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-slate-700">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {needCode && (
            <>
              <label htmlFor="adm-code" className="mt-4 mb-1.5 block text-sm font-medium text-slate-700">Tasdiqlaş kodi (2FA)</label>
              <input
                id="adm-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="input text-center font-mono text-lg tracking-[0.4em]"
              />
            </>
          )}
          {error && <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-600" role="alert">{error}</p>}
          <button type="submit" disabled={busy || !password || (needCode && code.length !== 6)} className="btn-dark mt-6 w-full py-3.5">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kiriş'}
          </button>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Şifrlangan ulaniş · urinişlar çeklangan
          </p>
        </form>
      </div>
    </div>
  )
}
