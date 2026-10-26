import { useState } from 'react'
import { filterProducts, sortLabels, type Filters, type SortKey } from '../../lib/catalog'
import type { Product } from '../../data/types'
import { Button } from '../ui/Button'
import { Overlay } from '../ui/Overlay'
import { FilterPanel } from './FilterPanel'

interface Props { open: boolean; onClose: () => void; base: Product[]; filters: Filters; sort: SortKey; onApply: (f: Filters, s: SortKey) => void; hide?: ('fabric' | 'occasion')[] }

function Inner({ onClose, base, filters, sort, onApply, hide }: Omit<Props, 'open'>) {
  const [draft, setDraft] = useState(filters)
  const [draftSort, setDraftSort] = useState(sort)
  const n = filterProducts(base, draft).length
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-line px-6 pb-3">
        <h2 className="text-3xl">Filter & sort</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
        <fieldset className="border-b border-line py-5">
          <legend className="t-label mb-2 float-left w-full">Sort by</legend>
          <div className="clear-both">
            {(Object.keys(sortLabels) as SortKey[]).map((k) => (
              <label key={k} className="flex min-h-11 items-center gap-3 text-[15px]">
                <input type="radio" name="sheet-sort" checked={draftSort === k} onChange={() => setDraftSort(k)} className="size-[18px] accent-[var(--color-kumkum)]" /> {sortLabels[k]}
              </label>
            ))}
          </div>
        </fieldset>
        <FilterPanel filters={draft} onChange={(f) => setDraft(f)} hide={hide} />
      </div>
      <div className="grid shrink-0 grid-cols-[auto_1fr] gap-3 border-t border-line bg-parchment px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <Button variant="outline" onClick={() => { setDraft({ ...draft, q: '', fabric: hide?.includes('fabric') ? draft.fabric : [], collection: [], occasion: hide?.includes('occasion') ? draft.occasion : [], color: [], work: [], min: 0, max: 0, inStock: false, onSale: false, blouse: false }); setDraftSort('featured') }}>Reset</Button>
        <Button onClick={() => { onApply(draft, draftSort); onClose() }} aria-live="polite">Show {n} {n === 1 ? 'saree' : 'sarees'}</Button>
      </div>
    </div>
  )
}

export function FilterSheet(props: Props) {
  const { open, ...rest } = props
  return (
    <Overlay open={open} onClose={props.onClose} label="Filter and sort" side="bottom">
      <Inner {...rest} />
    </Overlay>
  )
}
