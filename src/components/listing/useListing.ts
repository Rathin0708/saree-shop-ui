import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { emptyFilters, sortLabels, type Filters, type SortKey } from '../../lib/catalog'

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0
}

/** Reads and writes the full listing state to the URL so views are shareable and back/forward works. */
export function useListing() {
  const [params, setParams] = useSearchParams()
  const filters: Filters = useMemo(
    () => ({
      q: params.get('q') ?? '',
      fabric: list(params.get('fabric')),
      collection: list(params.get('collection')),
      occasion: list(params.get('occasion')),
      color: list(params.get('color')),
      work: list(params.get('work')),
      min: num(params.get('min')),
      max: num(params.get('max')),
      inStock: params.get('stock') === '1',
      onSale: params.get('sale') === '1',
      blouse: params.get('blouse') === '1',
    }),
    [params],
  )
  const sortParam = params.get('sort') as SortKey | null
  const sort: SortKey = sortParam && sortParam in sortLabels ? sortParam : 'featured'

  const write = useCallback(
    (f: Filters, s: SortKey, replace = false) => {
      const p = new URLSearchParams()
      if (f.q) p.set('q', f.q)
      for (const k of ['fabric', 'collection', 'occasion', 'color', 'work'] as const) if (f[k].length) p.set(k, f[k].join(','))
      if (f.min) p.set('min', String(f.min))
      if (f.max) p.set('max', String(f.max))
      if (f.inStock) p.set('stock', '1')
      if (f.onSale) p.set('sale', '1')
      if (f.blouse) p.set('blouse', '1')
      if (s !== 'featured') p.set('sort', s)
      setParams(p, { replace })
    },
    [setParams],
  )

  return {
    filters,
    sort,
    setFilters: (f: Filters, replace = false) => write(f, sort, replace),
    setSort: (s: SortKey) => write(filters, s),
    apply: (f: Filters, s: SortKey) => write(f, s),
    clearAll: () => write({ ...emptyFilters }, sort),
  }
}
