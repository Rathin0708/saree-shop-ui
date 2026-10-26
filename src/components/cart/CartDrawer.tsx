import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { completeTheLook, getProductById } from '../../lib/catalog'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useCartLines, useCartPromo, useCartTotals, useOverlay } from '../../hooks/useStores'
import { addToCart, closeOverlay } from '../../store/stores'
import { formatRupees } from '../../lib/money'
import { LinkButton, Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { Overlay } from '../ui/Overlay'
import { CartLineItem, FreeShippingProgress, OrderSummary } from './parts'

export function CartDrawer() {
  const open = useOverlay().kind === 'cart'
  const wide = useMediaQuery('(min-width: 640px)')
  const lines = useCartLines()
  const promo = useCartPromo()
  const totals = useCartTotals()
  const first = lines[0] ? getProductById(lines[0].productId) : undefined
  const inCart = new Set(lines.map((l) => l.productId))
  const upsell = first ? completeTheLook(first, 6).find((p) => !inCart.has(p.id) && p.stock > 0) : undefined

  return (
    <Overlay open={open} onClose={closeOverlay} label="Shopping cart" side={wide ? 'right' : 'bottom'}>
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-line px-6 pb-4 pt-5">
          <h2 className="text-3xl">Your cart <span className="t-price font-sans text-base text-muted">({totals.count})</span></h2>
        </div>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 py-16 text-center">
            <ShoppingBag size={40} strokeWidth={1.2} aria-hidden="true" className="text-kumkum" />
            <p className="font-display text-3xl">Your cart is empty</p>
            <p className="max-w-xs text-muted">Begin with a weave you love. Everything you add stays here, even after a refresh.</p>
            <LinkButton to="/sarees" onClick={closeOverlay}>Explore sarees</LinkButton>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-6">
              <div className="py-4"><FreeShippingProgress totals={totals} /></div>
              <ul>{lines.map((l) => <CartLineItem key={l.key} line={l} compact />)}</ul>
              {upsell && (
                <div className="my-5 flex items-center gap-4 bg-parchment p-3">
                  <Link to={`/saree/${upsell.slug}`} onClick={closeOverlay} className="h-20 w-16 shrink-0 overflow-hidden"><Img image={upsell.colors[0].images.drape} sizes="64px" className="size-full" /></Link>
                  <div className="min-w-0 flex-1">
                    <p className="t-label text-muted">Complete the look</p>
                    <Link to={`/saree/${upsell.slug}`} onClick={closeOverlay} className="block truncate font-display text-lg leading-tight">{upsell.name}</Link>
                    <p className="t-price text-sm">{formatRupees(upsell.price)}</p>
                  </div>
                  <Button variant="outline" className="px-3" aria-label={`Add ${upsell.name} to cart`} onClick={() => addToCart(upsell.id, upsell.colors[0].name, [], 1, false)}>Add</Button>
                </div>
              )}
            </div>
            <div className="shrink-0 space-y-4 border-t border-line bg-parchment px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <OrderSummary totals={totals} promo={promo} />
              <div className="grid grid-cols-2 gap-3">
                <LinkButton to="/cart" variant="outline" onClick={closeOverlay}>View cart</LinkButton>
                <LinkButton to="/checkout" onClick={closeOverlay}>Checkout</LinkButton>
              </div>
              <button type="button" onClick={closeOverlay} className="mx-auto block min-h-11 text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">Continue shopping</button>
            </div>
          </>
        )}
      </div>
    </Overlay>
  )
}
