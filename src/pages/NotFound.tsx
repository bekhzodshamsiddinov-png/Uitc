import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'
import { useLp, useT } from '../i18n'

export function NotFound() {
  const t = useT()
  const lp = useLp()
  usePageTitle(t('nf.title'))
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <div className="h-display bg-gradient-to-r from-brand-600 to-fuchsia-600 bg-clip-text text-8xl text-transparent">404</div>
        <h1 className="h-display mt-4 text-3xl">{t('nf.title')}</h1>
        <p className="mt-3 text-slate-600">{t('nf.text')}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={lp('/')} className="btn-primary">{t('nf.home')}</Link>
          <Link to={lp('/kurslar')} className="btn-ghost">{t('nf.courses')}</Link>
        </div>
      </div>
    </div>
  )
}
