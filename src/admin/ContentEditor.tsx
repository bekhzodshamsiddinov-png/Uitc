import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookOpen, CheckCircle2, ExternalLink, Globe, HelpCircle, History, Home, Info, Loader2, MapPin, MessageSquareQuote, RotateCcw, Save, Sparkles, Type, Undo2, Users } from 'lucide-react'
import { LANGS, type AudienceId, type Card, type Course, type Lang, type SectionKey, type SiteContent, type VideoTestimonial } from '../../api/_lib/content'
import { DEFAULT_CONTENT } from '../content/defaults'
import { localize, withDefaults } from '../content/localize'
import { LANG_LABELS, withLang } from '../i18n'
import { api, ApiError, fmtDate } from './api'
import { Area, Field, Lines, ListEditor, Media, Panel, Text, Toggle } from './editor/fields'

interface Stored { content: SiteContent; savedAt: string; version: number }
interface HistoryItem { id: string; savedAt: string; version: number }

const tabs = [
  { id: 'contact', label: 'Kontaktlar', icon: MapPin },
  { id: 'hero', label: 'Boş sahifa', icon: Home },
  { id: 'courses', label: 'Kurslar', icon: BookOpen },
  { id: 'videos', label: 'Video fikrlar', icon: MessageSquareQuote },
  { id: 'blocks', label: 'Bloklar', icon: Sparkles },
  { id: 'audiences', label: 'Kim uçun', icon: Users },
  { id: 'faq', label: 'Savol-javob', icon: HelpCircle },
  { id: 'about', label: 'Biz haqimizda', icon: Info },
  { id: 'headings', label: 'Sarlavhalar', icon: Type },
  { id: 'history', label: 'Versiyalar', icon: History },
] as const
type Tab = (typeof tabs)[number]['id']

const sectionNames: Record<SectionKey, string> = {
  audiences: '“Kim uçun” bölimi', courses: 'Kurslar bölimi', why: '“Nega UITC” bölimi', steps: '“Qanday boşlanadi” bölimi',
  students: 'Öquvçilar fikrlari', parents: 'Ota-onalar fikrlari', diploma: 'Diplom bölimi', location: 'Manzil bölimi',
  faq: 'Savol-javob bölimi', lead: 'Pastki ariza bloki',
}
const audienceLabel: Record<AudienceId, string> = { kids: 'Bolalar', teens: 'Ösmirlar', adults: 'Kattalar' }
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

function CardsEditor({ items, onChange, addLabel }: { items: Card[]; onChange: (v: Card[]) => void; addLabel: string }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      title={(c) => c.title}
      addLabel={addLabel}
      make={() => ({ title: 'Yangi karta', text: '' })}
      max={8}
      render={(c, set) => (
        <>
          <Text label="Sarlavha" value={c.title} max={80} onChange={(title) => set({ ...c, title })} />
          <Area label="Matn" value={c.text} max={300} onChange={(text) => set({ ...c, text })} />
        </>
      )}
    />
  )
}

