import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { bridalChapters } from '../../data/content'
import { getProductBySlug } from '../../lib/catalog'
import { formatRupees } from '../../lib/money'
import { addToCart } from '../../store/stores'
import { Button, LinkButton } from '../ui/Button'
import { Img } from '../ui/Img'
import { SectionHead } from './SectionHead'

function Hotspot({ x, y, slug, open, onToggle }: { x: number; y: number; slug: string; open: boolean; onToggle: () => void }) {
  const p = getProductBySlug(slug)
  if (!p) return null
  const flip = x > 55
  return (
    <div className="absolute z-10" style={{ left: `${x}%`, top: `${y}%` }}>
      <button type="button" aria-expanded={open} aria-label={`${open ? 'Close' : 'Show'} product: ${p.name}`} onClick={onToggle} className="group relative -translate-x-1/2 -translate-y-1/2 size-11">
        <span className="pulse-ring absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ivory bg-zari shadow-[0_0_0_1px_var(--color-kumkum-deep)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.25 }}
            role="dialog" aria-label={p.name} onKeyDown={(e) => { if (e.key === 'Escape') onToggle() }}
            className={`absolute top-8 z-20 w-56 bg-ivory p-4 text-ink shadow-none ring-1 ring-ink/10 ${flip ? 'right-[-14px]' : 'left-[-14px]'}`}
          >
            <p className="t-label text-muted">{p.fabric}</p>
            <p className="mt-1 font-display text-xl leading-tight">{p.name}</p>
            <p className="t-price mt-1 text-sm font-semibold">{formatRupees(p.price)}</p>
            <div className="mt-3 flex gap-2">
              <Button className="flex-1 px-2" disabled={p.stock <= 0} onClick={() => addToCart(p.id, p.colors[0].name)}>Add</Button>
              <LinkButton to={`/saree/${p.slug}`} variant="outline" className="flex-1 px-2">View</LinkButton>
            </div>
            <button type="button" aria-label="Close" onClick={onToggle} className="absolute right-0 top-0 grid size-9 place-items-center"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Sticky-scroll bridal story: the pinned image swaps as each chapter passes through the middle of the viewport. */
export function BridalStory() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [spot, setSpot] = useState<string | null>(null)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setActive(Number((e.target as HTMLElement).dataset.i)); setSpot(null) } }),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const chapter = bridalChapters[active]
  return (
    <section aria-labelledby="bridal-title" className="on-dark bg-kumkum-deep text-ivory">
      <div className="wrap pt-16 md:pt-28">
        <SectionHead num="04" label="The bridal edit" id="bridal-title" tone="dark" title={<>Three chapters of a <span className="italic-display">wedding</span></>} linkTo="/occasion/bridal" linkLabel="Shop bridal" />
      </div>
      <div className="wrap pb-16 md:pb-28 lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="sticky top-16 z-10 -mx-[var(--gutter)] h-[52svh] bg-kumkum-deep px-[var(--gutter)] pb-3 pt-2 lg:top-28 lg:mx-0 lg:h-[calc(100svh-9rem)] lg:px-0 lg:pb-0 lg:pt-0 lg:self-start">
          <div className="relative size-full overflow-hidden bg-kumkum">
            <AnimatePresence initial={false}>
              <motion.div key={chapter.id} className="absolute inset-0" initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <Img image={chapter.image} sizes="(min-width:1024px) 48vw, 100vw" className="size-full" />
              </motion.div>
            </AnimatePresence>
            {chapter.hotspots.map((h) => (
              <Hotspot key={`${chapter.id}-${h.slug}`} {...h} open={spot === h.slug} onToggle={() => setSpot((s) => (s === h.slug ? null : h.slug))} />
            ))}
            <p className="t-label absolute bottom-3 left-3 bg-kumkum-deep/80 px-2 py-1 text-[10px]">Tap the gold dots to shop the look</p>
          </div>
        </div>
        <ol className="mt-8 space-y-16 lg:mt-0 lg:space-y-0">
          {bridalChapters.map((c, i) => (
            <li key={c.id} data-i={i} ref={(el) => { refs.current[i] = el }} className="flex min-w-0 flex-col justify-center lg:min-h-[85svh]">
              <p className="t-price font-display text-6xl text-zari md:text-8xl">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-4 text-4xl md:text-6xl">{c.title}</h3>
              <p className="t-lead mt-5 max-w-[46ch] text-ivory/80">{c.copy}</p>
              <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
                {c.picks.map((s) => {
                  const p = getProductBySlug(s)
                  if (!p) return null
                  return (
                    <li key={s}>
                      <Link to={`/saree/${p.slug}`} className="group flex items-center gap-4 border border-ivory/20 p-3 hover:border-ivory/60">
                        <span className="block h-20 w-16 shrink-0 overflow-hidden"><Img image={p.colors[0].images.drape} sizes="64px" className="size-full" /></span>
                        <span className="min-w-0">
                          <span className="block truncate font-display text-lg leading-tight">{p.name}</span>
                          <span className="t-price text-sm text-ivory/80">{formatRupees(p.price)}</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
