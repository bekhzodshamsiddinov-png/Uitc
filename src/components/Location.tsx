import { useState } from 'react'
import { MapPin, Navigation, Phone, Send } from 'lucide-react'
import { mapLinks as links, telegramUrl, telHref, useContent } from '../content/ContentContext'
import { useT } from '../i18n'

// The Google map only loads after a click, so visitors are not tracked by a
// third party just for opening the page.
export function Location() {
  const [showMap, setShowMap] = useState(false)
  const { contact } = useContent()
  const phones = contact.phones
  const mapLinks = links(contact)
  const t = useT()
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col rounded-3xl bg-ink-900 p-8 text-white sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600"><MapPin className="h-6 w-6" /></span>
        <h3 className="h-display mt-6 text-3xl">{t('loc.visit')}</h3>
        <p className="mt-3 text-lg font-semibold">{contact.city}</p>
        <p className="text-slate-400">{contact.landmark}</p>
        <div className="mt-8 space-y-3">
          {phones.map((p) => (
            <a key={p} href={telHref(p)} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 font-semibold transition hover:bg-white/10">
              <Phone className="h-4 w-4 text-brand-400" /> {p}
            </a>
          ))}
          <a href={telegramUrl(contact)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-[#229ED9] px-4 py-3 font-semibold transition hover:brightness-110">
            <Send className="h-4 w-4" /> Telegram: @{contact.telegram}
          </a>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-8">
          <a href={mapLinks.google} target="_blank" rel="noopener noreferrer" className="btn bg-white text-ink-900 hover:bg-slate-100"><Navigation className="h-4 w-4" /> Google Maps</a>
          <a href={mapLinks.yandex} target="_blank" rel="noopener noreferrer" className="btn border border-white/20 text-white hover:bg-white/10"><Navigation className="h-4 w-4" /> Yandex Maps</a>
        </div>
      </div>
      <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70">
        {showMap ? (
          <iframe
            title={t('loc.mapTitle')}
            src={mapLinks.embed}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <button type="button" onClick={() => setShowMap(true)} className="group absolute inset-0 grid place-items-center bg-surface">
            <div className="bg-grid absolute inset-0 opacity-70" />
            <div className="relative flex flex-col items-center text-center">
              <span className="relative grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-white shadow-[0_12px_30px_-10px_rgba(240,66,10,0.8)] transition group-hover:scale-110">
                <MapPin className="h-7 w-7" />
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/30" />
              </span>
              <span className="mt-5 font-display text-lg font-bold text-ink-900">{t('loc.showMap')}</span>
              <span className="text-sm text-slate-500">{contact.city} · {contact.landmark}</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export function TelegramFab() {
  const { contact } = useContent()
  const t = useT()
  return (
    <a
      href={telegramUrl(contact)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('header.telegram')}
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-[#229ED9] py-3 pr-5 pl-4 font-semibold text-white shadow-[0_14px_30px_-10px_rgba(34,158,217,0.8)] transition hover:-translate-y-0.5 hover:brightness-110 sm:right-6 sm:bottom-6"
    >
      <Send className="h-5 w-5" /> <span className="hidden sm:inline">{t('fab.ask')}</span>
    </a>
  )
}
