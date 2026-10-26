import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { galleryTiles } from '../../data/content'
import { img } from '../../data/images'
import { getProductBySlug } from '../../lib/catalog'
import { Img } from '../ui/Img'
import { Overlay } from '../ui/Overlay'
import { SectionHead } from './SectionHead'

const tile = (i: number) => ({ ...galleryTiles[i], image: img(galleryTiles[i].n, galleryTiles[i].alt) })

function Lightbox({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const t = tile(index)
  const product = getProductBySlug(t.slug)
  const start = useRef<number | null>(null)
  const go = (d: number) => onIndex((index + d + galleryTiles.length) % galleryTiles.length)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  return (
    <div
      className="flex h-dvh flex-col bg-ink text-ivory"
      onPointerDown={(e) => { start.current = e.clientX }}
      onPointerUp={(e) => { if (start.current != null) { const dx = e.clientX - start.current; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); start.current = null } }}
    >
      <div className="relative min-h-0 flex-1"><Img image={t.image} sizes="100vw" className="size-full !object-contain" /></div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex gap-1">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="grid size-11 place-items-center hover:bg-ivory/10"><ChevronLeft /></button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className="grid size-11 place-items-center hover:bg-ivory/10"><ChevronRight /></button>
        </div>
        <p className="text-sm text-ivory/80" aria-live="polite">{index + 1} / {galleryTiles.length} · {t.alt}</p>
        {product && <Link to={`/saree/${product.slug}`} onClick={onClose} className="inline-flex min-h-11 items-center bg-ivory px-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-kumkum-deep">Shop this saree</Link>}
      </div>
    </div>
  )
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const close = () => { setOpen(null); const t = trigger.current; if (t) requestAnimationFrame(() => t.focus())}
  return (
    <section aria-labelledby="gal-title" className="section bg-parchment">
      <div className="wrap">
        <SectionHead num="13" label="From the drape" id="gal-title" title={brand.hashtag} />
        <ul className="columns-2 gap-3 md:columns-4 md:gap-5">
          {galleryTiles.map((g, i) => {
            const p = getProductBySlug(g.slug)
            return (
              <li key={g.n} className="group relative mb-3 break-inside-avoid overflow-hidden md:mb-5">
                <button type="button" onClick={(e) => { trigger.current = e.currentTarget; setOpen(i) }} aria-label={`Open photo: ${g.alt}`} className="block w-full">
                  <Img image={tile(i).image} sizes="(min-width:768px) 24vw, 48vw" className={`w-full ${g.h === 'tall' ? 'aspect-[3/4]' : 'aspect-square'} transition-transform duration-[1200ms] group-hover:scale-105 motion-reduce:transition-none`} />
                </button>
                {p && (
                  <Link to={`/saree/${p.slug}`} className="absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between gap-2 bg-gradient-to-t from-ink/85 to-ink/0 p-3 pt-10 text-ivory opacity-0 transition-[transform,opacity] duration-500 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100">
                    <span className="min-w-0 truncate text-xs">{p.name}</span>
                    <span className="t-label shrink-0 text-[10px] underline underline-offset-4">Shop this saree</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <Overlay open={open !== null} onClose={close} label="Photo viewer" side="full" className="bg-ink!">
        {open !== null && <Lightbox index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </Overlay>
    </section>
  )
}
