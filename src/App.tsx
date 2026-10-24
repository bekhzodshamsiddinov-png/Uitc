import { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { CourseDetail } from './pages/CourseDetail'
import { Checkout } from './pages/Checkout'
import { Auth } from './pages/Auth'
import { Cabinet } from './pages/Cabinet'
import { Pricing } from './pages/Pricing'
import { About } from './pages/About'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'

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
          <Route path="tolov/:slug" element={<Checkout />} />
          <Route path="narxlar" element={<Pricing />} />
          <Route path="biz-haqimizda" element={<About />} />
          <Route path="maxfiylik" element={<Legal doc="privacy" />} />
          <Route path="oferta" element={<Legal doc="offer" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="kirish" element={<Auth mode="login" />} />
        <Route path="royxatdan-otish" element={<Auth mode="register" />} />
        <Route path="kabinet" element={<Cabinet />} />
      </Routes>
    </BrowserRouter>
  )
}
