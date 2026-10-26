import { Eye, ShoppingBag } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { addToCart, openOverlay } from '../../store/stores'
import { Badge } from '../ui/Badge'
import { Img } from '../ui/Img'
import { ColorSwatches, PriceTag, WishlistButton } from './parts'
import { badgesFor, detailImage } from './productViews'

interface Props {
  product: Product
  aspect?: string
  sizes?: string
  priority?: boolean
  index?: number
}

export function ProductCard({ product, aspect = 'aspect-[4/5]', sizes = '(min-width:1024px) 25vw, 50vw', priority, index = 0 }: Props) {
  const reduce = useReducedMotion()
  const [colorName, setColorName] = useState(product.colors[0].name)
  const [slide, setSlide] = useState(0)
  const touchX = useRef<number | null>(null)
  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0]
  const detail = detailImage(color)
  const soldOut = product.stock <= 0
  const badges = badgesFor(product).slice(0, 3)

  return (
    <motion.article
      layout={reduce ? false : 'position'}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.7, delay: Math.min(index % 4, 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className={`relative overflow-hidden bg-parchment ${aspect}`}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchX.current == null || !detail) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) setSlide(dx < 0 ? 1 : 0)
          touchX.current = null
        }}
      >
        <Link to={`/saree/${product.slug}`} aria-label={`${product.name}, view details`} className="absolute inset-0 z-[1]" />
        <Img image={color.images.drape} sizes={sizes} eager={priority} className="absolute inset-0 size-full transition-transform duration-[1200ms] ease-[var(--ease-reveal)] group-hover:scale-[1.04] motion-reduce:transition-none" />
        {detail && (
          <Img image={detail} sizes={sizes} decorative className={`absolute inset-0 size-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${slide === 1 ? 'opacity-100' : ''}`} />
        )}
        <div className="pointer-events-none absolute left-3 top-3 z-[2] flex flex-wrap gap-1">
          {badges.map((b) => <Badge key={b.label} tone={b.tone}>{b.label}</Badge>)}
        </div>
        <WishlistButton product={product} className="absolute right-2 top-2 z-[3]" />
        {detail && (
          <div className="absolute inset-x-0 bottom-3 z-[3] hidden justify-center gap-1 pointer-coarse:flex" role="group" aria-label="Photo selector">
            {[0, 1].map((i) => (
              <button key={i} type="button" aria-label={i === 0 ? 'Show full drape' : 'Show detail'} aria-pressed={slide === i} onClick={() => setSlide(i)} className="grid size-6 place-items-center">
                <span className={`block size-1.5 rounded-full ${slide === i ? 'bg-ivory' : 'bg-ivory/50'}`} />
              </button>
            ))}
          </div>
        )}
        <div className="absolute inset-x-3 bottom-3 z-[3] flex translate-y-2 gap-2 opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-reveal)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 pointer-coarse:hidden">
          <button type="button" onClick={() => openOverlay('quickview', { slug: product.slug, color: color.name })} className="flex min-h-11 flex-1 items-center justify-center gap-2 bg-ivory/95 text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-ivory">
            <Eye size={15} aria-hidden="true" /> Quick view
          </button>
          {!soldOut && (
            <button type="button" aria-label={`Quick add ${product.name} to cart`} onClick={() => addToCart(product.id, color.name)} className="grid size-11 place-items-center bg-kumkum text-ivory hover:bg-kumkum-deep">
              <ShoppingBag size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="absolute bottom-2 left-2 z-[3] hidden gap-1 pointer-coarse:flex">
          <button type="button" aria-label={`Quick view ${product.name}`} onClick={() => openOverlay('quickview', { slug: product.slug, color: color.name })} className="grid size-11 place-items-center rounded-full bg-ivory/90">
            <Eye size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="card-thread absolute inset-x-0 bottom-0 z-[3]"><div className="woven" /></div>
      </div>
      <div className="pt-3">
        <p className="t-label text-muted">{product.fabric} · {product.collection}</p>
        <h3 className="mt-1 font-display text-[1.2rem] leading-tight md:text-[1.3rem]">
          <Link to={`/saree/${product.slug}`} className="hover:text-kumkum">{product.name}</Link>
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <PriceTag product={product} />
          {product.colors.length > 1 && <ColorSwatches colors={product.colors} value={color.name} onChange={setColorName} size={16} />}
        </div>
        {soldOut ? <p className="mt-1 text-xs font-medium text-danger">Out of stock</p> : product.stock <= 3 && <p className="mt-1 text-xs font-medium text-kumkum">Only {product.stock} left</p>}
      </div>
    </motion.article>
  )
}
