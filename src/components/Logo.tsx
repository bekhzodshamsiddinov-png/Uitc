import { Link } from 'react-router-dom'

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="UITC bosh sahifa">
      <span className={`relative grid h-10 w-10 place-items-center rounded-xl transition-transform group-hover:-rotate-6 ${dark ? 'bg-white/10' : 'bg-ink-900'}`}>
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <path d="M18 18v16a14 14 0 0 0 28 0V18" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
          <circle cx="47" cy="47" r="6.5" fill="#ff5b1a" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-display text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}>
          UITC<span className="text-brand-500">.</span>
        </span>
        <span className={`block text-[10px] font-semibold tracking-[0.18em] uppercase ${dark ? 'text-slate-400' : 'text-slate-500'}`}>IT akademiya</span>
      </span>
    </Link>
  )
}
