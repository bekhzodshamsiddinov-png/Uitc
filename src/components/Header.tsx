import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Globe, Menu, Phone, Send, X } from 'lucide-react'
import { Logo } from './Logo'
import { telegramUrl, telHref, useContent } from '../content/ContentContext'
import { LANG_LABELS, stripLang, useLang, useLp, useT, withLang } from '../i18n'
import { LANGS, type Lang } from '../../api/_lib/content'
import type { UiKey } from '../i18n/ui'

const nav: { to: string; label: UiKey }[] = [
  { to: '/kurslar', label: 'nav.courses' },
  { to: '/#kim-uchun', label: 'nav.audiences' },
  { to: '/#fikrlar', label: 'nav.reviews' },
  { to: '/biz-haqimizda', label: 'nav.about' },
  { to: '/#manzil', label: 'nav.location' },
]

const LANG_KEY = 'uitc-lang'
const remember = (l: Lang) => {
  try { localStorage.setItem(LANG_KEY, l) } catch { /* storage may be blocked */ }
}

/** Same page in another language: "/ru/kurs/ai" → "/en/kurs/ai". */
function useSwitchHref() {
  const loc = useLocation()
  return (l: Lang) => withLang(l, stripLang(loc.pathname)) + loc.search + loc.hash
}

function LangSwitch() {
  const lang = useLang()
  const t = useT()
  const href = useSwitchHref()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])
  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('nav.language')}
        className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-bold text-ink-900 transition hover:border-slate-300"
      >
        <Globe className="h-4 w-4 text-slate-500" /> {LANG_LABELS[lang].short} <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl ring-1 ring-slate-200">
          {LANGS.map((l) => (
            <Link
              key={l}
              role="menuitem"
              to={href(l)}
              hrefLang={l}
              lang={l}
              onClick={() => remember(l)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${l === lang ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-surface'}`}
            >
              <span className="w-7 text-xs font-bold text-slate-400">{LANG_LABELS[l].short}</span>
              <span className="flex-1">{LANG_LABELS[l].name}</span>
              {l === lang && <Check className="h-4 w-4" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/** Compact UZ · RU · EN row for the mobile menu. */
function LangRow() {
  const lang = useLang()
  const href = useSwitchHref()
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface p-1">
      {LANGS.map((l) => (
        <Link key={l} to={href(l)} hrefLang={l} lang={l} onClick={() => remember(l)} aria-current={l === lang ? 'true' : undefined} className={`rounded-lg py-2.5 text-center text-sm font-bold transition ${l === lang ? 'bg-white text-ink-900 shadow-sm' : 'text-slate-500'}`}>
          {LANG_LABELS[l].name}
        </Link>
      ))}
    </div>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  const { contact } = useContent()
  const phones = contact.phones
  const t = useT()
  const lp = useLp()

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

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.main')}>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={lp(n.to)}
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive && !n.to.includes('#') ? 'text-brand-600' : 'text-slate-700 hover:text-ink-900'
                }`
              }
            >
              {t(n.label)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a href={telHref(phones[0])} className="hidden items-center gap-2.5 xl:flex">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600"><Phone className="h-4 w-4" /></span>
            <span className="leading-tight">
              <span className="block text-[11px] text-slate-500">{t('header.contact')}</span>
              <span className="block text-sm font-bold text-ink-900">{phones[0]}</span>
            </span>
          </a>
          <a href={telegramUrl(contact)} target="_blank" rel="noopener noreferrer" aria-label={t('header.telegram')} className="hidden h-10 w-10 place-items-center rounded-full bg-[#229ED9]/10 text-[#229ED9] transition hover:bg-[#229ED9] hover:text-white md:grid">
            <Send className="h-4 w-4" />
          </a>
          <LangSwitch />
          <Link to={lp('/#ariza')} className="btn-dark hidden py-2.5 sm:inline-flex">{t('header.apply')}</Link>
          <a href={telHref(phones[0])} aria-label={t('header.call')} className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white sm:hidden">
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('header.menuClose') : t('header.menuOpen')}
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
                <Link key={n.to} to={lp(n.to)} className="border-b border-slate-100 py-3.5 text-base font-semibold last:border-0">
                  {t(n.label)}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              <LangRow />
              {phones.map((p) => (
                <a key={p} href={telHref(p)} className="btn-ghost"><Phone className="h-4 w-4" /> {p}</a>
              ))}
              <a href={telegramUrl(contact)} target="_blank" rel="noopener noreferrer" className="btn bg-[#229ED9] text-white"><Send className="h-4 w-4" /> Telegram: @{contact.telegram}</a>
              <Link to={lp('/#ariza')} className="btn-primary">{t('header.apply')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
