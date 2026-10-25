import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Logo } from './Logo'
import { courses, phones, telHref } from '../data/courses'

export function Footer() {
  return (
    <footer className="px-3 pb-3">
      <div className="container-x overflow-hidden rounded-3xl bg-ink-900 text-slate-300">
        <div className="grid gap-12 px-2 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
              6 yildan beri 7 yoshdan 50 yoshgacha bo‘lganlarga IT kasblarini jonli darslarda o‘rgatamiz.
            </p>
            <Link to="/#ariza" className="btn-primary mt-6">Konsultatsiya olish</Link>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Kurslar</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {courses.map((c) => (
                <li key={c.slug}><Link to={`/kurs/${c.slug}`} className="hover:text-white">{c.short}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Akademiya</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/biz-haqimizda" className="hover:text-white">Biz haqimizda</Link></li>
              <li><Link to="/#fikrlar" className="hover:text-white">O‘quvchilar fikrlari</Link></li>
              <li><Link to="/#savollar" className="hover:text-white">Savol-javob</Link></li>
              <li><Link to="/maxfiylik" className="hover:text-white">Maxfiylik siyosati</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Bog‘lanish</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {phones.map((p) => (
                <li key={p}>
                  <a href={telHref(p)} className="inline-flex items-center gap-2.5 font-semibold text-white hover:text-brand-300">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5"><Phone className="h-4 w-4 text-brand-400" /></span>
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-2 py-6 text-xs text-slate-500 sm:px-6">
          © {new Date().getFullYear()} UITC IT akademiyasi. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  )
}
