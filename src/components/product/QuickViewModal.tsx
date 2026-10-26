import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductBySlug } from '../../lib/catalog'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { useOverlay } from '../../hooks/useStores'
import { addToCart, closeOverlay } from '../../store/stores'
import { Button, LinkButton } from '../ui/Button'
import { Img } from '../ui/Img'
import { Overlay } from '../ui/Overlay'
import { Stepper } from '../ui/Stepper'
import { Badge } from '../ui/Badge'
import { ColorSwatches, PriceTag, WishlistButton } from './parts'
import { badgesFor, colorViews, viewLabels } from './productViews'
import type { Product } from '../../data/types'

function Body({ product, initialColor }: { product: Product; initialColor?: string }) {
  const [colorName, setColorName] = useState(initialColor ?? product.colors[0].name)
  const [view, setView] = useState(0)
  const [qty, setQty] = useState(1)
  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0]
  const views = colorViews(color)
  const current = views[Math.min(view, views.length - 1)]
  const soldOut = product.stock <= 0

  return (
    <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
      <div className="bg-parchment md:p-0">
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full md:min-h-[560px]">
          <Img image={current.image} sizes="(min-width:768px) 560px, 100vw" className="absolute inset-0 size-full" eager />
          <div className="absolute left-3 top-3 flex gap-1">{badgesFor(product).slice(0, 2).map((b) => <Badge key={b.label} tone={b.tone}>{b.label}</Badge>)}</div>
        </div>
        {views.length > 1 && (
          <ul className="flex gap-2 p-3" aria-label="Photographs">
            {views.map((v, i) => (
              <li key={v.key}>
                <button type="button" aria-label={`Show ${viewLabels[v.key]}`} aria-pressed={i === view} onClick={() => setView(i)} className={`block size-16 overflow-hidden border ${i === view ? 'border-kumkum' : 'border-transparent opacity-70'}`}>
                  <Img image={v.image} sizes="64px" className="size-full" decorative />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-5 p-5 pb-8 md:p-9">
        <div>
          <p className="t-label text-muted">{product.fabric} · {product.collection}</p>
          <h2 id="qv-title" className="mt-2 text-3xl md:text-4xl">{product.name}</h2>
        </div>
        <PriceTag product={product} size="lg" />
        <p className="text-sm">
          {soldOut ? <span className="font-medium text-danger">Out of stock</span> : product.stock <= 3 ? <span className="font-medium text-kumkum">Only {product.stock} left</span> : <span className="text-peacock font-medium">In stock</span>}
          <span className="text-muted"> · {product.blousePiece.included ? `Blouse piece included (${product.blousePiece.length}, unstitched)` : 'No blouse piece'}</span>
        </p>
        <p className="text-[15px] leading-relaxed text-ink/85">{product.description}</p>
        {product.colors.length > 1 && (
          <div>
            <p className="t-label mb-1 text-muted">Colour: <span className="text-ink">{color.name}</span></p>
            <ColorSwatches colors={product.colors} value={color.name} onChange={(n) => { setColorName(n); setView(0) }} />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Stepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(product.stock, n)))} max={product.stock} />
          <Button className="flex-1" disabled={soldOut} onClick={() => { if (addToCart(product.id, color.name, [], qty)) closeOverlay() }}>
            {soldOut ? 'Out of stock' : 'Add to cart'}
          </Button>
          <WishlistButton product={product} tone="plain" className="border border-line" />
        </div>
        <LinkButton to={`/saree/${product.slug}`} variant="ghost" onClick={() => closeOverlay()} className="self-start px-0">View full details</LinkButton>
        <Link to="/shipping" onClick={() => closeOverlay()} className="text-xs text-muted underline underline-offset-4">Shipping and returns</Link>
      </div>
    </div>
  )
}

export function QuickViewModal() {
  const o = useOverlay()
  const desktop = useIsDesktop()
  const product = o.kind === 'quickview' && o.slug ? getProductBySlug(o.slug) : undefined
  return (
    <Overlay open={!!product} onClose={closeOverlay} label={product ? `Quick view: ${product.name}` : 'Quick view'} side={desktop ? 'center' : 'bottom'}>
      {product && <Body key={product.slug} product={product} initialColor={o.color} />}
    </Overlay>
  )
}
