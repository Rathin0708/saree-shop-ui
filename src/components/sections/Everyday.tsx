import { Link } from 'react-router-dom'
import { getProducts } from '../../lib/catalog'
import { ProductCard } from '../product/ProductCard'
import { SectionHead } from './SectionHead'

const bands = [3000, 5000, 10000]

export function Everyday() {
  const items = getProducts().filter((p) => p.occasion.includes('daily') || p.fabricSlug === 'cotton').slice(0, 6)
  return (
    <section aria-labelledby="every-title" className="section">
      <div className="wrap">
        <SectionHead num="09" label="Everyday elegance" id="every-title" title="Light enough to live in" linkTo="/occasion/daily" linkLabel="Shop everyday" />
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="t-label mr-2 text-muted">Shop by budget</span>
          {bands.map((b) => (
            <Link key={b} to={`/sarees?occasion=daily&max=${b}`} className="inline-flex min-h-11 items-center border border-line px-4 text-sm hover:border-kumkum hover:text-kumkum">
              Under ₹{b.toLocaleString('en-IN')}
            </Link>
          ))}
        </div>
      </div>
      <ul className="no-scrollbar flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pb-2 md:gap-6" aria-label="Everyday sarees">
        {items.map((p, i) => (
          <li key={p.id} className="w-[58vw] max-w-[320px] shrink-0 snap-start md:w-[24vw]">
            <ProductCard product={p} aspect="aspect-[3/4]" index={i} sizes="(min-width:768px) 24vw, 58vw" />
          </li>
        ))}
      </ul>
    </section>
  )
}
