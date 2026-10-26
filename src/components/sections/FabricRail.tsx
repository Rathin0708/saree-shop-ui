import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent as RPE } from 'react'
import { Link } from 'react-router-dom'
import { countIn, getFabricCategories } from '../../lib/catalog'
import { Img } from '../ui/Img'
import { SectionHead } from './SectionHead'

export function FabricRail() {
  const cats = getFabricCategories()
  const rail = useRef<HTMLUListElement>(null)
  const [progress, setProgress] = useState(0)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })

  const onScroll = useCallback(() => {
    const r = rail.current
    if (!r) return
    const max = r.scrollWidth - r.clientWidth
    setProgress(max > 0 ? r.scrollLeft / max : 0)
  }, [])
  useEffect(onScroll, [onScroll])

  const by = (dir: 1 | -1) => {
    const r = rail.current
    if (!r) return
    r.scrollBy({ left: dir * r.clientWidth * 0.7, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  // mouse drag only: touch uses native swipe with scroll-snap
  const down = (e: RPE) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { down: true, x: e.clientX, left: rail.current?.scrollLeft ?? 0, moved: false }
  }
  const move = (e: RPE) => {
    const d = drag.current
    if (!d.down || !rail.current) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 5) d.moved = true
    rail.current.scrollLeft = d.left - dx
  }
  const up = () => { drag.current.down = false }

  return (
    <section id="fabrics" aria-labelledby="fabrics-title" className="section scroll-mt-24">
      <div className="wrap">
        <SectionHead num="02" label="Shop by fabric" id="fabrics-title" title="Begin with the cloth" linkTo="/sarees" linkLabel="All sarees" />
      </div>
      <div className="relative">
        <ul
          ref={rail} onScroll={onScroll} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
          onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false } }}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pb-2 active:cursor-grabbing md:gap-6 [&_a]:select-none"
          aria-label="Fabrics"
        >
          {cats.map((c) => (
            <li key={c.slug} className="w-[72vw] max-w-[360px] shrink-0 snap-start sm:w-[44vw] lg:w-[26vw]">
              <Link to={`/collections/${c.slug}`} draggable={false} className="group block">
                <div className="relative aspect-[3/4.2] overflow-hidden rounded-t-[999px] bg-parchment">
                  <Img image={c.macroImage} sizes="(min-width:1024px) 26vw, 72vw" className="absolute inset-0 size-full" />
                  <Img image={c.heroImage} sizes="(min-width:1024px) 26vw, 72vw" decorative className="absolute inset-0 size-full opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-3xl group-hover:text-kumkum md:text-4xl">{c.title}</h3>
                  <span className="t-price text-sm text-muted">{countIn(c)} {countIn(c) === 1 ? 'saree' : 'sarees'}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{c.descriptor}</p>
              </Link>
            </li>
          ))}
          <li aria-hidden="true" className="w-4 shrink-0" />
        </ul>
        <div className="wrap mt-8 flex items-center gap-6">
          <div className="relative h-px flex-1 bg-line" role="progressbar" aria-label="Rail position" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="woven-line absolute inset-y-0 left-0 !h-[2px] -translate-y-1/2 origin-left" style={{ width: `${Math.max(8, progress * 100)}%` }} />
          </div>
          <div className="flex gap-1">
            <button type="button" aria-label="Previous fabrics" onClick={() => by(-1)} disabled={progress <= 0.01} className="grid size-11 place-items-center border border-line hover:border-ink disabled:opacity-35"><ChevronLeft size={18} /></button>
            <button type="button" aria-label="Next fabrics" onClick={() => by(1)} disabled={progress >= 0.99} className="grid size-11 place-items-center border border-line hover:border-ink disabled:opacity-35"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
