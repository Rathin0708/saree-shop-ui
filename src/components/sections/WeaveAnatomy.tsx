import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { weaveAnatomy } from '../../data/content'
import { Img } from '../ui/Img'
import { SectionHead } from './SectionHead'

/** Selecting a point zooms the image to that region and reveals what it is. Works by mouse, touch and keyboard. */
export function WeaveAnatomy() {
  const reduce = useReducedMotion()
  const [id, setId] = useState(weaveAnatomy.points[0].id)
  const point = weaveAnatomy.points.find((p) => p.id === id) ?? weaveAnatomy.points[0]

  return (
    <section aria-labelledby="anat-title" className="section bg-parchment">
      <div className="wrap">
        <SectionHead num="06" label="Traditional craftsmanship" id="anat-title" title="Anatomy of a saree" />
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[2/3] max-w-[520px] overflow-hidden bg-ivory">
              <motion.div className="absolute inset-0" animate={{ scale: point.zoom }} style={{ transformOrigin: `${point.x}% ${point.y}%` }} transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <Img image={weaveAnatomy.image} sizes="(min-width:1024px) 40vw, 90vw" className="size-full" />
                {weaveAnatomy.points.map((p) => (
                  <button
                    key={p.id} type="button" aria-pressed={p.id === id} aria-label={`Inspect ${p.label}`} onClick={() => setId(p.id)}
                    className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center" style={{ left: `${p.x}%`, top: `${p.y}%`, scale: 1 / point.zoom }}
                  >
                    <span className={`block size-4 rounded-full border-2 border-ivory shadow-[0_0_0_1px_var(--color-kumkum-deep)] transition-colors ${p.id === id ? 'bg-kumkum' : 'bg-zari'}`} />
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:pt-8">
            <div role="group" aria-label="Parts of a saree" className="flex flex-wrap gap-2">
              {weaveAnatomy.points.map((p) => (
                <button key={p.id} type="button" aria-pressed={p.id === id} onClick={() => setId(p.id)} className={`min-h-11 border px-5 text-[12px] font-semibold uppercase tracking-[0.14em] ${p.id === id ? 'border-kumkum bg-kumkum text-ivory' : 'border-line bg-ivory hover:border-ink'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="mt-10 min-h-48 border-t border-ink pt-8">
              <h3 className="text-5xl md:text-7xl">{point.label}</h3>
              <p className="t-lead mt-5 max-w-[48ch] text-ink/85">{point.text}</p>
              <p className="mt-6 text-sm text-muted">A general explanation of saree construction. Specific weaves are described on each product page.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
