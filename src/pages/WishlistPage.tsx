import { Link as LinkIcon, ShoppingBag, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Button, LinkButton } from '../components/ui/Button'
import { usePageMeta } from '../hooks/usePageMeta'
import { useWishlist } from '../hooks/useStores'
import { getProductBySlug } from '../lib/catalog'
import { addToCart, toast, toggleWish, wishStore } from '../store/stores'
import type { Product } from '../data/types'

export default function WishlistPage() {
  usePageMeta('Wishlist', 'Sarees you have saved.')
  const saved = useWishlist()
  const [params] = useSearchParams()
  const sharedSlugs = (params.get('items') ?? '').split(',').filter(Boolean)
  const shared = sharedSlugs.map(getProductBySlug).filter((p): p is Product => !!p)
  const viewingShared = shared.length > 0
  const items = viewingShared ? shared : saved.map(getProductBySlug).filter((p): p is Product => !!p)

  const copyLink = async () => {
    const url = `${window.location.origin}/wishlist?items=${saved.join(',')}`
    try {
      await navigator.clipboard.writeText(url)
      toast('Wishlist link copied to clipboard')
    } catch {
      toast('Could not copy automatically. Copy the address from the box below.')
    }
  }
  const moveToCart = (p: Product) => {
    if (addToCart(p.id, p.colors[0].name)) {
      if (!viewingShared) wishStore.set((w) => w.filter((s) => s !== p.slug))
    }
  }

  return (
    <div className="wrap py-8 md:py-14">
      <h1 className="t-display mb-3">{viewingShared ? 'A shared wishlist' : 'Wishlist'}</h1>
      <p className="mb-8 text-muted" aria-live="polite">{items.length} {items.length === 1 ? 'saree' : 'sarees'}{viewingShared && ' shared with you'}</p>

      {items.length === 0 ? (
        <div className="mx-auto max-w-md py-12 text-center">
          <p className="font-display text-4xl">Nothing saved yet</p>
          <p className="mt-3 text-muted">Tap the heart on any saree to keep it here.</p>
          <LinkButton to="/sarees" className="mt-6">Explore sarees</LinkButton>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap gap-3">
            {viewingShared ? (
              <Button onClick={() => { shared.forEach((p) => !saved.includes(p.slug) && wishStore.set((w) => [...w, p.slug])); toast('Saved to your wishlist') }}>Save all to my wishlist</Button>
            ) : (
              <>
                <Button variant="outline" onClick={copyLink}><LinkIcon size={15} aria-hidden="true" /> Copy share link</Button>
                <input readOnly aria-label="Share link" value={`${window.location.origin}/wishlist?items=${saved.join(',')}`} onFocus={(e) => e.currentTarget.select()} className="hidden min-h-11 min-w-0 flex-1 border border-line bg-parchment px-3 text-xs text-muted md:block" />
              </>
            )}
          </div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {items.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} index={i} />
                <div className="mt-3 flex gap-2">
                  <Button className="flex-1 px-2" disabled={p.stock <= 0} onClick={() => moveToCart(p)}><ShoppingBag size={14} aria-hidden="true" /> {viewingShared ? 'Add to cart' : 'Move to cart'}</Button>
                  {!viewingShared && <button type="button" aria-label={`Remove ${p.name} from wishlist`} onClick={() => toggleWish(p.slug)} className="grid size-12 place-items-center border border-line hover:border-ink"><X size={16} /></button>}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
