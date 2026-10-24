import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFound() {
  usePageTitle('Sahifa topilmadi')
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <div className="h-display bg-gradient-to-r from-brand-600 to-fuchsia-600 bg-clip-text text-8xl text-transparent">404</div>
        <h1 className="h-display mt-4 text-3xl">Sahifa topilmadi</h1>
        <p className="mt-3 text-slate-600">Siz qidirgan sahifa mavjud emas yoki ko‘chirilgan.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Bosh sahifa</Link>
          <Link to="/kurslar" className="btn-ghost">Kurslar</Link>
        </div>
      </div>
    </div>
  )
}
