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

function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only z-[100] rounded-lg bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Asosiy kontentga o‘tish
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
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="kurslar" element={<Catalog />} />
          <Route path="kurs/:slug" element={<CourseDetail />} />
          <Route path="biz-haqimizda" element={<About />} />
          <Route path="maxfiylik" element={<Legal doc="privacy" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
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
