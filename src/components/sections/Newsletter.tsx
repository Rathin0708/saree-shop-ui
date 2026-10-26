import { useState, type FormEvent } from 'react'
import { readJSON, writeJSON } from '../../lib/storage'
import { EMAIL_RE } from '../../lib/validation'
import { Button } from '../ui/Button'

const KEY = 'neythal.newsletter.v1'
type State = { kind: 'idle' } | { kind: 'loading' } | { kind: 'success'; msg: string } | { kind: 'error'; msg: string }

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = email.trim().toLowerCase()
    if (!v) return setState({ kind: 'error', msg: 'Enter your email address.' })
    if (!EMAIL_RE.test(v)) return setState({ kind: 'error', msg: 'That email address does not look right. Check it and try again.' })
    const list = readJSON<string[]>(KEY, [], (x): x is string[] => Array.isArray(x))
    if (list.includes(v)) return setState({ kind: 'error', msg: 'You are already subscribed with this address.' })
    setState({ kind: 'loading' })
    window.setTimeout(() => {
      // demo only: the address is stored in this browser, not sent anywhere
      if (writeJSON(KEY, [...list, v])) { setState({ kind: 'success', msg: 'Thank you. You are on the list for first looks at new weaves.' }); setEmail('') }
      else setState({ kind: 'error', msg: 'Could not save your subscription in this browser. Please try again.' })
    }, 800)
  }

  const err = state.kind === 'error'
  return (
    <section aria-labelledby="news-title" className="section bg-parchment">
      <div className="wrap mx-auto max-w-3xl text-center">
        <p className="t-label text-kumkum">15 / The letter</p>
        <h2 id="news-title" className="t-display mt-4">First look at <span className="italic-display text-kumkum">new weaves</span></h2>
        <p className="t-lead mx-auto mt-5 max-w-[46ch] text-muted">One considered email when a new loom of sarees arrives. No noise.</p>
        <form onSubmit={submit} noValidate className="mx-auto mt-8 max-w-xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 text-left">
              <label htmlFor="nl-email" className="sr-only">Email address</label>
              <input id="nl-email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); if (err) setState({ kind: 'idle' }) }} placeholder="Your email address" aria-invalid={err} aria-describedby="nl-msg" className={`min-h-12 w-full border bg-ivory px-4 ${err ? 'border-danger' : 'border-line'}`} />
            </div>
            <Button type="submit" disabled={state.kind === 'loading'}>{state.kind === 'loading' ? 'Subscribing…' : 'Subscribe'}</Button>
          </div>
          <p id="nl-msg" role={err ? 'alert' : 'status'} aria-live="polite" className={`mt-3 min-h-6 text-sm ${err ? 'font-medium text-danger' : 'text-peacock'}`}>
            {state.kind === 'error' && `Error: ${state.msg}`}{state.kind === 'success' && state.msg}
          </p>
          <p className="mt-2 text-xs text-muted">By subscribing you agree to receive occasional emails. This demo stores your address in this browser only.</p>
        </form>
      </div>
    </section>
  )
}
