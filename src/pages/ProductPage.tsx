import { Check, Heart } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { brand } from '../config/brand'
import { AddOnSelector, NotifyMe, PincodeChecker, SpecsTable } from '../components/product/forms'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductGrid } from '../components/product/ProductGrid'
import { ColorSwatches, PriceTag, WishlistButton } from '../components/product/parts'
import { badgesFor } from '../components/product/productViews'
import { AccordionItem } from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Stepper } from '../components/ui/Stepper'
import { Reveal } from '../components/ui/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { useIsWished, useRecent } from '../hooks/useStores'
import { addOnsPaise } from '../lib/cart'
import { completeTheLook, getProductBySlug, sameFabric } from '../lib/catalog'
import { formatPaise, toPaise } from '../lib/money'
import { addToCart, pushRecent, toggleWish } from '../store/stores'
import { occasions } from '../data/content'
import NotFound from './NotFound'

type Phase = 'idle' | 'adding' | 'added'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  return product ? <Detail key={product.slug} slug={product.slug} /> : <NotFound />
}

function Detail({ slug }: { slug: string }) {
  const product = getProductBySlug(slug)!
  const [colorName, setColorName] = useState(product.colors[0].name)
  const [qty, setQty] = useState(1)
  const [addOns, setAddOns] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<number[]>([])
  const mainBtn = useRef<HTMLDivElement>(null)
  const [barVisible, setBarVisible] = useState(false)
  const wished = useIsWished(slug)
  const recent = useRecent()

  usePageMeta(product.name, product.description)
  useEffect(() => { pushRecent(slug) }, [slug])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    const el = mainBtn.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0]
  const soldOut = product.stock <= 0
  const unit = toPaise(product.price) + addOnsPaise(addOns)
  const lineTotal = unit * qty

  const related = useMemo(() => sameFabric(product, 4), [product])
  const look = useMemo(() => completeTheLook(product, 4), [product])
  const recents = recent.filter((s) => s !== slug).map(getProductBySlug).filter((p) => !!p).slice(0, 4)

  const add = () => {
    if (soldOut || phase !== 'idle') return
    setPhase('adding')
    timers.current.push(window.setTimeout(() => {
      addToCart(product.id, color.name, addOns, qty)
      setPhase('added')
      timers.current.push(window.setTimeout(() => setPhase('idle'), 1600))
    }, 550))
  }
  const label = soldOut ? 'Out of stock' : phase === 'adding' ? 'Adding…' : phase === 'added' ? 'Added' : 'Add to cart'
  const renderAdd = (className = '') => (
    <Button onClick={add} disabled={soldOut} aria-live="polite" className={`${className} ${phase === 'added' ? 'bg-peacock! border-peacock!' : ''}`}>
      {phase === 'added' && <Check size={16} aria-hidden="true" />}{label}
    </Button>
  )

  const stockText = soldOut ? <span className="font-medium text-danger">Out of stock</span> : product.stock <= 3 ? <span className="font-medium text-kumkum">Only {product.stock} left</span> : <span className="font-medium text-peacock">In stock</span>
  const bp = product.blousePiece
  const specs: [string, string][] = [
    ['Saree length', product.length], ['Width', product.width],
    ['Blouse piece', bp.included ? `Included, ${bp.length}, ${bp.stitched ? 'stitched' : 'unstitched'}` : 'Not included'],
    ['Weight', product.weight], ['Composition', product.composition], ['Zari', product.zari ?? 'None'], ['Weave', product.weave],
    ['Occasion', product.occasion.map((o) => occasions.find((x) => x.slug === o)?.title ?? o).join(', ')], ['Wash care', product.care[0]],
  ]

  return (
    <article className="pb-24 lg:pb-0">
      <div className="wrap pt-6 md:pt-10">
        <nav aria-label="Breadcrumb" className="t-label mb-6 text-muted">
          <ol className="flex flex-wrap gap-2">
            <li><Link to="/" className="hover:text-ink">Home</Link></li><li aria-hidden="true">/</li>
            <li><Link to="/sarees" className="hover:text-ink">Sarees</Link></li><li aria-hidden="true">/</li>
            <li><Link to={`/collections/${product.fabricSlug}`} className="hover:text-ink">{product.fabric}</Link></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery key={color.name} color={color} productName={product.name} />
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="flex flex-wrap gap-1">{badgesFor(product).map((b) => <Badge key={b.label} tone={b.tone}>{b.label}</Badge>)}</div>
            <p className="t-label mt-4 text-muted">{product.fabric} · {product.collection}</p>
            <h1 className="mt-2 text-[clamp(2.2rem,4.2vw,3.6rem)]">{product.name}</h1>
            <p className="mt-2 text-muted">{product.weave}</p>
            <div className="mt-5 flex flex-wrap items-baseline gap-4"><PriceTag product={product} size="lg" /><p className="text-sm">{stockText}</p></div>
            <p className="mt-1 text-xs text-muted">Inclusive of taxes (demo). Free shipping above {brand.freeShippingThreshold.toLocaleString(brand.locale)} rupees.</p>

            <div className="mt-7 space-y-6">
              {product.colors.length > 1 && (
                <div>
                  <p className="t-label mb-1 text-muted">Colour: <span className="text-ink">{color.name}</span></p>
                  <ColorSwatches colors={product.colors} value={color.name} onChange={setColorName} size={26} />
                </div>
              )}
              {soldOut ? <NotifyMe slug={slug} name={product.name} /> : (
                <>
                  <AddOnSelector value={addOns} onChange={setAddOns} />
                  <div ref={mainBtn} className="flex flex-wrap items-center gap-3">
                    <Stepper value={qty} max={product.stock} onChange={(n) => setQty(Math.max(1, Math.min(product.stock, n)))} />
                    {renderAdd('min-w-48 flex-1')}
                    <button type="button" aria-pressed={wished} aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={() => toggleWish(slug)} className="grid size-12 place-items-center border border-line hover:border-ink">
                      <Heart size={20} aria-hidden="true" className={wished ? 'fill-kumkum stroke-kumkum' : ''} />
                    </button>
                  </div>
                  <p className="t-price text-sm text-muted">Line total: <strong className="text-ink">{formatPaise(lineTotal)}</strong>{addOns.length > 0 && ' (includes add-ons)'}</p>
                </>
              )}
              {soldOut && <div ref={mainBtn}><WishlistButton product={product} tone="plain" className="border border-line" /></div>}
              <PincodeChecker />
            </div>

            <div className="mt-8">
              <AccordionItem title="Description" defaultOpen>
                <p>{product.description}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5">{product.details.map((d) => <li key={d}>{d}</li>)}</ul>
              </AccordionItem>
              <AccordionItem title="Fabric & weave"><p>{product.composition}. {product.weave}. {product.zari ? `Zari: ${product.zari}.` : ''}</p></AccordionItem>
              <AccordionItem title="Care instructions"><ul className="list-disc space-y-1 pl-5">{product.care.map((c) => <li key={c}>{c}</li>)}</ul></AccordionItem>
              <AccordionItem title="Shipping & returns">
                <p>Free shipping above ₹{brand.freeShippingThreshold.toLocaleString(brand.locale)}. Returns accepted within {brand.returnWindowDays} days for unused sarees. See <Link to="/shipping" className="underline">Shipping</Link> and <Link to="/returns" className="underline">Returns</Link>. This is a demo store: no orders are fulfilled.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        <section aria-labelledby="specs" className="mt-16 max-w-3xl md:mt-24">
          <h2 id="specs" className="t-title mb-6">Specifications</h2>
          <SpecsTable rows={specs} />
        </section>
      </div>

      {look.length > 0 && <Rail title="Complete the look" items={look} />}
      {related.length > 0 && <Rail title="You may also like" items={related} />}
      {recents.length > 0 && <Rail title="Recently viewed" items={recents as NonNullable<(typeof recents)[number]>[]} />}

      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 ease-[var(--ease-reveal)] lg:hidden ${barVisible && !soldOut ? 'translate-y-0' : 'translate-y-full'}`} aria-hidden={!barVisible || soldOut}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1"><p className="truncate font-display text-lg leading-tight">{product.name}</p><p className="t-price text-sm font-semibold">{formatPaise(lineTotal)}</p></div>
          {renderAdd('shrink-0')}
        </div>
      </div>
    </article>
  )
}

function Rail({ title, items }: { title: string; items: ReturnType<typeof sameFabric> }) {
  return (
    <section className="wrap mt-16 md:mt-24" aria-label={title}>
      <Reveal><h2 className="t-title mb-8">{title}</h2></Reveal>
      <ProductGrid products={items} />
    </section>
  )
}
