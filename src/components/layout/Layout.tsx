import { Suspense, lazy, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from '../ui/Toaster'
import { useAnnouncementVisible } from '../../store/announce'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileDrawer } from './MobileDrawer'
import { openOverlay } from '../../store/stores'
import { useOverlay } from '../../hooks/useStores'
import { QuickViewModal } from '../product/QuickViewModal'
import { CartDrawer } from '../cart/CartDrawer'

const SearchOverlay = lazy(() => import('../search/SearchOverlay'))

function useGlobalShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault()
        openOverlay('search')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) return void el.scrollIntoView()
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function Layout() {
  const { pathname } = useLocation()
  const announce = useAnnouncementVisible()
  const searchOpen = useOverlay().kind === 'search'
  useGlobalShortcuts()
  const home = pathname === '/'
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1} className={`outline-none ${home ? '' : announce ? 'pt-[100px] lg:pt-[152px]' : 'pt-16 lg:pt-[116px]'}`}>
        <Suspense fallback={<div className="min-h-[70dvh]" aria-busy="true" />}><Outlet /></Suspense>
      </main>
      <Footer />
      <MobileDrawer />
      <CartDrawer />
      <QuickViewModal />
      {searchOpen && <Suspense fallback={null}><SearchOverlay /></Suspense>}
      <Toaster />
    </>
  )
}
