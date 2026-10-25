import { Link } from 'react-router-dom'
import { BrainCircuit, Heart, Presentation, Sparkles, Target, Users } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { useContent } from '../content/ContentContext'
import { usePageTitle } from '../lib/usePageTitle'
import { useLp, useT } from '../i18n'

const icons = [Target, Presentation, BrainCircuit, Heart, Users, Sparkles]

export function About() {
  const t = useT()
  const lp = useLp()
  usePageTitle(t('about.eyebrow'))
  const { about } = useContent()
  return (
    <div className="pb-16">
      <section className="px-3 pt-3">
        <div className="container-x grid items-center gap-10 rounded-[32px] bg-white py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="eyebrow">{t('about.eyebrow')}</div>
            <h1 className="h-display mt-6 text-4xl text-ink-900 sm:text-6xl">{about.title}</h1>
            <p className="mt-6 text-lg leading-relaxed whitespace-pre-line text-slate-600">{about.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={lp('/kurslar')} className="btn-primary">{t('about.courses')}</Link>
              <Link to={lp('/#ariza')} className="btn-ghost">{t('about.trial')}</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px]">
            <img src={about.image} alt={t('about.imgAlt')} width={900} height={1117} className="aspect-[4/3] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
      {about.values.length > 0 && (
        <section className="py-16">
          <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v, i) => {
              const Icon = icons[i % icons.length]
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/70">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><Icon className="h-6 w-6" /></span>
                    <h3 className="mt-5 font-display text-xl font-extrabold text-ink-900">{v.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{v.text}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
