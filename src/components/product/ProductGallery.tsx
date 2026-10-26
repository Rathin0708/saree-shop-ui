import { Maximize2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { imgSrc } from '../../data/images'
import type { ColorVariant } from '../../data/types'
import { useFinePointer, useIsDesktop } from '../../hooks/useMediaQuery'
import { Img } from '../ui/Img'
import { FullscreenViewer } from './FullscreenViewer'
import { colorViews, viewLabels } from './productViews'

export function ProductGallery({ color, productName }: { color: ColorVariant; productName: string }) {
  const views = colorViews(color)
  const desktop = useIsDesktop()
  const fine = useFinePointer()
  const trackRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [viewer, setViewer] = useState<number | null>(null)
  const [lens, setLens] = useState<{ i: number; x: number; y: number; px: number; py: number } | null>(null)

  const jump = (i: number) => {
    setActive(i)
    const el = itemRefs.current[i]
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: desktop ? 'center' : 'nearest', inline: 'center' })
  }

  const onScroll = () => {
    const t = trackRef.current
    if (!t || desktop) return
    setActive(Math.round(t.scrollLeft / t.clientWidth))
  }

  return (
    <div>
      <ul ref={trackRef} onScroll={onScroll} aria-label={`${productName} photographs`} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:grid lg:gap-3 lg:overflow-visible">
        {views.map((v, i) => (
          <li key={v.key} ref={(el) => { itemRefs.current[i] = el }} className="w-full shrink-0 snap-center lg:w-auto">
            <div
              className="relative aspect-[4/5] overflow-hidden bg-parchment"
              onMouseMove={fine ? (e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setLens({ i, x: e.clientX - r.left, y: e.clientY - r.top, px: ((e.clientX - r.left) / r.width) * 100, py: ((e.clientY - r.top) / r.height) * 100 })
              } : undefined}
              onMouseLeave={() => setLens(null)}
            >
              <button type="button" onClick={() => setViewer(i)} aria-label={`Open zoom viewer: ${viewLabels[v.key]}`} className="absolute inset-0 z-[1] cursor-zoom-in">
                <span className="sr-only">Zoom</span>
              </button>
              <Img image={v.image} sizes="(min-width:1024px) 45vw, 100vw" eager={i === 0} className="size-full" />
              <span className="t-label pointer-events-none absolute bottom-3 left-3 z-[2] bg-ivory/90 px-2 py-1">{viewLabels[v.key]}</span>
              <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 z-[2] grid size-9 place-items-center rounded-full bg-ivory/90 pointer-fine:hidden"><Maximize2 size={15} /></span>
              {lens?.i === i && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute z-[2] size-40 rounded-full border-2 border-ivory shadow-[0_0_0_1px_var(--color-ink)]"
                  style={{ left: lens.x - 80, top: lens.y - 80, backgroundImage: `url(${imgSrc(v.image, 1200)})`, backgroundSize: '320%', backgroundPosition: `${lens.px}% ${lens.py}%` }}
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      {views.length > 1 && (
        <>
          <div className="mt-3 flex justify-center gap-2 lg:hidden" aria-hidden="true">
            {views.map((v, i) => <span key={v.key} className={`h-1 rounded-full transition-all ${i === active ? 'w-6 bg-kumkum' : 'w-1.5 bg-line'}`} />)}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Focus on a detail">
            <span className="t-label mr-1 text-muted">Focus</span>
            {views.map((v, i) => (
              <button key={v.key} type="button" aria-pressed={i === active} onClick={() => jump(i)} className={`min-h-11 border px-4 text-[12px] font-semibold uppercase tracking-[0.14em] ${i === active ? 'border-kumkum bg-kumkum text-ivory' : 'border-line hover:border-ink'}`}>
                {viewLabels[v.key]}
              </button>
            ))}
          </div>
          <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto lg:hidden" aria-label="Thumbnails">
            {views.map((v, i) => (
              <li key={v.key}>
                <button type="button" aria-label={`Show ${viewLabels[v.key]}`} aria-current={i === active} onClick={() => jump(i)} className={`block size-16 overflow-hidden border ${i === active ? 'border-kumkum' : 'border-transparent opacity-70'}`}>
                  <Img image={v.image} sizes="64px" decorative className="size-full" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-3 hidden text-xs text-muted pointer-fine:block">Hover to inspect the weave. Click to open the zoom viewer.</p>

      <FullscreenViewer
        open={viewer !== null}
        items={views.map((v) => ({ image: v.image, label: viewLabels[v.key] }))}
        index={viewer ?? 0}
        onIndex={setViewer}
        onClose={() => setViewer(null)}
      />
    </div>
  )
}
