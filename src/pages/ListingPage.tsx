import { LayoutGrid, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ActiveChips } from '../components/listing/ActiveChips'
import { chipsFor } from '../components/listing/chips'
import { FilterPanel } from '../components/listing/FilterPanel'
import { FilterSheet } from '../components/listing/FilterSheet'
import { useListing } from '../components/listing/useListing'
import { ProductCard } from '../components/product/ProductCard'
import { Button, LinkButton } from '../components/ui/Button'
import { Img } from '../components/ui/Img'
import { WovenDivider } from '../components/ui/WovenDivider'
import { getCategories, getCollection, getOccasion, filterProducts, sortProducts, sortLabels, type SortKey } from '../lib/catalog'
import { getProducts } from '../lib/catalog'
import { usePageMeta } from '../hooks/usePageMeta'
import { categories } from '../data/content'
import NotFound from './NotFound'

const PAGE = 6
const desktopCols: Record<number, string> = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }
const mobileCols: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2' }

export default function ListingPage({ mode }: { mode: 'all' | 'collection' | 'occasion' }) {
  const { slug = '' } = useParams()
  const { filters, sort, setFilters, setSort, apply, clearAll } = useListing()
  const [sheet, setSheet] = useState(false)
  const [dCols, setDCols] = useState(3)
  const [mCols, setMCols] = useState(2)

  const meta = useMemo(() => {
    if (mode === 'all') return { title: 'All Sarees', description: 'Every weave in the house: silk, brocade, ikat, cotton and designer sarees.', base: getProducts(), hero: categories[0].heroImage, hide: [] as ('fabric' | 'occasion')[] }
    if (mode === 'occasion') {
      const o = getOccasion(slug)
      return o ? { title: o.title, description: o.blurb, base: getProducts().filter((p) => p.occasion.includes(o.slug)), hero: o.image, hide: ['occasion' as const] } : null
    }
    const c = getCollection(slug)
    const kind = getCategories().find((x) => x.slug === slug)?.kind
    return c ? { title: c.title, description: c.description, base: c.products, hero: c.heroImage, hide: kind === 'fabric' ? ['fabric' as const] : [] } : null
  }, [mode, slug])

  usePageMeta(meta?.title ?? 'Not found', meta?.description)
  const [shown, setShown] = useState({ key: '', n: PAGE })
  const key = `${slug}|${JSON.stringify(filters)}|${sort}`

  const results = useMemo(() => (meta ? sortProducts(filterProducts(meta.base, filters), sort) : []), [meta, filters, sort])
  if (!meta) return <NotFound />

  const count = shown.key === key ? shown.n : PAGE
  const visible = results.slice(0, count)
  const remaining = results.length - visible.length
  const hasFilters = chipsFor(filters).length > 0
  const suggestions = getCategories().filter((c) => c.kind === 'fabric').slice(0, 4)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-kumkum-deep text-ivory on-dark">
        <Img image={meta.hero} sizes="100vw" decorative className="absolute inset-0 -z-10 size-full opacity-35" position="center 40%" eager />
        <div className="wrap py-14 md:py-24">
          <nav aria-label="Breadcrumb" className="t-label mb-6 text-ivory/70">
            <ol className="flex flex-wrap gap-2">
              <li><Link to="/" className="hover:text-ivory">Home</Link></li><li aria-hidden="true">/</li>
              <li><Link to="/sarees" className="hover:text-ivory">Sarees</Link></li>
              {mode !== 'all' && <><li aria-hidden="true">/</li><li aria-current="page">{meta.title}</li></>}
            </ol>
          </nav>
          <h1 className="t-display max-w-4xl">{meta.title}</h1>
          <p className="t-lead mt-5 max-w-[56ch] text-ivory/85">{meta.description}</p>
        </div>
        <WovenDivider />
      </section>

      <div className="wrap py-8 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm" aria-live="polite" role="status">
            <span className="t-price font-semibold">{results.length}</span> {results.length === 1 ? 'saree' : 'sarees'}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="lg:hidden" onClick={() => setSheet(true)}><SlidersHorizontal size={15} aria-hidden="true" /> Filter & sort</Button>
            <div className="hidden items-center gap-1 lg:flex" role="group" aria-label="Grid density">
              <LayoutGrid size={16} aria-hidden="true" className="mr-1 text-muted" />
              {[2, 3, 4].map((n) => <button key={n} type="button" aria-pressed={dCols === n} aria-label={`${n} columns`} onClick={() => setDCols(n)} className={`size-11 text-sm ${dCols === n ? 'font-semibold text-kumkum underline underline-offset-8' : 'text-muted'}`}>{n}</button>)}
            </div>
            <div className="flex items-center gap-1 lg:hidden" role="group" aria-label="Grid density">
              {[1, 2].map((n) => <button key={n} type="button" aria-pressed={mCols === n} aria-label={`${n} column${n > 1 ? 's' : ''}`} onClick={() => setMCols(n)} className={`size-11 text-sm ${mCols === n ? 'font-semibold text-kumkum underline underline-offset-8' : 'text-muted'}`}>{n}</button>)}
            </div>
            <div className="hidden lg:block">
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="min-h-11 border border-line bg-parchment px-3 text-sm">
                {(Object.keys(sortLabels) as SortKey[]).map((k) => <option key={k} value={k}>{sortLabels[k]}</option>)}
              </select>
            </div>
          </div>
        </div>
        {hasFilters && <div className="py-4"><ActiveChips filters={filters} onChange={(f) => setFilters(f)} onClear={clearAll} /></div>}

        <div className="mt-6 grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-32 max-h-[calc(100dvh-9rem)] overflow-y-auto pr-3">
              <FilterPanel filters={filters} onChange={setFilters} hide={meta.hide} />
            </div>
          </aside>
          <div>
            {results.length === 0 ? (
              <div className="mx-auto max-w-xl py-16 text-center">
                <p className="font-display text-4xl">No sarees match these filters.</p>
                <p className="mt-3 text-muted">Loosen a filter or begin again. Or browse a fabric below.</p>
                <Button className="mt-6" onClick={clearAll}>Reset filters</Button>
                <ul className="mt-10 flex flex-wrap justify-center gap-2">
                  {suggestions.map((c) => <li key={c.slug}><LinkButton variant="outline" to={`/collections/${c.slug}`}>{c.title}</LinkButton></li>)}
                </ul>
              </div>
            ) : (
              <>
                <ul className={`grid gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-14 ${mobileCols[mCols]} md:grid-cols-3 ${desktopCols[dCols]}`}>
                  {visible.map((p, i) => <li key={p.id}><ProductCard product={p} index={i} sizes="(min-width:1024px) 30vw, 50vw" /></li>)}
                </ul>
                <div className="mt-14 flex flex-col items-center gap-3">
                  <p className="text-sm text-muted">Showing {visible.length} of {results.length}</p>
                  {remaining > 0 && <Button variant="outline" onClick={() => setShown({ key, n: count + PAGE })}>Load {Math.min(PAGE, remaining)} more ({remaining} remaining)</Button>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <FilterSheet open={sheet} onClose={() => setSheet(false)} base={meta.base} filters={filters} sort={sort} hide={meta.hide} onApply={apply} />
    </>
  )
}
