import { Link } from 'react-router-dom'
import { navigation, occasions } from '../../data/content'
import { countIn, getCategories, getFabricCategories } from '../../lib/catalog'
import { Img } from '../ui/Img'

export function MegaMenu({ kind, onNavigate }: { kind: 'sarees' | 'occasions'; onNavigate: () => void }) {
  const fabrics = getFabricCategories()
  const cats = getCategories()
  const feature = cats.find((c) => c.slug === 'kanjivaram-silk') ?? cats[0]
  return (
    <div className="border-b border-line bg-ivory">
      <div className="wrap py-8">
        {kind === 'sarees' ? (
          <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr] gap-10">
            <div>
              <p className="t-label mb-4 text-muted">By fabric</p>
              <ul className="space-y-1">
                {fabrics.map((c) => (
                  <li key={c.slug}>
                    <Link onClick={onNavigate} to={`/collections/${c.slug}`} className="group flex min-h-9 items-baseline justify-between gap-3 hover:text-kumkum">
                      <span className="font-display text-xl">{c.title}</span>
                      <span className="t-price text-xs text-muted">{countIn(c)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label mb-4 text-muted">By price</p>
              <ul className="space-y-1">
                {navigation.priceBands.map((b) => (
                  <li key={b.to}><Link onClick={onNavigate} to={b.to} className="flex min-h-9 items-center font-display text-xl hover:text-kumkum">{b.label}</Link></li>
                ))}
              </ul>
              <p className="t-label mb-4 mt-8 text-muted">Curated</p>
              <ul className="space-y-1">
                <li><Link onClick={onNavigate} to="/collections/new-arrivals" className="flex min-h-9 items-center font-display text-xl hover:text-kumkum">New Arrivals</Link></li>
                <li><Link onClick={onNavigate} to="/collections/best-sellers" className="flex min-h-9 items-center font-display text-xl hover:text-kumkum">Best Sellers</Link></li>
              </ul>
            </div>
            <div>
              <p className="t-label mb-4 text-muted">By moment</p>
              <ul className="space-y-1">
                {cats.filter((c) => c.kind === 'occasion').map((c) => (
                  <li key={c.slug}><Link onClick={onNavigate} to={`/collections/${c.slug}`} className="flex min-h-9 items-center font-display text-xl hover:text-kumkum">{c.title}</Link></li>
                ))}
                <li><Link onClick={onNavigate} to="/sarees" className="flex min-h-9 items-center text-sm font-semibold underline underline-offset-4">View all sarees</Link></li>
              </ul>
            </div>
            <Link onClick={onNavigate} to={`/collections/${feature.slug}`} className="group relative block aspect-[16/10] overflow-hidden bg-parchment">
              <Img image={feature.heroImage} sizes="320px" className="size-full transition-transform duration-[1200ms] group-hover:scale-105 motion-reduce:transition-none" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-10 text-ivory">
                <span className="t-label block">Editorial</span>
                <span className="font-display text-2xl">The {feature.title} edit</span>
              </span>
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-5 gap-5">
            {occasions.map((o) => (
              <li key={o.slug}>
                <Link onClick={onNavigate} to={`/occasion/${o.slug}`} className="group block">
                  <span className="relative block aspect-[3/4] overflow-hidden bg-parchment">
                    <Img image={o.image} sizes="220px" className="size-full transition-transform duration-[1200ms] group-hover:scale-105 motion-reduce:transition-none" />
                  </span>
                  <span className="mt-2 block font-display text-2xl group-hover:text-kumkum">{o.title}</span>
                  <span className="block text-xs text-muted">{o.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
