import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clapperboard, Play, Quote, X } from 'lucide-react'
import type { VideoTestimonial } from '../../api/_lib/content'
import { useT } from '../i18n'

const hasVideo = (v: VideoTestimonial) => !!(v.src || v.youtubeId)
// Only accept plain YouTube ids so nothing else can be injected into the embed URL.
const safeYt = (id?: string) => (id && /^[\w-]{6,20}$/.test(id) ? id : undefined)

function Player({ item, onClose }: { item: VideoTestimonial; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  const t = useT()
  const yt = safeYt(item.youtubeId)
  return (
    <m.div
      className="fixed inset-0 z-[100] grid place-items-center bg-ink-900/85 p-4 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name ? `${item.name} — ${t('video.review')}` : t('video.review')}
    >
      <m.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        className="relative aspect-[9/16] h-[min(85dvh,760px)] max-w-full overflow-hidden rounded-3xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {yt ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={item.name ?? t('video.review')}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        ) : (
          <video className="h-full w-full object-cover" src={item.src} poster={item.poster} controls autoPlay playsInline />
        )}
        <button type="button" onClick={onClose} aria-label={t('video.close')} className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80">
          <X className="h-5 w-5" />
        </button>
      </m.div>
    </m.div>
  )
}

function Card({ item, onPlay }: { item: VideoTestimonial; onPlay: () => void; key?: number }) {
  const t = useT()
  const yt = safeYt(item.youtubeId)
  const cover = item.poster ?? (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : undefined)
  const ready = hasVideo(item)
  const meta = [item.age ? t('video.age', { n: item.age }) : null, item.course ? t('video.course', { c: item.course }) : null, item.role].filter(Boolean).join(' · ')
  return (
    <figure className="w-[220px] shrink-0 snap-start sm:w-[240px]">
      <button
        type="button"
        onClick={ready ? onPlay : undefined}
        disabled={!ready}
        aria-label={ready ? `${item.name ?? t('video.review')} — ${t('video.watch')}` : t('video.soon')}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-ink-800 to-brand-900 text-left disabled:cursor-default"
      >
        {cover ? (
          <img src={cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="bg-grid-dark absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          {ready ? (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-xl transition group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-brand-600 text-brand-600" />
            </span>
          ) : (
            <span className="flex flex-col items-center gap-2 text-white/70">
              <Clapperboard className="h-9 w-9" />
              <span className="text-xs font-semibold tracking-wide uppercase">{t('video.soon')}</span>
            </span>
          )}
        </div>
        {item.quote && (
          <p className="absolute right-4 bottom-4 left-4 line-clamp-3 text-sm font-medium text-white">
            <Quote className="mb-1 h-4 w-4 text-lime-accent" />
            {item.quote}
          </p>
        )}
      </button>
      <figcaption className="mt-3 px-1">
        <div className="font-display font-bold text-slate-900">{item.name ?? t(item.role ? 'video.parent' : 'video.student')}</div>
        {meta && <div className="text-xs text-slate-600">{meta}</div>}
      </figcaption>
    </figure>
  )
}

export function VideoTestimonials({ items }: { items: VideoTestimonial[] }) {
  const [active, setActive] = useState<VideoTestimonial | null>(null)
  const t = useT()
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 260, behavior: 'smooth' })
  return (
    <div className="relative">
      <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-5">
        {items.map((it, i) => <Card key={i} item={it} onPlay={() => setActive(it)} />)}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={() => scroll(-1)} aria-label={t('video.prev')} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white hover:border-slate-300"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={() => scroll(1)} aria-label={t('video.next')} className="grid h-11 w-11 place-items-center rounded-full bg-ink-900 text-white hover:bg-ink-700"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <AnimatePresence>{active && <Player item={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </div>
  )
}
