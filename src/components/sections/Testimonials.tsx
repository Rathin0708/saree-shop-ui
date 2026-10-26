import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { testimonials } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from './SectionHead'

const promises = [
  `Free shipping above ₹${brand.freeShippingThreshold.toLocaleString(brand.locale)}`,
  `Returns within ${brand.returnWindowDays} days on unused sarees`,
  'Blouse piece included where stated',
  'Fall & pico and blouse stitching available as add-ons',
]

export function Testimonials() {
  return (
    <section aria-labelledby="test-title" className="section">
      <div className="wrap">
        <SectionHead num="12" label="In their words" id="test-title" title="Notes from the drape" />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <li key={t.id}>
              <Reveal delay={i * 0.07} className="flex h-full flex-col border border-line bg-parchment p-6">
                <div className="flex items-center justify-between">
                  <span role="img" aria-label={`${t.rating} out of 5 stars`} className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, k) => <Star key={k} size={14} aria-hidden="true" className={k < t.rating ? 'fill-zari stroke-zari' : 'stroke-line'} />)}
                  </span>
                  {t.isSample && <span className="t-label border border-ink/30 px-2 py-0.5 text-[10px] text-muted">Sample review</span>}
                </div>
                <p className="mt-5 flex-1 font-display text-[1.4rem] leading-snug">“{t.text}”</p>
                <p className="mt-6 text-sm"><strong>{t.name}</strong>, {t.city}</p>
                <Link to={`/saree/${t.slug}`} className="mt-1 text-sm text-muted underline underline-offset-4 hover:text-kumkum">{t.saree}</Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" aria-label="Our promises">
          {promises.map((p) => <li key={p} className="bg-ivory px-5 py-5 text-sm font-medium">{p}</li>)}
        </ul>
      </div>
    </section>
  )
}
