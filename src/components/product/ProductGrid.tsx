import type { Product } from '../../data/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, cols = 'grid-cols-2 lg:grid-cols-4', gap = 'gap-x-3 gap-y-9 md:gap-x-6 md:gap-y-14' }: { products: Product[]; cols?: string; gap?: string }) {
  return (
    <ul className={`grid ${cols} ${gap}`}>
      {products.map((p, i) => (
        <li key={p.id}><ProductCard product={p} index={i} /></li>
      ))}
    </ul>
  )
}
