import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { getProducts } from '../../lib/catalog'
import { ProductCard } from '../product/ProductCard'
import { Tabs } from '../ui/Tabs'
import { SectionHead } from './SectionHead'

const tabs = [
  { id: 'all', label: 'All' }, { id: 'silk', label: 'Silk' }, { id: 'cotton', label: 'Cotton & Linen' },
  { id: 'designer', label: 'Designer' }, { id: 'daily', label: 'Daily Wear' },
]

export function BestSellers() {
  const [tab, setTab] = useState('all')
  const items = useMemo(() => {
    const best = getProducts().filter((p) => p.isBestseller)
    switch (tab) {
      case 'silk': return best.filter((p) => ['kanjivaram-silk', 'banarasi', 'soft-silk'].includes(p.fabricSlug))
      case 'cotton': return best.filter((p) => ['cotton', 'linen'].includes(p.fabricSlug))
      case 'designer': return best.filter((p) => p.fabricSlug === 'designer')
      case 'daily': return best.filter((p) => p.occasion.includes('daily'))
      default: return best
    }
  }, [tab])

  return (
    <section aria-labelledby="best-title" className="section">
      <div className="wrap">
        <SectionHead num="07" label="Best sellers" id="best-title" title="Most often chosen" linkTo="/collections/best-sellers" />
        <Tabs tabs={tabs} value={tab} onChange={setTab} label="Filter best sellers" panelId="best-panel" />
        <p className="sr-only" aria-live="polite">{items.length} sarees shown</p>
        <div id="best-panel" role="tabpanel" className="mt-8 min-h-[480px]">
          <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((p, i) => (
                <motion.li key={p.id} layout exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  <ProductCard product={p} index={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {items.length === 0 && <p className="py-16 text-center text-muted">No best sellers in this group yet.</p>}
        </div>
      </div>
    </section>
  )
}
