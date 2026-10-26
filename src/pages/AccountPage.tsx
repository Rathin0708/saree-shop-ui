import { Info } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { EMAIL_RE } from '../lib/validation'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatPaise } from '../lib/money'
import { ordersStore } from '../store/stores'

export default function AccountPage() {
  usePageMeta('Account (demo)', 'Accounts are not active in this demo.')
  const orders = ordersStore.use((s) => s)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!EMAIL_RE.test(email)) er.email = 'Enter a valid email address.'
    if (pw.length < 8) er.pw = 'Use at least 8 characters.'
    setErrors(er)
    setDone(Object.keys(er).length === 0)
  }

  return (
    <div className="wrap py-8 md:py-14">
      <h1 className="t-display mb-6">Account</h1>
      <p role="note" className="mb-10 flex max-w-2xl items-start gap-3 border border-zari bg-parchment p-4 text-sm"><Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-kumkum" /><span><strong>Accounts are not active in this demo.</strong> This form validates input only. Nothing is sent, and no password is stored.</span></p>
      <div className="grid gap-12 lg:grid-cols-2">
        <form onSubmit={submit} noValidate className="max-w-md space-y-5">
          <h2 className="text-3xl">Sign in</h2>
          <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <Field label="Password" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} error={errors.pw} />
          <Button type="submit">Sign in (demo)</Button>
          {done && <p role="status" className="text-sm text-peacock">Looks valid, but sign-in is not available in this demo.</p>}
        </form>
        <section aria-labelledby="orders">
          <h2 id="orders" className="mb-4 text-3xl">Demo orders in this browser</h2>
          {orders.length === 0 ? <p className="text-muted">No demo orders yet. Complete the demo checkout to see one here.</p> : (
            <ul className="divide-y divide-line border-y border-line">
              {orders.map((o) => (
                <li key={o.id} className="py-4">
                  <p className="flex justify-between gap-4"><strong>{o.id}</strong><span className="t-price">{formatPaise(o.total)}</span></p>
                  <p className="text-sm text-muted">{new Date(o.placedAt).toLocaleString('en-IN')}</p>
                  <p className="mt-1 text-sm">{o.lines.map((l) => `${l.name} × ${l.qty}`).join(', ')}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
