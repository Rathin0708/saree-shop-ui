import { Heart } from 'lucide-react'
import { useId } from 'react'
import type { ColorVariant, Product } from '../../data/types'
import { useIsWished } from '../../hooks/useStores'
import { formatRupees, percentOff } from '../../lib/money'
import { toggleWish } from '../../store/stores'


export function PriceTag({ product, size = 'md' }: { product: Product; size?: 'md' | 'lg' }) {
  const off = percentOff(product.price, product.compareAtPrice)
  return (
    <p className={`t-price flex flex-wrap items-baseline gap-x-2 ${size === 'lg' ? 'text-2xl' : 'text-[15px]'}`}>
      <span className="font-semibold">{formatRupees(product.price)}</span>
      {off > 0 && product.compareAtPrice && (
        <>
          <s className="text-muted" aria-label={`Original price ${formatRupees(product.compareAtPrice)}`}>{formatRupees(product.compareAtPrice)}</s>
          <span className="text-xs font-semibold text-kumkum">Save {formatRupees(product.compareAtPrice - product.price)}</span>
        </>
      )}
    </p>
  )
}

export function ColorSwatches({ colors, value, onChange, size = 20 }: { colors: ColorVariant[]; value: string; onChange: (name: string) => void; size?: number }) {
  const name = useId()
  return (
    <div role="radiogroup" aria-label="Colour" className="flex flex-wrap items-center gap-1">
      {colors.map((c) => {
        const sel = c.name === value
        return (
          <label key={c.name} className="relative inline-grid size-11 cursor-pointer place-items-center has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-kumkum">
            <input type="radio" name={name} value={c.name} checked={sel} onChange={() => onChange(c.name)} className="sr-only" />
            <span className={`block rounded-full border transition-[box-shadow] ${sel ? 'border-ivory shadow-[0_0_0_2px_var(--color-ink)]' : 'border-line'}`} style={{ width: size, height: size, background: c.hex }} />
            <span className="sr-only">{c.name}{sel ? ' (selected)' : ''}</span>
          </label>
        )
      })}
    </div>
  )
}

export function WishlistButton({ product, className = '', tone = 'light' }: { product: Product; className?: string; tone?: 'light' | 'plain' }) {
  const wished = useIsWished(product.slug)
  return (
    <button
      type="button"
      aria-pressed={wished}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      onClick={(e) => {
        e.preventDefault()
        toggleWish(product.slug)
      }}
      className={`group/heart inline-grid size-11 place-items-center rounded-full transition-colors ${tone === 'light' ? 'bg-ivory/85 hover:bg-ivory' : 'hover:bg-ink/5'} ${className}`}
    >
      <Heart size={19} aria-hidden="true" className={`transition-transform duration-300 ease-[var(--ease-reveal)] ${wished ? 'scale-110 fill-kumkum stroke-kumkum' : 'group-active/heart:scale-125'}`} />
    </button>
  )
}
