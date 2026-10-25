import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, Send, X } from 'lucide-react'
import { Logo } from './Logo'
import { phones, telHref } from '../data/courses'
import { contact } from '../data/contact'

const nav = [
  { to: '/kurslar', label: 'Kurslar' },
  { to: '/#kim-uchun', label: 'Kim uchun' },
  { to: '/#fikrlar', label: 'Fikrlar' },
  { to: '/biz-haqimizda', label: 'Biz haqimizda' },
  { to: '/#manzil', label: 'Manzil' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [loc.pathname, loc.hash])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div
        className={`container-x flex h-16 items-center gap-6 rounded-2xl transition-all duration-300 lg:h-[72px] ${
          scrolled ? 'bg-white/90 shadow-[0_8px_30px_-12px_rgba(12,22,49,0.25)] ring-1 ring-slate-200/70 backdrop-blur-xl' : 'bg-white'
        }`}
      >
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Asosiy menyu">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive && !n.to.includes('#') ? 'text-brand-600' : 'text-slate-700 hover:text-ink-900'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a href={telHref(phones[0])} className="hidden items-center gap-2.5 xl:flex">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600"><Phone className="h-4 w-4" /></span>
            <span className="leading-tight">
              <span className="block text-[11px] text-slate-500">Aloqa uchun</span>
              <span className="block text-sm font-bold text-ink-900">{phones[0]}</span>
            </span>
          </a>
          <a href={contact.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Telegram orqali yozish" className="hidden h-10 w-10 place-items-center rounded-full bg-[#229ED9]/10 text-[#229ED9] transition hover:bg-[#229ED9] hover:text-white md:grid">
            <Send className="h-4 w-4" />
          </a>
          <Link to="/#ariza" className="btn-dark hidden py-2.5 sm:inline-flex">Ariza qoldirish</Link>
          <a href={telHref(phones[0])} aria-label="Qo‘ng‘iroq qilish" className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white sm:hidden">
            <Phone className="h-4 w-4" />
          </a>
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="container-x mt-2 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 lg:hidden"
          >
            <div className="flex flex-col">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="border-b border-slate-100 py-3.5 text-base font-semibold last:border-0">
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              {phones.map((p) => (
                <a key={p} href={telHref(p)} className="btn-ghost"><Phone className="h-4 w-4" /> {p}</a>
              ))}
              <a href={contact.telegramUrl} target="_blank" rel="noopener noreferrer" className="btn bg-[#229ED9] text-white"><Send className="h-4 w-4" /> Telegram: @{contact.telegram}</a>
              <Link to="/#ariza" className="btn-primary">Ariza qoldirish</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
