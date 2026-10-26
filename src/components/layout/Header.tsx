import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation } from '../../data/content'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import { useCartBump, useCartTotals, useWishlist } from '../../hooks/useStores'
import { openOverlay } from '../../store/stores'
import { IconButton } from '../ui/Button'
import { AnnouncementBar } from './AnnouncementBar'
import { MegaMenu } from './MegaMenu'
import { Wordmark } from './Wordmark'

type Mega = 'sarees' | 'occasions' | null

export function Header() {
  const { pathname } = useLocation()
  const { hidden, scrolled } = useScrollDirection()
  const reduce = useReducedMotion()
  // the open menu is tied to the route it was opened on, so navigating closes it without an effect
  const [megaState, setMegaState] = useState<{ k: Mega; path: string }>({ k: null, path: pathname })
  const mega = megaState.path === pathname ? megaState.k : null
  const setMega = (v: Mega | ((m: Mega) => Mega)) =>
    setMegaState((s) => ({ k: typeof v === 'function' ? v(s.path === pathname ? s.k : null) : v, path: pathname }))
  const [hover, setHover] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const wishCount = useWishlist().length
  const { count } = useCartTotals()
  const bump = useCartBump()

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname === to.split('?')[0] || pathname.startsWith(to.split('?')[0] + '/'))
  const activeLabel = navigation.primary.find((n) => !n.mega && isActive(n.to))?.label ?? navigation.primary.find((n) => n.mega && isActive(n.to))?.label ?? null
  const shown = hover ?? activeLabel
  const solid = scrolled || !!mega || pathname !== '/'
  const hide = hidden && !mega

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-overlay)] motion-reduce:transition-none ${hide ? '-translate-y-full' : 'translate-y-0'}`}
      onMouseLeave={() => { setMega(null); setHover(null) }}
    >
      <AnnouncementBar />
      <div className={`transition-colors duration-500 ${solid ? 'border-b border-line bg-ivory/97 backdrop-blur-0' : 'border-b border-transparent bg-transparent'}`}>
        <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[72px]">
          <div className="flex items-center">
            <IconButton label="Open menu" className="lg:hidden" onClick={() => openOverlay('menu')}><Menu size={22} /></IconButton>
            <IconButton label="Search" className="lg:hidden" onClick={() => openOverlay('search')}><Search size={21} /></IconButton>
            <button type="button" onClick={() => openOverlay('search')} className="hidden min-h-11 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] hover:text-kumkum lg:flex" aria-label="Search sarees (shortcut: slash)">
              <Search size={18} aria-hidden="true" /> Search <kbd className="rounded border border-line px-1.5 text-[10px] font-medium text-muted">/</kbd>
            </button>
          </div>
          <Wordmark />
          <div className="flex items-center justify-end">
            <Link to="/account" aria-label="Account (demo)" className="hidden size-11 place-items-center rounded-full hover:bg-ink/5 sm:inline-grid"><User size={21} aria-hidden="true" /></Link>
            <Link to="/wishlist" aria-label={`Wishlist, ${wishCount} items`} className="relative inline-grid size-11 place-items-center rounded-full hover:bg-ink/5">
              <Heart size={21} aria-hidden="true" />
              {wishCount > 0 && <span className="t-price absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-kumkum px-1 text-[10px] font-semibold leading-4 text-ivory">{wishCount}</span>}
            </Link>
            <button type="button" aria-label={`Open cart, ${count} items`} onClick={() => openOverlay('cart')} className="relative inline-grid size-11 place-items-center rounded-full hover:bg-ink/5">
              <ShoppingBag size={21} aria-hidden="true" />
              {count > 0 && (
                <motion.span key={bump} initial={reduce ? false : { scale: 1.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className="t-price absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-kumkum px-1 text-[10px] font-semibold leading-4 text-ivory">
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </div>
        <nav ref={navRef} aria-label="Primary" className="relative mx-auto hidden h-11 lg:block">
          <ul className="flex h-full items-center justify-center gap-9">
            {navigation.primary.map((n) => (
              <li
                key={n.label}
                className="relative flex h-full items-center"
                onMouseEnter={() => { setHover(n.label); setMega(n.mega ?? null) }}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { setHover(null); if (n.mega) setMega((m) => (m === n.mega ? null : m)) } }}
                onFocus={() => setHover(n.label)}
                onKeyDown={(e) => { if (e.key === 'Escape') setMega(null) }}
              >
                <Link to={n.to} aria-current={isActive(n.to) && !n.mega ? 'page' : undefined} className="flex min-h-11 items-center text-[12px] font-semibold uppercase tracking-[0.16em] hover:text-kumkum">
                  {n.label}
                </Link>
                {n.mega && (
                  <button type="button" aria-label={`${n.label} menu`} aria-expanded={mega === n.mega} onClick={() => setMega((m) => (m === n.mega ? null : n.mega!))} className="grid size-8 place-items-center">
                    <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-300 ${mega === n.mega ? 'rotate-180' : ''}`} />
                  </button>
                )}
                {shown === n.label && (
                  <motion.span layoutId="nav-thread" aria-hidden="true" className="woven-line absolute inset-x-0 bottom-1.5 h-[2px]" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }} />
                )}
              </li>
            ))}
          </ul>
        </nav>
        {mega && <div className="hidden lg:block"><MegaMenu kind={mega} onNavigate={() => setMega(null)} /></div>}
      </div>
    </header>
  )
}
