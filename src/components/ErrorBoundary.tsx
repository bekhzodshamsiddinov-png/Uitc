import { Component, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, RotateCw } from 'lucide-react'
import { useLp, useT } from '../i18n'

interface Labels { title: string; text: string; reload: string; back: string; home: string; homeHref: string }

class Boundary extends Component<{ labels: Labels; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    const l = this.props.labels
    return (
      <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center" role="alert">
        <div className="max-w-md">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><AlertTriangle className="h-7 w-7" /></span>
          <h1 className="h-display mt-6 text-3xl text-ink-900">{l.title}</h1>
          <p className="mt-3 text-slate-600">{l.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => location.reload()} className="btn-primary"><RotateCw className="h-4 w-4" /> {l.reload}</button>
            <button type="button" onClick={() => history.back()} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> {l.back}</button>
            <a href={l.homeHref} className="btn-ghost">{l.home}</a>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * If a page ever fails to render, show a friendly message with reload/back
 * buttons instead of a blank screen. Resets on every navigation.
 */
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const t = useT()
  const lp = useLp()
  const labels = { title: t('err.title'), text: t('err.text'), reload: t('err.reload'), back: t('err.back'), home: t('nf.home'), homeHref: lp('/') }
  return <Boundary key={pathname} labels={labels}>{children}</Boundary>
}
