import { Link } from 'react-router-dom'
import { brand } from '../config/brand'
import { CartLineItem, FreeShippingProgress, OrderSummary, PromoCode } from '../components/cart/parts'
import { LinkButton } from '../components/ui/Button'
import { usePageMeta } from '../hooks/usePageMeta'
import { useCartLines, useCartPromo, useCartTotals } from '../hooks/useStores'
import { formatPaise } from '../lib/money'
import { findPromo } from '../lib/cart'

export default function CartPage() {
  usePageMeta('Your cart', 'Review your selected sarees.')
  const lines = useCartLines()
  const promo = useCartPromo()
  const totals = useCartTotals()
  const promoDef = promo ? findPromo(promo) : undefined
  const promoBlocked = promoDef && totals.promoDiscount === 0

  if (!lines.length)
    return (
      <div className="wrap section text-center">
        <h1 className="t-display">Your cart is empty</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">Sarees you add will wait here, even after a refresh.</p>
        <LinkButton to="/sarees" className="mt-8">Continue shopping</LinkButton>
      </div>
    )

  return (
    <div className="wrap py-8 md:py-14">
      <h1 className="t-display mb-8 md:mb-12">Your cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <FreeShippingProgress totals={totals} />
          <ul className="mt-4 border-t border-line">{lines.map((l) => <CartLineItem key={l.key} line={l} />)}</ul>
          <Link to="/sarees" className="mt-6 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">Continue shopping</Link>
        </div>
        <aside className="h-fit space-y-6 bg-parchment p-6 lg:sticky lg:top-36" aria-label="Order summary">
          <h2 className="text-3xl">Order summary</h2>
          <PromoCode code={promo} />
          {promoBlocked && <p className="text-sm text-danger" role="alert">Error: {promoDef.code} needs a subtotal of at least ₹{promoDef.minSubtotal.toLocaleString(brand.locale)}.</p>}
          <OrderSummary totals={totals} promo={promo} />
          <p className="text-xs text-muted">Shipping estimate: {totals.freeShipping ? 'free on this order' : `${formatPaise(totals.shipping)} flat (free above ₹${brand.freeShippingThreshold.toLocaleString(brand.locale)})`}. Taxes shown inclusive (demo).</p>
          <LinkButton to="/checkout" className="w-full">Proceed to demo checkout</LinkButton>
        </aside>
      </div>
    </div>
  )
}
