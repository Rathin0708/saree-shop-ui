import { CheckCircle2, Info } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../config/brand'
import { CartLineItem, OrderSummary } from '../components/cart/parts'
import { EMAIL_RE } from '../lib/validation'
import { Button, LinkButton } from '../components/ui/Button'
import { Field, SelectField } from '../components/ui/Field'
import { usePageMeta } from '../hooks/usePageMeta'
import { useCartLines, useCartPromo, useCartTotals } from '../hooks/useStores'
import { getProductById } from '../lib/catalog'
import { formatPaise } from '../lib/money'
import { clearCart, saveOrder } from '../store/stores'

const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']
const STEPS = ['Contact', 'Delivery', 'Payment', 'Review'] as const
type Errors = Record<string, string>

const DemoNotice = () => (
  <p role="note" className="flex items-start gap-3 border border-zari bg-parchment p-4 text-sm"><Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-kumkum" /><span><strong>Demo checkout.</strong> {brand.demoNotice}</span></p>
)

export default function CheckoutPage() {
  usePageMeta('Demo checkout', brand.demoNotice)
  const lines = useCartLines()
  const promo = useCartPromo()
  const totals = useCartTotals()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [f, setF] = useState({ email: '', phone: '', name: '', line1: '', line2: '', city: '', state: '', pin: '', pay: 'upi' })
  const [placed, setPlaced] = useState<{ id: string; total: number; lines: { name: string; qty: number }[] } | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))

  const validate = (s: number): Errors => {
    const e: Errors = {}
    if (s === 0) {
      if (!f.email) e.email = 'Enter your email.'
      else if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address.'
      if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a 10-digit Indian mobile number.'
    }
    if (s === 1) {
      if (f.name.trim().length < 2) e.name = 'Enter the recipient’s full name.'
      if (f.line1.trim().length < 4) e.line1 = 'Enter the street address.'
      if (!f.city.trim()) e.city = 'Enter the city.'
      if (!f.state) e.state = 'Select a state.'
      if (!/^[1-9]\d{5}$/.test(f.pin)) e.pin = 'Enter a valid 6-digit PIN code.'
    }
    return e
  }
  const next = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(step)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStep((s) => s + 1)
    requestAnimationFrame(() => heading.current?.focus())
  }
  const place = () => {
    const id = `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`
    const summary = lines.map((l) => ({ name: getProductById(l.productId)?.name ?? 'Saree', qty: l.qty }))
    const order = { id, total: totals.total, lines: summary }
    saveOrder({ ...order, placedAt: new Date().toISOString() })
    setPlaced(order)
    clearCart()
    window.scrollTo(0, 0)
  }

  if (placed)
    return (
      <div className="wrap section max-w-2xl text-center">
        <CheckCircle2 size={48} strokeWidth={1.2} className="mx-auto text-peacock" aria-hidden="true" />
        <h1 className="t-display mt-4" tabIndex={-1} ref={heading}>Demo order placed</h1>
        <p className="mt-4 text-muted">Order <strong className="text-ink">{placed.id}</strong>. No payment was processed and no order was actually placed.</p>
        <ul className="mx-auto mt-8 max-w-md divide-y divide-line border-y border-line text-left">
          {placed.lines.map((l) => <li key={l.name} className="flex justify-between gap-4 py-3"><span>{l.name}</span><span className="t-price">× {l.qty}</span></li>)}
          <li className="t-price flex justify-between py-3 font-semibold"><span>Total</span><span>{formatPaise(placed.total)}</span></li>
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><LinkButton to="/account" variant="outline">View demo orders</LinkButton><LinkButton to="/sarees">Keep browsing</LinkButton></div>
      </div>
    )

  if (!lines.length)
    return (
      <div className="wrap section text-center">
        <h1 className="t-display">Nothing to check out</h1>
        <p className="mt-3 text-muted">Your cart is empty.</p>
        <LinkButton to="/sarees" className="mt-6">Explore sarees</LinkButton>
      </div>
    )

  return (
    <div className="wrap py-8 md:py-14">
      <h1 className="t-display mb-6" tabIndex={-1} ref={heading}>Checkout</h1>
      <DemoNotice />
      <ol className="my-8 flex gap-2 overflow-x-auto" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined} className={`t-label flex min-h-11 items-center gap-2 border-b-2 px-3 ${i === step ? 'border-kumkum text-kumkum' : i < step ? 'border-peacock text-peacock' : 'border-line text-muted'}`}>
            <span className="t-price">{i + 1}</span> {s}{i < step && ' ✓'}
          </li>
        ))}
      </ol>
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <form onSubmit={step === 3 ? (e) => { e.preventDefault(); place() } : next} noValidate className="space-y-5">
          {step === 0 && (
            <>
              <h2 className="text-3xl">Contact</h2>
              <Field label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} />
              <Field label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={f.phone} onChange={(e) => setF((s) => ({ ...s, phone: e.target.value.replace(/\D/g, '') }))} error={errors.phone} hint="10 digits, no country code" />
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-3xl">Delivery address</h2>
              <Field label="Full name" autoComplete="name" value={f.name} onChange={set('name')} error={errors.name} />
              <Field label="Address line 1" autoComplete="address-line1" value={f.line1} onChange={set('line1')} error={errors.line1} />
              <Field label="Address line 2 (optional)" autoComplete="address-line2" value={f.line2} onChange={set('line2')} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="City" autoComplete="address-level2" value={f.city} onChange={set('city')} error={errors.city} />
                <SelectField label="State" autoComplete="address-level1" value={f.state} onChange={set('state')} error={errors.state}><option value="">Select state</option>{STATES.map((s) => <option key={s}>{s}</option>)}</SelectField>
              </div>
              <Field label="PIN code" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={f.pin} onChange={(e) => setF((s) => ({ ...s, pin: e.target.value.replace(/\D/g, '') }))} error={errors.pin} />
            </>
          )}
          {step === 2 && (
            <fieldset className="space-y-3">
              <legend className="mb-3 font-display text-3xl">Payment (demo)</legend>
              <p className="text-sm text-muted">These are illustrative options only. Nothing is charged and no card details are collected.</p>
              {[['upi', 'UPI'], ['card', 'Card'], ['cod', 'Cash on delivery']].map(([v, l]) => (
                <label key={v} className={`flex min-h-14 cursor-pointer items-center gap-3 border px-4 ${f.pay === v ? 'border-kumkum bg-parchment' : 'border-line'}`}>
                  <input type="radio" name="pay" value={v} checked={f.pay === v} onChange={set('pay')} className="size-[18px] accent-[var(--color-kumkum)]" />
                  <span className="flex-1">{l}</span><span className="t-label text-muted">Demo</span>
                </label>
              ))}
              {f.pay === 'card' && (
                <div className="grid gap-3 border border-dashed border-line p-4 opacity-60" aria-hidden="true">
                  <div className="h-11 border border-line bg-parchment px-3 text-sm leading-[2.7rem] text-muted">Card fields are intentionally disabled in this demo</div>
                </div>
              )}
            </fieldset>
          )}
          {step === 3 && (
            <>
              <h2 className="text-3xl">Review</h2>
              <dl className="divide-y divide-line border-y border-line text-[15px]">
                <div className="grid grid-cols-[7rem_1fr] gap-3 py-3"><dt className="text-muted">Contact</dt><dd>{f.email}<br />{f.phone}</dd></div>
                <div className="grid grid-cols-[7rem_1fr] gap-3 py-3"><dt className="text-muted">Deliver to</dt><dd>{f.name}<br />{f.line1}{f.line2 && `, ${f.line2}`}<br />{f.city}, {f.state} {f.pin}</dd></div>
                <div className="grid grid-cols-[7rem_1fr] gap-3 py-3"><dt className="text-muted">Payment</dt><dd className="uppercase">{f.pay} (demo)</dd></div>
              </dl>
              <DemoNotice />
            </>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {step > 0 && <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Back</Button>}
            <Button type="submit">{step === 3 ? 'Place demo order' : 'Continue'}</Button>
            <Link to="/cart" className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">Edit cart</Link>
          </div>
        </form>
        <aside className="h-fit space-y-4 bg-parchment p-6" aria-label="Order summary">
          <h2 className="text-3xl">Your order</h2>
          <ul>{lines.map((l) => <CartLineItem key={l.key} line={l} compact />)}</ul>
          <OrderSummary totals={totals} promo={promo} />
        </aside>
      </div>
    </div>
  )
}
