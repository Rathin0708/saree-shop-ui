import { useEffect, useState } from 'react'
import { brand } from '../../config/brand'
import { LinkButton } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

const pad = (n: number) => String(n).padStart(2, '0')

function useCountdown(endIso: string) {
  const end = new Date(endIso).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const left = Math.max(0, end - now)
  return {
    expired: Number.isNaN(end) || left === 0,
    d: Math.floor(left / 86_400_000), h: Math.floor(left / 3_600_000) % 24, m: Math.floor(left / 60_000) % 60, s: Math.floor(left / 1000) % 60,
  }
}

/** Light typographic banner. The ticking numbers are hidden from screen readers; a static sentence carries the meaning. */
export function Promo() {
  const c = useCountdown(brand.promoEndsAt)
  const date = new Date(brand.promoEndsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <section aria-labelledby="promo-title" className="section border-y border-zari/50 bg-ivory">
      <div className="wrap">
        <Reveal>
          <p className="t-label text-kumkum">11 / Limited-time offer</p>
          <h2 id="promo-title" className="mt-4 text-[clamp(3.2rem,12vw,11rem)] font-medium leading-[0.88] tracking-[-0.03em]">
            The Festive Edit.<br />
            <span className="italic-display text-kumkum">Up to 25% off</span> select silks.
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          {c.expired ? (
            <p role="status" className="max-w-md text-lg">This offer has ended. New weaves arrive often. See what is new.</p>
          ) : (
            <div>
              <p className="sr-only">Offer ends on {date}.</p>
              <div aria-hidden="true" className="flex gap-5 md:gap-8">
                {([['Days', c.d], ['Hours', c.h], ['Minutes', c.m], ['Seconds', c.s]] as const).map(([l, v]) => (
                  <div key={l} className="text-center"><p className="t-price font-display text-5xl md:text-7xl">{pad(v)}</p><p className="t-label mt-1 text-muted">{l}</p></div>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">Ends {date}. Demo date, set in the brand config.</p>
            </div>
          )}
          <LinkButton to={c.expired ? '/collections/new-arrivals' : '/sarees?sale=1'}>{c.expired ? 'Shop new arrivals' : 'Shop the edit'}</LinkButton>
        </div>
      </div>
    </section>
  )
}