function VideosEditor({ items, onChange, courses, parent, shared }: { items: VideoTestimonial[]; onChange: (v: VideoTestimonial[]) => void; courses: Course[]; parent?: boolean; shared: boolean }) {
  return (
    <ListEditor
      fixed={!shared}
      items={items}
      onChange={onChange}
      title={(v) => [v.name || (parent ? 'Ota-ona' : 'Öquvçi'), v.course, v.src || v.youtubeId ? '🎬' : '— video yöq'].filter(Boolean).join(' · ')}
      addLabel={parent ? 'Ota-ona videosini qöşiş' : 'Öquvçi videosini qöşiş'}
      make={(): VideoTestimonial => (parent ? { role: 'Ota-ona' } : {})}
      empty="Hozirça video yöq."
      render={(v, set) => (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Text label="Ism" value={v.name ?? ''} max={60} onChange={(name) => set({ ...v, name: name || undefined })} placeholder={parent ? 'Masalan: Dilnoza opa' : 'Masalan: Jasur'} />
            {parent ? (
              <Text label="Kim" value={v.role ?? ''} max={40} onChange={(role) => set({ ...v, role: role || undefined })} placeholder="Ota-ona / Onasi / Otasi" />
            ) : !shared ? null : (
              <Field label="Yoşi">
                <input className="input py-2.5" type="number" min={3} max={99} value={v.age ?? ''} onChange={(e) => set({ ...v, age: e.target.value ? Number(e.target.value) : undefined })} />
              </Field>
            )}
            <Field label="Kurs">
              <select className="input py-2.5" value={v.course ?? ''} onChange={(e) => set({ ...v, course: e.target.value || undefined })}>
                <option value="">—</option>
                {courses.map((c) => <option key={c.slug} value={c.short}>{c.short}</option>)}
              </select>
            </Field>
          </div>
          <Area label="Qisqa iqtibos (ixtiyoriy)" value={v.quote ?? ''} max={240} rows={2} onChange={(quote) => set({ ...v, quote: quote || undefined })} />
          {shared && <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Media label="Video" kind="video" aspect="aspect-[9/16]" value={v.src ?? ''} onChange={(src) => set({ ...v, src: src || undefined })} />
            <Media label="Muqova rasmi (ixtiyoriy)" kind="image" aspect="aspect-[9/16]" value={v.poster ?? ''} onChange={(poster) => set({ ...v, poster: poster || undefined })} hint="Video boşlanmasdan oldin körinadigan rasm" />
          </div>
          <Text label="yoki YouTube video ID" hint="youtube.com/shorts/ dan keyingi qism. Video yuklangan bölsa, şart emas." value={v.youtubeId ?? ''} max={20} onChange={(youtubeId) => set({ ...v, youtubeId: youtubeId.trim() || undefined })} />
          </>}
        </>
      )}
    />
  )
}

