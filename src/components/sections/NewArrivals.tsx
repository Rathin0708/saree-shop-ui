import { getCollection } from '../../lib/catalog'
import { ProductCard } from '../product/ProductCard'
import { SectionHead } from './SectionHead'

const offsets = ['lg:mt-0', 'lg:mt-24', 'lg:mt-10', 'lg:mt-32']
const aspects = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[4/5]', 'aspect-[3/4]']

export function NewArrivals() {
  const items = (getCollection('new-arrivals')?.products ?? []).slice(0, 4)
  return (
    <section aria-labelledby="new-title" className="section bg-parchment">
      <div className="wrap">
        <SectionHead num="03" label="New arrivals" id="new-title" title="Just off the loom" linkTo="/collections/new-arrivals" />
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-8 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.id} className={`${i % 2 ? 'mt-10' : ''} ${offsets[i]}`}>
              <ProductCard product={p} aspect={aspects[i]} index={i} sizes="(min-width:1024px) 24vw, 48vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
