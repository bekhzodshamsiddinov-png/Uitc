import { useRef, useState, type ReactNode } from 'react'
import { upload } from '@vercel/blob/client'
import { ArrowDown, ArrowUp, ChevronDown, Film, ImageIcon, Loader2, Plus, Trash2, Upload, X } from 'lucide-react'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

export function Text({ label, hint, value, onChange, max = 200, placeholder }: { label: string; hint?: string; value: string; onChange: (v: string) => void; max?: number; placeholder?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input className="input py-2.5" value={value} maxLength={max} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

export function Area({ label, hint, value, onChange, max = 1000, rows = 3 }: { label: string; hint?: string; value: string; onChange: (v: string) => void; max?: number; rows?: number }) {
  return (
    <Field label={label} hint={hint ?? `${value.length}/${max}`}>
      <textarea className="input py-2.5 leading-relaxed" rows={rows} value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

/** Edits a list of short strings as "one per line" — the simplest UI for non-technical staff. */
export function Lines({ label, hint, value, onChange, rows = 4 }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  const [text, setText] = useState(value.join('\n'))
  return (
    <Field label={label} hint={hint ?? 'Har bir qatorga bittadan yozing'}>
      <textarea
        className="input py-2.5 leading-relaxed"
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))
        }}
      />
    </Field>
  )
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 select-none">
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}>
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  )
}

export function Panel({ title, desc, children, actions }: { title: string; desc?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
          {desc && <p className="mt-0.5 text-sm text-slate-500">{desc}</p>}
        </div>
        {actions}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

/** Collapsible, reorderable list of items. */
export function ListEditor<T>({
  items, onChange, render, title, empty, addLabel, make, max = 30, fixed = false,
}: {
  items: T[]
  onChange: (v: T[]) => void
  render: (item: T, update: (v: T) => void, i: number) => ReactNode
  title: (item: T, i: number) => string
  empty?: string
  addLabel: string
  make: () => T
  max?: number
  /** Items can be edited but not added, removed or reordered. */
  fixed?: boolean
}) {
  const [open, setOpen] = useState<number | null>(null)
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpen(j)
  }
  return (
    <div className="space-y-2">
      {items.length === 0 && empty && <p className="rounded-xl bg-surface p-4 text-center text-sm text-slate-500">{empty}</p>}
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={`rounded-xl ring-1 transition ${isOpen ? 'bg-white ring-brand-200 shadow-sm' : 'bg-surface/60 ring-slate-200'}`}>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-slate-500 ring-1 ring-slate-200">{i + 1}</span>
                <span className="truncate font-semibold text-ink-900">{title(it, i) || 'Nomsiz'}</span>
                <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {!fixed && <>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-ink-900 disabled:opacity-30" aria-label="Yuqoriga"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-ink-900 disabled:opacity-30" aria-label="Pastga"><ArrowDown className="h-4 w-4" /></button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Uşbu elementni öçirasizmi?')) {
                    onChange(items.filter((_, k) => k !== i))
                    setOpen(null)
                  }
                }}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Öçiriş"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              </>}
            </div>
            {isOpen && <div className="space-y-4 border-t border-slate-100 p-4">{render(it, (v) => onChange(items.map((x, k) => (k === i ? v : x))), i)}</div>}
          </div>
        )
      })}
      {!fixed && items.length < max && (
        <button
          type="button"
          onClick={() => {
            onChange([...items, make()])
            setOpen(items.length)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 transition hover:border-brand-300 hover:text-brand-600"
        >
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      )}
    </div>
  )
}

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif',
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
}
const LIMIT = { image: 8, video: 300 }

/** Upload / replace / remove an image or video. Files go straight to private storage. */
export function Media({ label, hint, kind, value, onChange, aspect = 'aspect-video' }: { label: string; hint?: string; kind: 'image' | 'video'; value: string; onChange: (v: string) => void; aspect?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState('')

  const pick = async (file: File) => {
    setError('')
    const ext = EXT[file.type]
    if (!ext || !file.type.startsWith(kind)) return setError(kind === 'image' ? 'Faqat JPG, PNG, WEBP yoki AVIF rasm.' : 'Faqat MP4, WEBM yoki MOV video.')
    if (file.size > LIMIT[kind] * 1024 * 1024) return setError(`Fayl hajmi ${LIMIT[kind]} MB dan oşmasin.`)
    const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || kind
    setProgress(0)
    try {
      const blob = await upload(`media/${base}.${ext}`, file, {
        access: 'private',
        handleUploadUrl: '/api/admin/upload',
        clientPayload: kind,
        headers: { 'x-uitc-admin': '1' },
        multipart: file.size > 8 * 1024 * 1024,
        contentType: file.type,
        onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
      })
      onChange(`/api/media?p=${blob.pathname}`)
    } catch {
      setError('Yuklab bölmadi. Internetni tekşirib, qayta urinib köring.')
    } finally {
      setProgress(null)
    }
  }

  return (
    <Field label={label} hint={hint ?? (kind === 'image' ? `JPG/PNG/WEBP, ${LIMIT.image} MB gaça` : `MP4 (tavsiya), vertikal 9:16, ${LIMIT.video} MB gaça`)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className={`relative w-full overflow-hidden rounded-xl bg-surface ring-1 ring-slate-200 sm:w-48 ${aspect}`}>
          {value ? (
            kind === 'image' ? <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <video src={value} className="absolute inset-0 h-full w-full object-cover" muted playsInline controls preload="metadata" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-slate-300">{kind === 'image' ? <ImageIcon className="h-8 w-8" /> : <Film className="h-8 w-8" />}</div>
          )}
          {progress !== null && (
            <div className="absolute inset-0 grid place-items-center bg-ink-900/70 text-white">
              <div className="flex flex-col items-center gap-2 text-sm font-bold"><Loader2 className="h-6 w-6 animate-spin" />{progress}%</div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={input} type="file" accept={kind === 'image' ? 'image/jpeg,image/png,image/webp,image/avif' : 'video/mp4,video/webm,video/quicktime'} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); e.target.value = '' }} />
          <button type="button" onClick={() => input.current?.click()} disabled={progress !== null} className="btn-dark py-2"><Upload className="h-4 w-4" /> {value ? 'Almaştiriş' : 'Yuklaş'}</button>
          {value && <button type="button" onClick={() => onChange('')} className="btn-ghost py-2"><X className="h-4 w-4" /> Olib taşlaş</button>}
        </div>
      </div>
      {error && <span className="mt-2 block text-sm font-medium text-rose-600">{error}</span>}
    </Field>
  )
}
