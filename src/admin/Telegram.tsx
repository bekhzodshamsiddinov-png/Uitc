import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Loader2, RefreshCw, Send, Trash2, Users } from 'lucide-react'
import { api, errorText } from './api'

interface Chat { id: string; title: string; type: string }
interface State { configured: boolean; bot?: string | null; chats: Chat[] }

const typeLabel: Record<string, string> = { private: 'Şaxsiy', group: 'Guruh', supergroup: 'Guruh', channel: 'Kanal', env: 'Sozlamadan' }

export function Telegram() {
  const [st, setSt] = useState<State | null>(null)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [candidates, setCandidates] = useState<Chat[] | null>(null)

  const load = useCallback(async () => {
    try {
      setSt(await api<State>('telegram'))
    } catch (e) {
      setMsg({ ok: false, text: errorText(e) })
    }
  }, [])
  useEffect(() => { load() }, [load])

  const act = async (action: string, extra: Record<string, unknown> = {}) => {
    setBusy(action + (extra.id ?? ''))
    setMsg(null)
    try {
      const r = await api<{ chats?: Chat[]; candidates?: Chat[]; sent?: number; total?: number }>('telegram', { method: 'POST', body: { action, ...extra } })
      if (r.chats) setSt((s) => (s ? { ...s, chats: r.chats! } : s))
      if (action === 'detect') {
        setCandidates(r.candidates ?? [])
        if (!r.candidates?.length) setMsg({ ok: false, text: 'Yangi çat topilmadi. Botga /start yozing (yoki guruhga qöşing) va qayta bosing.' })
      }
      if (action === 'add') {
        setCandidates((c) => c?.filter((x) => x.id !== extra.id) ?? null)
        setMsg({ ok: true, text: 'Çat ulandi. Endi “Sinov xabari” bilan tekşiring.' })
      }
      if (action === 'test') setMsg(r.sent ? { ok: true, text: `Sinov xabari ${r.sent}/${r.total} ta çatga yuborildi.` } : { ok: false, text: 'Xabar yuborilmadi. Botga /start yozilganini tekşiring.' })
    } catch (e) {
      setMsg({ ok: false, text: errorText(e) })
    } finally {
      setBusy('')
    }
  }

  if (!st) return <div className="grid min-h-[40vh] place-items-center text-slate-400"><Loader2 className="h-7 w-7 animate-spin" /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-900">Telegram xabarnomalari</h1>
        <p className="mt-1 text-sm text-slate-500">Saytdan yangi ariza kelişi bilan şu çatlarga xabar boradi.</p>
      </div>

      {!st.configured ? (
        <p className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-800">Bot tokeni (TELEGRAM_BOT_TOKEN) Vercel sozlamalarida yöq.</p>
      ) : (
        <>
          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h2 className="font-display text-lg font-bold text-ink-900">Çat ulaş</h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
              <li>
                Telegram'da {st.bot ? <a className="font-semibold text-[#1878ae] underline" href={`https://t.me/${st.bot}`} target="_blank" rel="noopener noreferrer">@{st.bot}</a> : 'botni'} oçing va <b>Start</b> tugmasini bosing.
                Guruhga kelsin desangiz — botni guruhga qöşing.
              </li>
              <li>Pastdagi <b>“Çatlarni aniqlaş”</b> tugmasini bosing va <b>öz</b> çatingiz yonidagi <b>“Ulaş”</b> ni tanlang.</li>
              <li><b>“Sinov xabari”</b> bilan tekşiring.</li>
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => act('detect')} disabled={!!busy} className="btn-dark py-2.5">
                {busy === 'detect' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Çatlarni aniqlaş
              </button>
              <button type="button" onClick={() => act('test')} disabled={!!busy || !st.chats.length} className="btn-ghost py-2.5">
                {busy === 'test' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Sinov xabari
              </button>
            </div>
            {candidates && candidates.length > 0 && (
              <div className="mt-5 rounded-xl bg-surface p-4">
                <p className="text-sm font-semibold text-ink-900">Botga yozgan çatlar:</p>
                <p className="mt-0.5 text-xs text-slate-500">Faqat özingizni yoki xodimlaringizni ulang — bot ommaviy, unga istalgan odam yoza oladi.</p>
                <ul className="mt-3 space-y-2">
                  {candidates.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-ink-900">{c.title}</div>
                        <div className="text-xs text-slate-500">{typeLabel[c.type] ?? c.type} · {c.id}</div>
                      </div>
                      <button type="button" onClick={() => act('add', { id: c.id })} disabled={!!busy} className="btn-primary py-2">
                        {busy === 'add' + c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Ulaş
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {msg && (
              <p className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`} role={msg.ok ? 'status' : 'alert'}>
                {msg.ok && <CheckCircle2 className="h-4 w-4" />} {msg.text}
              </p>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900"><Users className="h-5 w-5" /> Ulangan çatlar</h2>
            {st.chats.length ? (
              <ul className="mt-4 divide-y divide-slate-100">
                {st.chats.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1878ae]/10 text-[#1878ae]"><Send className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-ink-900">{c.title}</div>
                      <div className="text-xs text-slate-500">{typeLabel[c.type] ?? c.type} · {c.id}</div>
                    </div>
                    {c.type !== 'env' && (
                      <button type="button" onClick={() => confirm('Bu çatga xabar yuboriş töxtatilsinmi?') && act('remove', { id: c.id })} disabled={!!busy} className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Öçiriş">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl bg-surface p-4 text-center text-sm text-slate-500">Hozirça çat ulanmagan — arizalar faqat “Arizalar” bölimida körinadi.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
