import { lazy, Suspense, useEffect, useRef, useState } from 'react'
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
import { PageErrorBoundary } from './components/ErrorBoundary'
import { useT } from './i18n'
import { useMasterContent } from './content/ContentContext'
import { applySeo, seoFor } from './seo/seo'
import { MotionOff } from './lib/motion'
import { domAnimation, LazyMotion } from 'framer-motion'

// Admin panel is a separate chunk: public visitors never download its code.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // Never return scrollIntoView's result: newer Chrome returns a Promise, and
    // React would call it as the effect cleanup on the next navigation and crash
    // the whole page (the "white screen until refresh" bug).
    const el = hash ? document.getElementById(hash.slice(1)) : null
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// Keeps <head> (title, description, canonical, hreflang, JSON-LD) in sync on navigation.
function SeoHead() {
  const { pathname } = useLocation()
  const master = useMasterContent()
  useEffect(() => {
    if (!pathname.startsWith('/admin')) applySeo(seoFor(pathname, master, location.origin))
  }, [pathname, master])
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
        <PageErrorBoundary>
          <Outlet />
        </PageErrorBoundary>
      </main>
      <Footer />
      <TelegramFab />
    </div>
  )
}

/**
 * Routes shared by the browser app and the build-time prerender.
 * `staticFirstPage`: the page is already on screen as prerendered HTML, so its
 * entrance animations are skipped until the visitor navigates elsewhere.
 */
export function AppRoutes({ staticFirstPage = false }: { staticFirstPage?: boolean }) {
  const { pathname } = useLocation()
  const first = useRef(pathname)
  const [motionOff, setMotionOff] = useState(staticFirstPage)
  useEffect(() => {
    if (pathname !== first.current) setMotionOff(false)
  }, [pathname])
  return (
    // LazyMotion + `m` components load only the animation features we use (~1/3 of framer-motion).
    <LazyMotion features={domAnimation} strict>
    <MotionOff.Provider value={motionOff}>
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
    </MotionOff.Provider>
    </LazyMotion>
  )
}

export function App({ prerendered = false }: { prerendered?: boolean }) {
  return (
    <BrowserRouter>
      <ScrollManager />
      <SeoHead />
      <AppRoutes staticFirstPage={prerendered} />
    </BrowserRouter>
  )
}
