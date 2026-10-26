import { MessageCircle, Search } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation, occasions } from '../../data/content'
import { getCategories, getFabricCategories } from '../../lib/catalog'
import { useOverlay } from '../../hooks/useStores'
import { closeOverlay, openOverlay } from '../../store/stores'
import { AccordionItem } from '../ui/Accordion'
import { Img } from '../ui/Img'
import { Overlay } from '../ui/Overlay'
import { Wordmark } from './Wordmark'

const item = (i: number, reduce: boolean | null) =>
  reduce ? {} : { initial: { opacity: 0, x: -16 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.12 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }

export function MobileDrawer() {
  const open = useOverlay().kind === 'menu'
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const feature = getCategories()[0]

  // close only when the route changes, not when the drawer opens
  const lastPath = useRef(pathname)
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname
      if (open) closeOverlay()
    }
  }, [pathname, open])

  return (
    <Overlay open={open} onClose={closeOverlay} label="Main menu" side="left" hideClose={false}>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-5">
        <Wordmark className="self-start" />
        <motion.button {...item(0, reduce)} type="button" onClick={() => openOverlay('search')} className="mt-6 flex min-h-12 items-center gap-3 border border-line bg-parchment px-4 text-left text-sm text-muted">
          <Search size={18} aria-hidden="true" /> Search sarees, fabrics, occasions
        </motion.button>
        <nav aria-label="Mobile" className="mt-4">
          <motion.div {...item(1, reduce)}>
            <Link to="/collections/new-arrivals" className="flex min-h-14 items-center border-b border-line font-display text-2xl">New Arrivals</Link>
          </motion.div>
          <motion.div {...item(2, reduce)}>
            <AccordionItem title="Sarees">
              <ul className="space-y-1">
                {getFabricCategories().map((c) => <li key={c.slug}><Link to={`/collections/${c.slug}`} className="flex min-h-11 items-center text-base">{c.title}</Link></li>)}
                <li><Link to="/sarees" className="flex min-h-11 items-center text-base font-semibold underline underline-offset-4">View all sarees</Link></li>
                {navigation.priceBands.map((b) => <li key={b.to}><Link to={b.to} className="flex min-h-11 items-center text-sm text-muted">{b.label}</Link></li>)}
              </ul>
            </AccordionItem>
          </motion.div>
          <motion.div {...item(3, reduce)}>
            <AccordionItem title="Occasions">
              <ul className="space-y-1">
                {occasions.map((o) => <li key={o.slug}><Link to={`/occasion/${o.slug}`} className="flex min-h-11 items-center text-base">{o.title}</Link></li>)}
              </ul>
            </AccordionItem>
          </motion.div>
          {[{ label: 'Bridal', to: '/occasion/bridal' }, { label: 'Craft', to: '/craft' }, { label: 'Our Story', to: '/our-story' }].map((l, i) => (
            <motion.div key={l.to} {...item(4 + i, reduce)}>
              <Link to={l.to} className="flex min-h-14 items-center border-b border-line font-display text-2xl">{l.label}</Link>
            </motion.div>
          ))}
        </nav>
        <motion.div {...item(7, reduce)} className="mt-8">
          <Link to={`/collections/${feature.slug}`} className="group relative block aspect-[16/10] overflow-hidden bg-parchment">
            <Img image={feature.heroImage} sizes="400px" className="size-full" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-4 pt-12 text-ivory">
              <span className="t-label block">Featured</span>
              <span className="font-display text-2xl">The {feature.title} edit</span>
            </span>
          </Link>
        </motion.div>
        <motion.div {...item(8, reduce)}>
          <Link to="/contact" className="mt-6 flex min-h-12 items-center gap-3 text-sm font-semibold">
            <MessageCircle size={18} aria-hidden="true" /> Need help choosing? Contact us
          </Link>
          <Link to="/account" className="flex min-h-12 items-center gap-3 text-sm">Account (demo)</Link>
        </motion.div>
      </div>
    </Overlay>
  )
}