export function ContentEditor({ onPublished }: { onPublished: (c: SiteContent) => void }) {
  const [tab, setTab] = useState<Tab>('contact')
  const [lang, setLang] = useState<Lang>('uz')
  const [stored, setStored] = useState<Stored | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [loadErr, setLoadErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [epoch, setEpoch] = useState(0) // remounts inputs after restore/discard

  const base = useMemo(() => withDefaults(stored?.content ?? DEFAULT_CONTENT), [stored])
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(base)

  const load = useCallback(async () => {
    setLoadErr('')
    try {
      const r = await api<{ stored: Stored | null; history: HistoryItem[] }>('content')
      setStored(r.stored)
      setHistory(r.history)
      setDraft(clone(withDefaults(r.stored?.content ?? DEFAULT_CONTENT)))
      setEpoch((e) => e + 1)
    } catch {
      setLoadErr('Kontentni yuklab bölmadi.')
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!dirty) return
    const h = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])

  if (!draft) {
    return <div className="grid min-h-[50vh] place-items-center text-slate-500">{loadErr ? <button type="button" className="btn-ghost" onClick={load}>{loadErr} Qayta uriniş</button> : <Loader2 className="h-7 w-7 animate-spin" />}</div>
  }

  // Uzbek is the master copy. In Russian/English only texts are edited: the
  // view comes from localize() and edits are stored as that language's copy.
  const shared = lang === 'uz'
  const c = shared ? draft : localize(draft, lang)
  const set = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) =>
    setDraft(shared ? { ...draft, [k]: v } : { ...draft, tr: { ...draft.tr, [lang]: { ...c, [k]: v } } })

  const publish = async () => {
    setSaving(true)
    setMsg(null)
    try {
      const r = await api<{ stored: Stored }>('content', { method: 'PUT', body: { content: c, baseVersion: stored?.version ?? 0 } })
      setStored(r.stored)
      setDraft(clone(withDefaults(r.stored.content)))
      onPublished(r.stored.content)
      setMsg({ ok: true, text: 'Saqlandi! Saytda 20 soniya içida yangilanadi.' })
      api<{ history: HistoryItem[] }>('content').then((x) => setHistory(x.history)).catch(() => {})
    } catch (e) {
      if (e instanceof ApiError && e.code === 'conflict') setMsg({ ok: false, text: 'Kontentni boşqa oynada kimdir özgartirgan. Sahifani yangilab, qayta urinib köring.' })
      else if (e instanceof ApiError && e.code === 'invalid') setMsg({ ok: false, text: String(e.data.message ?? 'Ma’lumotda xato bor.') })
      else setMsg({ ok: false, text: 'Saqlab bölmadi. Internetni tekşiring.' })
    } finally {
      setSaving(false)
    }
  }

  const restore = async (id: string) => {
    if (!confirm('Şu versiyani tiklaysizmi? Joriy holat ham tarixda saqlanib qoladi.')) return
    setSaving(true)
    try {
      await api('content', { method: 'POST', body: { action: 'restore', id } })
      await load()
      setMsg({ ok: true, text: 'Versiya tiklandi va saytga çiqarildi.' })
    } catch {
      setMsg({ ok: false, text: 'Tiklab bölmadi.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:top-0">
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Sayt kontenti</h1>
          <p className="text-xs text-slate-500">
            {stored ? `Oxirgi saqlaş: ${fmtDate(stored.savedAt)} · v${stored.version}` : 'Hali saqlanmagan — saytda standart matnlar körinyapti'}
          </p>
        </div>
        {dirty && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Saqlanmagan özgarişlar</span>}
        <a href={withLang(lang, '/')} target="_blank" rel="noopener noreferrer" className="btn-ghost py-2"><ExternalLink className="h-4 w-4" /> Saytni köriş</a>
        <button type="button" disabled={!dirty || saving} onClick={() => { setDraft(clone(base)); setEpoch((e) => e + 1) }} className="btn-ghost py-2"><Undo2 className="h-4 w-4" /> Bekor qiliş</button>
        <button type="button" disabled={!dirty || saving} onClick={publish} className="btn-primary py-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Saqlaş va çiqariş</button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70 sm:flex-row sm:items-center">
        <span className="flex items-center gap-2 px-2 text-sm font-semibold text-slate-600"><Globe className="h-4 w-4" /> Qaysi tildagi matnni tahrirlaysiz?</span>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface p-1 sm:ml-auto sm:min-w-[360px]" role="radiogroup" aria-label="Til">
          {LANGS.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${lang === l ? 'bg-ink-900 text-white shadow-sm' : 'text-slate-600 hover:text-ink-900'}`}>
              {LANG_LABELS[l].name}
            </button>
          ))}
        </div>
      </div>
      {!shared && tab !== 'history' && (
        <div className="flex items-start gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Siz <b>{LANG_LABELS[lang].name}</b> matnlarni tahrirlayapsiz. Rasm, video, telefon raqamlar va kurslar röyxati <b>Özbekça</b> bölimida özgartiriladi va barça tillarga birdan qöllanadi.</span>
        </div>
      )}

      {msg && (
        <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`} role={msg.ok ? 'status' : 'alert'}>
          {msg.ok && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />} {msg.text}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[210px_1fr]">
        <nav className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:px-0" aria-label="Bölimlar">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'bg-ink-900 text-white' : 'text-slate-600 hover:bg-white'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div key={`${epoch}-${lang}`} className="min-w-0 space-y-5">
          {tab === 'contact' && (
            <Panel title="Kontaktlar" desc="Sayt böylab: header, footer, forma va manzil bölimida körinadi.">
              {shared && <>
              <Lines label="Telefon raqamlar" hint="Har bir qatorga bitta raqam. Birinçisi asosiy hisoblanadi." value={c.contact.phones} rows={3} onChange={(phones) => set('contact', { ...c.contact, phones })} />
              <Text label="Telegram username" hint="@ belgisisiz, masalan: uitcadmin" value={c.contact.telegram} max={32} onChange={(telegram) => set('contact', { ...c.contact, telegram: telegram.replace(/^@/, '') })} />
              </>}
              <div className="grid gap-4 sm:grid-cols-2">
                <Text label="Viloyat, tuman" value={c.contact.city} max={80} onChange={(city) => set('contact', { ...c.contact, city })} />
                <Text label="Mahalla, köça, uy" value={c.contact.landmark} max={120} onChange={(landmark) => set('contact', { ...c.contact, landmark })} />
              </div>
              {shared && <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Kenglik (latitude)" hint="Google Maps’dan nuqtani bosib nusxalang"><input className="input py-2.5" type="number" step="0.000001" value={c.contact.lat} onChange={(e) => set('contact', { ...c.contact, lat: Number(e.target.value) })} /></Field>
                <Field label="Uzunlik (longitude)"><input className="input py-2.5" type="number" step="0.000001" value={c.contact.lng} onChange={(e) => set('contact', { ...c.contact, lng: Number(e.target.value) })} /></Field>
              </div>}
            </Panel>
          )}

          {tab === 'hero' && (
            <>
              <Panel title="Boş ekran (hero)" desc="Sayt oçilganda birinçi körinadigan qism.">
                <Text label="Yuqoridagi kiçik yozuv" value={c.hero.badge} max={80} onChange={(badge) => set('hero', { ...c.hero, badge })} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Text label="Sarlavha (boşi)" value={c.hero.titleBefore} max={60} onChange={(titleBefore) => set('hero', { ...c.hero, titleBefore })} />
                  <Text label="Ajratilgan söz" hint="Töq-sariq rangda" value={c.hero.titleHighlight} max={30} onChange={(titleHighlight) => set('hero', { ...c.hero, titleHighlight })} />
                  <Text label="Sarlavha (oxiri)" value={c.hero.titleAfter} max={60} onChange={(titleAfter) => set('hero', { ...c.hero, titleAfter })} />
                </div>
                <Area label="Tavsif" value={c.hero.subtitle} max={400} onChange={(subtitle) => set('hero', { ...c.hero, subtitle })} />
                <Lines label="Belgilar (forma ostida)" value={c.hero.chips} rows={3} onChange={(chips) => set('hero', { ...c.hero, chips })} hint="Har bir qatorga bitta, 4 tagaça" />
                {shared && <Media label="Asosiy rasm" kind="image" aspect="aspect-[4/5]" value={c.hero.image} onChange={(image) => set('hero', { ...c.hero, image })} />}
              </Panel>
              <Panel title="Raqamlar" desc="Hero ostidagi 4 ta raqamli karta.">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[0, 1, 2, 3].map((i) => {
                    const s = c.stats[i] ?? { value: '', label: '' }
                    const upd = (v: typeof s) => { const next = [...c.stats]; next[i] = v; set('stats', next.filter(Boolean)) }
                    return (
                      <div key={i} className="grid grid-cols-[110px_1fr] gap-2 rounded-xl bg-surface/60 p-3">
                        <Text label={`#${i + 1} qiymat`} value={s.value} max={12} onChange={(value) => upd({ ...s, value })} />
                        <Text label="izoh" value={s.label} max={40} onChange={(label) => upd({ ...s, label })} />
                      </div>
                    )
                  })}
                </div>
              </Panel>
              <Panel title="Yugurib turuvçi yozuvlar" desc="Hero ostidagi töq-kök tasma.">
                <Lines label="Sözlar" value={c.marquee} rows={6} onChange={(marquee) => set('marquee', marquee)} />
              </Panel>
            </>
          )}

          {tab === 'courses' && (
            <Panel title="Kurslar" desc="Tartibini strelkalar bilan özgartiring. Yaşirilgan kurs saytda körinmaydi.">
              <ListEditor
                fixed={!shared}
                items={c.courses}
                onChange={(courses) => set('courses', courses)}
                title={(k) => `${k.short || k.title}${k.hidden ? ' · yaşirilgan' : ''}`}
                addLabel="Yangi kurs qöşiş"
                max={24}
                make={(): Course => ({
                  slug: `kurs-${Date.now().toString(36)}`, title: 'Yangi kurs', short: 'Yangi kurs', subtitle: '', duration: '3 oy', level: 'Noldan',
                  audiences: ['teens', 'adults'], ages: '12 yoşdan', image: '/images/course-foundation.webp', tags: [], outcomes: [], result: '', forWhom: [], modules: [], hidden: true,
                })}
                render={(k, upd) => (
                  <>
                    {shared && <div className="flex flex-wrap gap-5">
                      <Toggle label="Saytda körsatiş" checked={!k.hidden} onChange={(v) => upd({ ...k, hidden: v ? undefined : true })} />
                      <Toggle label="“Kasb” belgisi" checked={!!k.featured} onChange={(v) => upd({ ...k, featured: v || undefined })} />
                    </div>}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Text label="Töliq nomi" value={k.title} max={100} onChange={(title) => upd({ ...k, title })} />
                      <Text label="Qisqa nomi" hint="Kartalarda va menyuda" value={k.short} max={30} onChange={(short) => upd({ ...k, short })} />
                    </div>
                    <Area label="Qisqaça tavsif" value={k.subtitle} max={300} rows={2} onChange={(subtitle) => upd({ ...k, subtitle })} />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Text label="Davomiyligi" value={k.duration} max={30} onChange={(duration) => upd({ ...k, duration })} placeholder="3 oy" />
                      <Text label="Daraja" value={k.level} max={30} onChange={(level) => upd({ ...k, level })} placeholder="Noldan" />
                      <Text label="Yoş" value={k.ages} max={30} onChange={(ages) => upd({ ...k, ages })} placeholder="12 yoşdan" />
                    </div>
                    {shared && <>
                    <Field label="Kimlar uçun (filtr)">
                      <div className="flex flex-wrap gap-4 pt-1">
                        {(Object.keys(audienceLabel) as AudienceId[]).map((a) => (
                          <label key={a} className="inline-flex items-center gap-2 text-sm font-medium">
                            <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={k.audiences.includes(a)} onChange={(e) => upd({ ...k, audiences: e.target.checked ? [...k.audiences, a] : k.audiences.filter((x) => x !== a) })} />
                            {audienceLabel[a]}
                          </label>
                        ))}
                      </div>
                    </Field>
                    <Media label="Kurs rasmi" kind="image" aspect="aspect-[4/3]" value={k.image} onChange={(image) => upd({ ...k, image })} />
                    </>}
                    <Lines label="Nimalarni örganadi" value={k.outcomes} rows={5} onChange={(outcomes) => upd({ ...k, outcomes })} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Lines label="Kimlar uçun" value={k.forWhom} rows={3} onChange={(forWhom) => upd({ ...k, forWhom })} />
                      <Area label="Kurs natijasi" value={k.result} max={300} rows={3} onChange={(result) => upd({ ...k, result })} />
                    </div>
                    <Field label="Öquv rejasi (modullar)">
                      <ListEditor
                        items={k.modules}
                        onChange={(modules) => upd({ ...k, modules })}
                        title={(m) => m.title}
                        addLabel="Modul qöşiş"
                        max={16}
                        make={() => ({ title: 'Yangi modul', topics: [] })}
                        render={(m, setM) => (
                          <>
                            <Text label="Modul nomi" value={m.title} max={100} onChange={(title) => setM({ ...m, title })} />
                            <Lines label="Mavzular" value={m.topics} rows={4} onChange={(topics) => setM({ ...m, topics })} />
                          </>
                        )}
                      />
                    </Field>
                    {shared && <Text label="URL nomi" hint={`Sahifa manzili: /kurs/${k.slug} — faqat kiçik lotin harflari, raqam va “-”`} value={k.slug} max={40} onChange={(slug) => upd({ ...k, slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '') })} />}
                  </>
                )}
              />
            </Panel>
          )}

          {tab === 'videos' && (
            <>
              <Panel title="Öquvçilar fikrlari" desc="Video telefonda tik (9:16) formatda yozilgani eng yaxşi körinadi.">
                <VideosEditor items={c.studentVideos} onChange={(v) => set('studentVideos', v)} courses={c.courses} shared={shared} />
              </Panel>
              <Panel title="Ota-onalar fikrlari">
                <VideosEditor items={c.parentVideos} onChange={(v) => set('parentVideos', v)} courses={c.courses} parent shared={shared} />
              </Panel>
            </>
          )}

          {tab === 'blocks' && (
            <>
              <Panel title="“Nega UITC” kartalari" desc="Birinçi karta katta va töq rangda körinadi.">
                <CardsEditor items={c.reasons} onChange={(v) => set('reasons', v)} addLabel="Karta qöşiş" />
              </Panel>
              <Panel title="“Qanday boşlanadi” qadamlari">
                <CardsEditor items={c.steps} onChange={(v) => set('steps', v)} addLabel="Qadam qöşiş" />
              </Panel>
              <Panel title="Diplom bloki — afzalliklar">
                <Lines label="Afzalliklar" value={c.diplomaPoints} rows={3} onChange={(v) => set('diplomaPoints', v)} />
              </Panel>
              <Panel title="Pastki ariza bloki — afzalliklar">
                <Lines label="Afzalliklar" value={c.leadPoints} rows={3} onChange={(v) => set('leadPoints', v)} />
              </Panel>
            </>
          )}

          {tab === 'audiences' && (
            <Panel title="Kim uçun" desc="Boş sahifadagi 3 ta rangli karta va katalog filtri.">
              {c.audiences.map((a, i) => (
                <div key={a.id} className="grid gap-3 rounded-xl bg-surface/60 p-4 sm:grid-cols-[1fr_1fr_2fr]">
                  <Text label="Nomi" value={a.name} max={30} onChange={(name) => set('audiences', c.audiences.map((x, k) => (k === i ? { ...x, name } : x)))} />
                  <Text label="Yoş" value={a.ages} max={30} onChange={(ages) => set('audiences', c.audiences.map((x, k) => (k === i ? { ...x, ages } : x)))} />
                  <Text label="Tavsif" value={a.pitch} max={200} onChange={(pitch) => set('audiences', c.audiences.map((x, k) => (k === i ? { ...x, pitch } : x)))} />
                </div>
              ))}
            </Panel>
          )}

          {tab === 'faq' && (
            <Panel title="Savol-javoblar" desc="Boş sahifada hammasi, kurs sahifalarida birinçi 5 tasi körinadi.">
              <ListEditor
                items={c.faq}
                onChange={(faq) => set('faq', faq)}
                title={(f) => f.q}
                addLabel="Savol qöşiş"
                make={() => ({ q: 'Yangi savol?', a: '' })}
                render={(f, upd) => (
                  <>
                    <Text label="Savol" value={f.q} max={200} onChange={(q) => upd({ ...f, q })} />
                    <Area label="Javob" value={f.a} max={1200} rows={4} onChange={(a) => upd({ ...f, a })} />
                  </>
                )}
              />
            </Panel>
          )}

          {tab === 'about' && (
            <Panel title="“Biz haqimizda” sahifasi">
              <Text label="Sarlavha" value={c.about.title} max={140} onChange={(title) => set('about', { ...c.about, title })} />
              <Area label="Matn" value={c.about.text} max={1500} rows={6} onChange={(text) => set('about', { ...c.about, text })} />
              {shared && <Media label="Rasm" kind="image" aspect="aspect-[4/3]" value={c.about.image} onChange={(image) => set('about', { ...c.about, image })} />}
              <Field label="Qadriyatlar kartalari">
                <CardsEditor items={c.about.values} onChange={(values) => set('about', { ...c.about, values })} addLabel="Karta qöşiş" />
              </Field>
            </Panel>
          )}

          {tab === 'headings' && (
            <Panel title="Bölim sarlavhalari" desc="Har bir bölimning kiçik yozuvi, sarlavhasi va tavsifi. Böş qoldirilgan maydon körsatilmaydi.">
              {(Object.keys(sectionNames) as SectionKey[]).map((k) => {
                const s = c.sections[k]
                const upd = (v: typeof s) => set('sections', { ...c.sections, [k]: v })
                return (
                  <div key={k} className="space-y-3 rounded-xl bg-surface/60 p-4">
                    <div className="text-sm font-bold text-ink-900">{sectionNames[k]}</div>
                    <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                      <Text label="Kiçik yozuv" value={s.eyebrow} max={40} onChange={(eyebrow) => upd({ ...s, eyebrow })} />
                      <Text label="Sarlavha" value={s.title} max={120} onChange={(title) => upd({ ...s, title })} />
                    </div>
                    <Area label="Tavsif" value={s.subtitle} max={400} rows={2} onChange={(subtitle) => upd({ ...s, subtitle })} />
                  </div>
                )
              })}
            </Panel>
          )}

          {tab === 'history' && (
            <Panel title="Versiyalar tarixi" desc="Har saqlaşda oldingi holat şu yerda saqlanadi (oxirgi 30 tasi). Xato qilsangiz — tiklang.">
              {history.length ? (
                <ul className="divide-y divide-slate-100">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-center gap-3 py-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-xs font-bold">v{h.version}</span>
                      <span className="flex-1 text-sm">{fmtDate(h.savedAt)}</span>
                      <button type="button" disabled={saving} onClick={() => restore(h.id)} className="btn-ghost py-2"><RotateCcw className="h-4 w-4" /> Tiklaş</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl bg-surface p-5 text-center text-sm text-slate-500">Hozirça oldingi versiyalar yöq.</p>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}
