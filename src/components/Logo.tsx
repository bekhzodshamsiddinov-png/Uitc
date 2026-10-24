import { Link } from 'react-router-dom'

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="UITC bosh sahifa">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-700 shadow-[0_6px_18px_-6px_rgba(67,56,202,0.8)] transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <path d="M18 18v16a14 14 0 0 0 28 0V18" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
          <circle cx="47" cy="47" r="6" fill="#b6f23a" />
        </svg>
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}>
        UITC<span className="text-brand-500">.</span>
      </span>
    </Link>
  )
}
