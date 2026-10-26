import { Link } from 'react-router-dom'
import { MARK_PATH, MARK_VIEWBOX } from './markPath'
import { useLp, useT } from '../i18n'

export function BrandMark({ className = 'h-10 w-10', color = '#0B78A6' }: { className?: string; color?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden="true">
      <path fill={color} fillRule="evenodd" d={MARK_PATH} />
    </svg>
  )
}

export function Logo({ dark = false }: { dark?: boolean }) {
  const t = useT()
  const lp = useLp()
  return (
    <Link to={lp('/')} className="group inline-flex items-center gap-2.5" title={t('logo.home')}>
      <BrandMark className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105" color={dark ? '#ffffff' : '#0B78A6'} />
      <span className="leading-none">
        <span className={`block font-brand text-[19px] font-semibold tracking-[0.02em] uppercase ${dark ? 'text-white' : 'text-[#0f1b24]'}`}>United IT Clubs</span>
        <span className={`mt-1 block font-brand text-[9px] font-medium tracking-[0.26em] uppercase ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Programming &amp; Designing</span>
      </span>
    </Link>
  )
}
