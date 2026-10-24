import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { Logo } from './Logo'
import { categories } from '../data/courses'

const nav = [
  { to: '/kurslar', label: 'Kurslar' },
  { to: '/#qanday', label: 'Qanday o‘qiymiz' },
  { to: '/narxlar', label: 'Narxlar' },
  { to: '/biz-haqimizda', label: 'Biz haqimizda' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [q, setQ] = useState('')
  const loc = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setCatOpen(false)
  }, [loc.pathname, loc.hash])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/kurslar?q=${encodeURIComponent(q.trim().slice(0, 80))}` : '/kurslar')
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-slate-200/70 bg-white/80 backdrop-blur-xl' : 'bg-white/0'
      }`}
    >
      <div className="container-x flex h-16 items-center gap-6 lg:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Asosiy menyu">
          <div className="relative" onMouseLeave={() => setCatOpen(false)}>
            <button
              type="button"
              onMouseEnter={() => setCatOpen(true)}
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Yo‘nalishlar <ChevronDown className={`h-4 w-4 transition ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 w-[420px] pt-2"
                >
                  <div className="card grid grid-cols-2 gap-1 p-2 shadow-2xl shadow-slate-900/10">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/kurslar?yonalish=${c.id}`}
                        className="rounded-xl p-3 transition hover:bg-brand-50"
                      >
                        <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.short}</div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive && !n.to.includes('#') ? 'text-brand-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 md:block" role="search">
          <label className="relative block">
            <span className="sr-only">Kurs qidirish</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              maxLength={80}
              placeholder="Kurs qidirish…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:outline-none"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link to="/kirish" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 sm:inline-flex">
            Kirish
          </Link>
          <Link to="/royxatdan-otish" className="btn-primary hidden py-2.5 sm:inline-flex">
            Bepul boshlash
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100dvh - 64px)' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-y-auto border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="container-x space-y-6 py-6">
              <form onSubmit={submit} role="search">
                <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} placeholder="Kurs qidirish…" className="input" />
              </form>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <Link key={c.id} to={`/kurslar?yonalish=${c.id}`} className="rounded-xl bg-slate-50 p-3">
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.short}</div>
                  </Link>
                ))}
              </div>
              <div className="flex flex-col">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} className="border-b border-slate-100 py-3.5 text-base font-semibold">
                    {n.label}
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/kirish" className="btn-ghost">Kirish</Link>
                <Link to="/royxatdan-otish" className="btn-primary">Bepul boshlash</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
