import { Truck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { brand } from '../../config/brand'
import { readJSON, writeJSON } from '../../lib/storage'
import { formatRupees } from '../../lib/money'
import { toast } from '../../store/stores'
import { EMAIL_RE, estimateDays } from '../../lib/validation'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'


export function PincodeChecker() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[1-9]\d{5}$/.test(pin)) { setError('Enter a valid 6-digit PIN code.'); setResult(null); return }
    const [a, b] = estimateDays(pin)
    setError('')
    setResult(`Estimated delivery to ${pin} in ${a}–${b} days. This is a demo estimate, not a carrier promise.`)
  }
  return (
    <form onSubmit={submit} noValidate>
      <div className="flex items-end gap-2">
        <Field label="Check delivery" className="flex-1" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="6-digit PIN code" error={error} />
        <Button type="submit" variant="outline" className="mb-px">Check</Button>
      </div>
      {result && <p role="status" className="mt-2 flex items-start gap-2 text-sm text-peacock"><Truck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />{result}</p>}
    </form>
  )
}

const NOTIFY_KEY = 'neythal.notify.v1'
export function NotifyMe({ slug, name }: { slug: string; name: string }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(() => readJSON<string[]>(NOTIFY_KEY, [], (v): v is string[] => Array.isArray(v)).some((x) => x.startsWith(`${slug}|`)))
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) { setError('Enter a valid email address.'); return }
    const list = readJSON<string[]>(NOTIFY_KEY, [], (v): v is string[] => Array.isArray(v))
    writeJSON(NOTIFY_KEY, [...list, `${slug}|${email}`])
    setDone(true)
    toast(`We will notify you if ${name} returns (stored on this device only).`)
  }
  if (done) return <p role="status" className="border border-peacock/40 bg-parchment p-4 text-sm">You are on the list for this saree. Demo only: the request is stored in this browser.</p>
  return (
    <form onSubmit={submit} noValidate className="space-y-3 border border-line bg-parchment p-4">
      <p className="text-sm font-medium">This saree is currently out of stock.</p>
      <Field label="Notify me when available" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="you@example.com" />
      <Button type="submit">Notify me</Button>
    </form>
  )
}

export function AddOnSelector({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset>
      <legend className="t-label mb-2 text-muted">Optional add-ons</legend>
      {brand.addOns.map((a) => (
        <label key={a.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
          <input type="checkbox" checked={value.includes(a.id)} onChange={(e) => onChange(e.target.checked ? [...value, a.id] : value.filter((x) => x !== a.id))} className="size-[18px] accent-[var(--color-kumkum)]" />
          <span className="flex-1">{a.label}</span>
          <span className="t-price text-sm">+{formatRupees(a.price)}</span>
        </label>
      ))}
      <p className="mt-1 text-xs text-muted">Add-on prices are demo values.</p>
    </fieldset>
  )
}

export function SpecsTable({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-line border-y border-line text-[15px]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3 md:grid-cols-[12rem_1fr]">
          <dt className="text-muted">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}
