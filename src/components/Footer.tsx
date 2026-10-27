import { Link } from 'react-router-dom'
import { MapPin, Phone, Send } from 'lucide-react'
import { Logo } from './Logo'
import { mapLinks, telegramUrl, telHref, useContent, useCourses } from '../content/ContentContext'
import { useLp, useT } from '../i18n'

export function Footer() {
  const { contact } = useContent()
  const courses = useCourses()
  const phones = contact.phones
  const t = useT()
  const lp = useLp()
  return (
    <footer className="px-3 pb-3">
      <div className="container-x overflow-hidden rounded-3xl bg-ink-900 text-slate-300">
        <div className="grid gap-12 px-2 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
              {t('footer.about')}
            </p>
            <Link to={lp('/#ariza')} className="btn-primary mt-6">{t('footer.consult')}</Link>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{t('footer.courses')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {courses.map((c) => (
                <li key={c.slug}><Link to={lp(`/kurs/${c.slug}`)} className="hover:text-white">{c.short}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{t('footer.academy')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to={lp('/biz-haqimizda')} className="hover:text-white">{t('nav.about')}</Link></li>
              <li><Link to={lp('/#fikrlar')} className="hover:text-white">{t('footer.reviews')}</Link></li>
              <li><Link to={lp('/#savollar')} className="hover:text-white">{t('footer.faq')}</Link></li>
              <li><a href="https://smartedu-bay.vercel.app/akademiya" className="hover:text-white">{t('footer.online')}</a></li>
              <li><Link to={lp('/maxfiylik')} className="hover:text-white">{t('footer.privacy')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{t('footer.contact')}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {phones.map((p) => (
                <li key={p}>
                  <a href={telHref(p)} className="inline-flex items-center gap-2.5 font-semibold text-white hover:text-brand-300">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5"><Phone className="h-4 w-4 text-brand-400" /></span>
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a href={telegramUrl(contact)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 font-semibold text-white hover:text-[#5cc2f0]">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5"><Send className="h-4 w-4 text-[#5cc2f0]" /></span>
                  @{contact.telegram}
                </a>
              </li>
              <li>
                <a href={mapLinks(contact).google} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2.5 hover:text-white">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5"><MapPin className="h-4 w-4 text-brand-400" /></span>
                  <span>{contact.city}<br /><span className="text-xs text-slate-400">{contact.landmark}</span></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-2 py-6 text-xs text-slate-400 sm:px-6">
          © {new Date().getFullYear()} United IT Clubs (UITC). {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
