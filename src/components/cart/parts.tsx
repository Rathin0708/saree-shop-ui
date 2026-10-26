import { Trash2, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { getProductById } from '../../lib/catalog'
import { unitPaise, findPromo, type CartLine, type Totals } from '../../lib/cart'
import { formatPaise } from '../../lib/money'
import { applyPromo, closeOverlay, removeLine, removePromo, updateQty } from '../../store/stores'
import { Button } from '../ui/Button'
import { Img } from '../ui/Img'
import { Stepper } from '../ui/Stepper'

export function CartLineItem({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const p = getProductById(line.productId)
  if (!p) return null
  const color = p.colors.find((c) => c.name === line.color) ?? p.colors[0]
  const addOns = line.addOns.map((id) => brand.addOns.find((a) => a.id === id)?.label).filter(Boolean)
  const atMax = line.qty >= p.stock
  return (
    <li className="flex gap-4 border-b border-line py-5">
      <Link to={`/saree/${p.slug}`} onClick={closeOverlay} className={`relative shrink-0 overflow-hidden bg-parchment ${compact ? 'h-28 w-[88px]' : 'h-36 w-28 md:h-44 md:w-36'}`}>
        <Img image={color.images.drape} sizes="150px" className="size-full" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/saree/${p.slug}`} onClick={closeOverlay} className="font-display text-lg leading-tight hover:text-kumkum">{p.name}</Link>
            <p className="mt-1 text-xs text-muted">{p.fabric} · {color.name}</p>
            {addOns.length > 0 && <p className="text-xs text-muted">+ {addOns.join(', ')}</p>}
          </div>
          <button type="button" aria-label={`Remove ${p.name}`} onClick={() => removeLine(line.key)} className="grid size-11 shrink-0 place-items-center text-muted hover:text-kumkum">
            {compact ? <X size={16} /> : <Trash2 size={16} />}
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <Stepper value={line.qty} max={p.stock} label={`Quantity of ${p.name}`} onChange={(n) => updateQty(line.key, n)} />
            {atMax && <p className="mt-1 text-xs text-muted">Maximum available ({p.stock})</p>}
          </div>
          <p className="t-price font-semibold">{formatPaise(unitPaise(line) * line.qty)}</p>
        </div>
      </div>
    </li>
  )
}

/** The woven thread fills as the order approaches the free-shipping threshold. */
export function FreeShippingProgress({ totals }: { totals: Totals }) {
  const threshold = brand.freeShippingThreshold * 100
  const after = totals.subtotal - totals.promoDiscount
  const pct = Math.min(100, Math.round((after / threshold) * 100))
  return (
    <div>
      <p className="text-sm" aria-live="polite">
        {totals.freeShipping ? <>You have unlocked <strong>free shipping</strong>.</> : <>Add <strong className="t-price">{formatPaise(totals.toFreeShipping)}</strong> more for free shipping.</>}
      </p>
      <div className="relative mt-2 h-[3px] bg-line" role="progressbar" aria-label="Progress to free shipping" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="absolute inset-y-0 left-0 bg-kumkum transition-[width] duration-700 ease-[var(--ease-reveal)] motion-reduce:transition-none" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function PromoCode({ code }: { code: string | null }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const applied = code ? findPromo(code) : undefined
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const r = applyPromo(value)
    setError(r.ok ? '' : r.message)
    if (r.ok) setValue('')
  }
  if (applied)
    return (
      <div className="flex items-center justify-between gap-3 border border-peacock/40 bg-parchment px-4 py-3 text-sm">
        <p><strong>{applied.code}</strong> applied · {applied.label}</p>
        <button type="button" onClick={removePromo} className="min-h-11 text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">Remove</button>
      </div>
    )
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="promo" className="t-label mb-2 block text-muted">Promo code</label>
      <div className="flex gap-2">
        <input id="promo" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" autoCapitalize="characters" aria-invalid={!!error} aria-describedby={error ? 'promo-e' : 'promo-h'} placeholder="e.g. FESTIVE10" className={`min-h-12 min-w-0 flex-1 border bg-parchment px-4 uppercase ${error ? 'border-danger' : 'border-line'}`} />
        <Button type="submit" variant="outline">Apply</Button>
      </div>
      {error ? <p id="promo-e" className="mt-1.5 text-xs font-medium text-danger">Error: {error}</p> : <p id="promo-h" className="mt-1.5 text-xs text-muted">Demo codes: FESTIVE10, WELCOME5, SILK500</p>}
    </form>
  )
}

export function OrderSummary({ totals, promo }: { totals: Totals; promo: string | null }) {
  const row = 'flex justify-between gap-4 py-1.5 text-[15px]'
  return (
    <dl className="t-price">
      <div className={row}><dt>Subtotal</dt><dd>{formatPaise(totals.subtotal)}</dd></div>
      {totals.promoDiscount > 0 && <div className={`${row} text-peacock`}><dt>Promo {promo}</dt><dd>−{formatPaise(totals.promoDiscount)}</dd></div>}
      <div className={row}><dt>Shipping</dt><dd>{totals.freeShipping ? 'Free' : formatPaise(totals.shipping)}</dd></div>
      <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd>{formatPaise(totals.total)}</dd></div>
      {totals.mrpSavings + totals.promoDiscount > 0 && <p className="mt-2 text-sm font-medium text-peacock">You save {formatPaise(totals.mrpSavings + totals.promoDiscount)} on this order.</p>}
    </dl>
  )
}
