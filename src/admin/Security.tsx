import { useState, type FormEvent } from 'react'
import QRCode from 'qrcode'
import { AlertTriangle, CheckCircle2, KeyRound, Loader2, LogOut, ShieldCheck, Smartphone } from 'lucide-react'
import { api, errorText, type SessionInfo } from './api'

function strength(pw: string) {
  let s = 0
  if (pw.length >= 12) s++
  if (pw.length >= 16) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const strengthLabel = ['Juda zaif', 'Zaif', 'Örtaça', 'Yaxşi', 'Kuçli', 'Juda kuçli']
const strengthColor = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600']

function Card({ icon: Icon, title, desc, children }: { icon: typeof KeyRound; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-ink-900"><Icon className="h-5 w-5" /></span>
        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Msg({ ok, text }: { ok?: boolean; text: string }) {
  if (!text) return null
  return <p className={`mt-4 rounded-xl px-3 py-2.5 text-sm font-medium ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`} role={ok ? 'status' : 'alert'}>{text}</p>
}

export function Security({ session, onChanged, forced = false }: { session: SessionInfo; onChanged: () => void; forced?: boolean }) {
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [rep, setRep] = useState('')
  const [pwMsg, setPwMsg] = useState({ ok: false, text: '' })
  const [busy, setBusy] = useState('')

  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [disablePw, setDisablePw] = useState('')
  const [tMsg, setTMsg] = useState({ ok: false, text: '' })

  const s = strength(next)

  const changePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (next !== rep) return setPwMsg({ ok: false, text: 'Yangi parollar mos kelmadi.' })
    setBusy('pw')
    try {
      await api('security', { method: 'POST', body: { action: 'change-password', current: cur, next } })
      setCur(''); setNext(''); setRep('')
      setPwMsg({ ok: true, text: 'Parol yangilandi. Boşqa qurilmalardagi sessiyalar yopildi.' })
      onChanged()
    } catch (err) {
      setPwMsg({ ok: false, text: errorText(err) })
    } finally {
      setBusy('')
    }
  }

  const startTotp = async () => {
    setBusy('totp')
    setTMsg({ ok: false, text: '' })
    try {
      const r = await api<{ secret: string; uri: string }>('security', { method: 'POST', body: { action: 'totp-setup' } })
      setSecret(r.secret)
      setQr(await QRCode.toDataURL(r.uri, { margin: 1, width: 220, color: { dark: '#0c1631', light: '#ffffff' } }))
    } catch (err) {
      setTMsg({ ok: false, text: errorText(err) })
    } finally {
      setBusy('')
    }
  }
  const enableTotp = async (e: FormEvent) => {
    e.preventDefault()
    setBusy('totp')
    try {
      await api('security', { method: 'POST', body: { action: 'totp-enable', code } })
      setQr(''); setSecret(''); setCode('')
      setTMsg({ ok: true, text: 'Ikki bosqiçli himoya yoqildi.' })
      onChanged()
    } catch (err) {
      setTMsg({ ok: false, text: errorText(err) })
    } finally {
      setBusy('')
    }
  }
  const disableTotp = async (e: FormEvent) => {
    e.preventDefault()
    setBusy('totp')
    try {
      await api('security', { method: 'POST', body: { action: 'totp-disable', code, password: disablePw } })
      setCode(''); setDisablePw('')
      setTMsg({ ok: true, text: 'Ikki bosqiçli himoya öçirildi.' })
      onChanged()
    } catch (err) {
      setTMsg({ ok: false, text: errorText(err) })
    } finally {
      setBusy('')
    }
  }
  const logoutAll = async () => {
    setBusy('all')
    try {
      await api('security', { method: 'POST', body: { action: 'logout-all' } })
    } finally {
      onChanged()
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink-900">Xavfsizlik</h1>
        <p className="mt-1 text-sm text-slate-500">Hisobingizni himoya qiliş sozlamalari.</p>
      </div>

      {forced && (
        <div className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p><b>Birinçi kiriş.</b> Davom etişdan oldin vaqtinçalik parolni özingiz biladigan yangi, kuçli parolga almaştiring.</p>
        </div>
      )}

      <Card icon={KeyRound} title="Parolni almaştiriş" desc="Kamida 12 belgi: harflar, raqamlar va belgilar aralaş bölgani yaxşi.">
        <form onSubmit={changePassword} className="grid gap-4" noValidate>
          <input type="password" autoComplete="current-password" placeholder="Joriy parol" value={cur} onChange={(e) => setCur(e.target.value)} maxLength={200} className="input" />
          <div>
            <input type="password" autoComplete="new-password" placeholder="Yangi parol" value={next} onChange={(e) => setNext(e.target.value)} maxLength={128} className="input" />
            {next && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex flex-1 gap-1">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < s ? strengthColor[s] : 'bg-slate-200'}`} />)}</div>
                <span className="text-xs font-semibold text-slate-500">{strengthLabel[s]}</span>
              </div>
            )}
          </div>
          <input type="password" autoComplete="new-password" placeholder="Yangi parolni takrorlang" value={rep} onChange={(e) => setRep(e.target.value)} maxLength={128} className="input" />
          <button type="submit" disabled={busy === 'pw' || !cur || next.length < 12 || !rep} className="btn-dark justify-self-start">
            {busy === 'pw' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Parolni saqlaş'}
          </button>
        </form>
        <Msg {...pwMsg} />
      </Card>

      {!forced && (
        <>
          <Card icon={Smartphone} title="Ikki bosqiçli himoya (2FA)" desc="Paroldan taşqari Google Authenticator yoki şunga öxşaş ilovadagi kod söraladi. Parol öğirlansa ham hisob himoyalangan böladi.">
            {session.totpEnabled ? (
              <>
                <div className="flex items-center gap-2 font-semibold text-emerald-700"><CheckCircle2 className="h-5 w-5" /> Yoqilgan</div>
                <form onSubmit={disableTotp} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input type="password" placeholder="Parol" autoComplete="current-password" value={disablePw} onChange={(e) => setDisablePw(e.target.value)} className="input" />
                  <input inputMode="numeric" placeholder="6 xonali kod" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="input font-mono tracking-widest" />
                  <button type="submit" disabled={busy === 'totp' || code.length !== 6 || !disablePw} className="btn-ghost">Öçiriş</button>
                </form>
              </>
            ) : qr ? (
              <form onSubmit={enableTotp} className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
                <img src={qr} alt="2FA QR kod" width={220} height={220} className="rounded-xl ring-1 ring-slate-200" />
                <div>
                  <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
                    <li>Telefoningizda Google Authenticator ilovasini oçing.</li>
                    <li>QR kodni skanerlang (yoki kalitni qölda kiriting).</li>
                    <li>Ilova körsatgan 6 xonali kodni kiriting.</li>
                  </ol>
                  <code className="mt-3 block rounded-lg bg-surface px-3 py-2 font-mono text-xs break-all text-slate-700">{secret}</code>
                  <div className="mt-4 flex gap-2">
                    <input inputMode="numeric" autoComplete="one-time-code" placeholder="123456" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="input max-w-[160px] text-center font-mono tracking-widest" />
                    <button type="submit" disabled={busy === 'totp' || code.length !== 6} className="btn-dark">Tasdiqlaş</button>
                  </div>
                </div>
              </form>
            ) : (
              <button type="button" onClick={startTotp} disabled={busy === 'totp'} className="btn-dark">
                {busy === 'totp' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShieldCheck className="h-4 w-4" /> 2FA ni yoqiş</>}
              </button>
            )}
            <Msg {...tMsg} />
          </Card>

          <Card icon={LogOut} title="Barça qurilmalardan çiqiş" desc="Telefon yoki kompyuter yöqolgan bölsa — barça oçiq sessiyalarni darhol yopadi.">
            <button type="button" onClick={logoutAll} disabled={busy === 'all'} className="btn bg-rose-600 text-white hover:bg-rose-700">
              {busy === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hamma joydan çiqiş'}
            </button>
          </Card>
        </>
      )}
    </div>
  )
}
