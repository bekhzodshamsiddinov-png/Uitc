import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { CourseDetail } from './pages/CourseDetail'
import { About } from './pages/About'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'
import { TelegramFab } from './components/Location'
import { useLang, useT } from './i18n'
import { UI } from './i18n/ui'

// Admin panel is a separate chunk: public visitors never download its code.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) return el.scrollIntoView({ behavior: 'smooth' })
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// Keeps <html lang> and the meta description in sync with the page language.
function LangMeta() {
  const lang = useLang()
  useEffect(() => {
    document.documentElement.lang = lang
    document.querySelector('meta[name="description"]')?.setAttribute('content', UI[lang]['meta.desc'])
  }, [lang])
  return null
}

function Layout() {
  const t = useT()
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only z-[100] rounded-lg bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        {t('skip')}
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TelegramFab />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <LangMeta />
      <Routes>
        {['/', '/ru', '/en'].map((base) => (
          <Route key={base} path={base} element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="kurslar" element={<Catalog />} />
            <Route path="kurs/:slug" element={<CourseDetail />} />
            <Route path="biz-haqimizda" element={<About />} />
            <Route path="maxfiylik" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ))}
        <Route
          path="admin/*"
          element={
            <Suspense fallback={<div className="min-h-dvh bg-ink-900" />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
