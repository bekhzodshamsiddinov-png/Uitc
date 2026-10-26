import { useCallback, useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { ExternalLink, Inbox, LayoutDashboard, Loader2, LogOut, Menu, PenSquare, ShieldCheck, X } from 'lucide-react'
import { BrandMark } from '../components/Logo'
import { api, ApiError, type Lead, type SessionInfo } from './api'
import { Login } from './Login'
import { Dashboard } from './Dashboard'
import { Leads } from './Leads'
import { Security } from './Security'
import { ContentEditor } from './ContentEditor'
import { ContentProvider } from '../content/ContentContext'
import { DEFAULT_CONTENT } from '../content/defaults'
import type { SiteContent } from '../../api/_lib/content'

const nav = [
  { to: '/admin', label: 'Boş panel', icon: LayoutDashboard, end: true },
  { to: '/admin/arizalar', label: 'Arizalar', icon: Inbox },
  { to: '/admin/kontent', label: 'Sayt kontenti', icon: PenSquare },
  { to: '/admin/xavfsizlik', label: 'Xavfsizlik', icon: ShieldCheck },
]

export default function AdminApp() {
  const [session, setSession] = useState<SessionInfo | null | undefined>(undefined)
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [loadError, setLoadError] = useState('')
  const [menu, setMenu] = useState(false)
  const [site, setSite] = useState<SiteContent>(DEFAULT_CONTENT)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Boşqaruv paneli — United IT Clubs'
  }, [])

  const checkSession = useCallback(async () => {
    try {
      setSession(await api<SessionInfo>('session'))
    } catch {
      setSession(null)
    }
  }, [])

  const loadLeads = useCallback(async () => {
    setLoadError('')
    try {
      const r = await api<{ leads: Lead[] }>('leads')
      setLeads(r.leads)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return setSession(null)
      setLoadError('Arizalarni yuklab bölmadi.')
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (session && !session.mustChangePassword) {
      loadLeads()
      api<{ stored: { content: SiteContent } | null }>('content').then((r) => r.stored && setSite({ ...DEFAULT_CONTENT, ...r.stored.content })).catch(() => {})
    }
  }, [session, loadLeads])

  // Sign out automatically when the 8h session expires.
  useEffect(() => {
    if (!session) return
    const t = setTimeout(() => setSession(null), Math.max(0, session.expiresAt - Date.now()))
    return () => clearTimeout(t)
  }, [session])

  const logout = async () => {
    try {
      await api('logout', { method: 'POST' })
    } finally {
      setSession(null)
      setLeads(null)
      navigate('/admin')
    }
  }

  if (session === undefined) {
    return <div className="grid min-h-dvh place-items-center bg-ink-900"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>
  }
  if (session === null) return <Login onDone={checkSession} />

  const newCount = leads?.filter((l) => l.status === 'new').length ?? 0
  const onUpdate = (l: Lead) => setLeads((prev) => prev?.map((x) => (x.key === l.key ? l : x)) ?? prev)
  const onDelete = (key: string) => setLeads((prev) => prev?.filter((x) => x.key !== key) ?? prev)

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-ink-900 p-4 text-slate-300">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <BrandMark className="h-9 w-9" color="#ffffff" />
        <div className="leading-none">
          <div className="font-brand text-[15px] font-semibold tracking-wide text-white uppercase">United IT Clubs</div>
          <div className="mt-1 text-[11px] text-slate-500">Boşqaruv paneli</div>
        </div>
      </div>
      <nav className="mt-8 space-y-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setMenu(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <n.icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{n.label}</span>
            {n.to === '/admin/arizalar' && newCount > 0 && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">{newCount}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" /> Saytni oçiş
        </a>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Çiqiş
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-dvh bg-surface">
      <div className="sticky top-0 hidden h-dvh lg:block">{sidebar}</div>
      {menu && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full">{sidebar}</div>
          <button type="button" aria-label="Menyuni yopiş" className="flex-1 bg-black/50" onClick={() => setMenu(false)} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setMenu(true)} aria-label="Menyu" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200">
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <BrandMark className="h-8 w-8" />
          <span className="font-brand font-semibold tracking-wide uppercase">UITC Admin</span>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">
          <ContentProvider value={site}>
          {session.mustChangePassword ? (
            <Security session={session} onChanged={checkSession} forced />
          ) : (
            <Routes>
              <Route index element={<Dashboard leads={leads} error={loadError} onReload={loadLeads} />} />
              <Route path="arizalar" element={<Leads leads={leads} error={loadError} onReload={loadLeads} onUpdate={onUpdate} onDelete={onDelete} />} />
              <Route path="kontent" element={<ContentEditor onPublished={(c) => setSite({ ...DEFAULT_CONTENT, ...c })} />} />
              <Route path="xavfsizlik" element={<Security session={session} onChanged={checkSession} />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          )}
          </ContentProvider>
        </main>
      </div>
    </div>
  )
}
