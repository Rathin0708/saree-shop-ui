import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { occasions } from '../../data/content'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { Img } from '../ui/Img'
import { SectionHead } from './SectionHead'

/** Desktop: huge serif index with a cursor-following preview. Touch: a two-column image grid. */
export function OccasionIndex() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<string | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 28 })
  const sy = useSpring(y, { stiffness: 260, damping: 28 })
  const current = occasions.find((o) => o.slug === hover)

  return (
    <section aria-labelledby="occ-title" className="section">
      <div className="wrap">
        <SectionHead num="05" label="Shop by occasion" id="occ-title" title="For every moment on the calendar" />
        {fine ? (
          <ul className="border-t border-line" onMouseMove={(e) => { x.set(e.clientX + 28); y.set(e.clientY - 110) }} onMouseLeave={() => setHover(null)}>
            {occasions.map((o, i) => (
              <li key={o.slug} className="border-b border-line">
                <Link
                  to={`/occasion/${o.slug}`}
                  onMouseEnter={() => setHover(o.slug)} onFocus={() => { setHover(o.slug); x.set(window.innerWidth * 0.62); y.set(window.innerHeight * 0.25) }} onBlur={() => setHover(null)}
                  className="group flex items-baseline justify-between gap-6 py-5 md:py-7"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="t-price t-label text-muted">0{i + 1}</span>
                    <span className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] transition-[transform,color] duration-500 ease-[var(--ease-reveal)] group-hover:translate-x-4 group-hover:text-kumkum group-focus-visible:translate-x-4 group-focus-visible:text-kumkum motion-reduce:transition-none">{o.title}</span>
                  </span>
                  <span className="hidden max-w-[24ch] text-right text-sm text-muted md:block">{o.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {occasions.map((o) => (
              <li key={o.slug} className={o.slug === 'daily' ? 'col-span-2' : ''}>
                <Link to={`/occasion/${o.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-parchment">
                  <Img image={o.image} sizes="50vw" className="size-full" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-3 pt-10 text-ivory">
                    <span className="block font-display text-3xl">{o.title}</span>
                    <span className="text-xs text-ivory/85">{o.blurb}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {fine && (
        <AnimatePresence>
          {current && !reduce && (
            <motion.div aria-hidden="true" key="preview" style={{ x: sx, y: sy }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="pointer-events-none fixed left-0 top-0 z-30 aspect-[3/4] w-56 overflow-hidden bg-parchment">
              <Img image={current.image} sizes="224px" decorative className="size-full" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  )
}
