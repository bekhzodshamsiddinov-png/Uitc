import { usePageTitle } from '../lib/usePageTitle'
import { useT } from '../i18n'

const sections = [
  ['legal.h1', 'legal.p1'],
  ['legal.h2', 'legal.p2'],
  ['legal.h3', 'legal.p3'],
  ['legal.h4', 'legal.p4'],
] as const

export function Legal() {
  const t = useT()
  usePageTitle(t('legal.title'))
  return (
    <div className="container-x max-w-3xl py-16 lg:py-24">
      <h1 className="h-display text-4xl text-ink-900">{t('legal.title')}</h1>
      <p className="mt-3 text-sm text-slate-500">{t('legal.draft')}</p>
      <div className="mt-10 space-y-8">
        {sections.map(([h, p]) => (
          <section key={h}>
            <h2 className="font-display text-xl font-bold">{t(h)}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{t(p)}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
