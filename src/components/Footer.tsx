import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Send, Instagram, Youtube } from 'lucide-react'
import { Logo } from './Logo'
import { categories } from '../data/courses'

export function Footer() {
  return (
    <footer className="bg-ink-900 text-slate-300">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            6 yildan beri IT mutaxassislarni tayyorlab kelayotgan ta’lim markazi. Endi — istalgan joydan,
            o‘zingizga qulay vaqtda online o‘qing.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { icon: Send, label: 'Telegram' },
              { icon: Instagram, label: 'Instagram' },
              { icon: Youtube, label: 'YouTube' },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Yo‘nalishlar</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/kurslar?yonalish=${c.id}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Kompaniya</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/biz-haqimizda" className="hover:text-white">Biz haqimizda</Link></li>
            <li><Link to="/narxlar" className="hover:text-white">Narxlar va obuna</Link></li>
            <li><Link to="/kurslar" className="hover:text-white">Barcha kurslar</Link></li>
            <li><Link to="/maxfiylik" className="hover:text-white">Maxfiylik siyosati</Link></li>
            <li><Link to="/oferta" className="hover:text-white">Ommaviy oferta</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Aloqa</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-400" /> +998 (71) 000-00-00</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-400" /> info@uitc.uz</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-brand-400" /> Toshkent sh.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} UITC. Barcha huquqlar himoyalangan.</span>
          <span>To‘lovlar xavfsiz shifrlangan kanal orqali amalga oshiriladi.</span>
        </div>
      </div>
    </footer>
  )
}
