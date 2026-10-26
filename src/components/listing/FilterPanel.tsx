import { useId } from 'react'
import { getFabricCategories, priceBounds, allColorFamilies, type Filters } from '../../lib/catalog'
import { occasions } from '../../data/content'
import { products } from '../../data/products'
import { formatRupees } from '../../lib/money'
import type { Work } from '../../data/types'

const works: Work[] = ['Zari', 'Embroidered', 'Printed', 'Woven', 'Plain']
const collections = ['Heirloom', 'Festive', 'Contemporary', 'Everyday']

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5">
      <legend className="t-label float-left mb-3 w-full text-ink">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  )
}

function Check({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: (v: boolean) => void; count?: number }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-[18px] accent-[var(--color-kumkum)]" />
      <span className="flex-1">{label}</span>
      {count != null && <span className="t-price text-xs text-muted">{count}</span>}
    </label>
  )
}

const toggle = (arr: string[], v: string, on: boolean) => (on ? [...arr, v] : arr.filter((x) => x !== v))

function PriceRange({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const b = priceBounds()
  const id = useId()
  const lo = min || b.min
  const hi = max || b.max
  const set = (a: number, z: number) => {
    const A = Math.max(b.min, Math.min(a, z))
    const Z = Math.min(b.max, Math.max(z, a))
    onChange(A <= b.min ? 0 : A, Z >= b.max ? 0 : Z)
  }
  const pct = (v: number) => ((v - b.min) / (b.max - b.min)) * 100
  return (
    <div>
      <div className="relative mx-2 h-11">
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-line" />
        <div className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-kumkum" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        {([['Minimum price', lo, (v: number) => set(v, hi)], ['Maximum price', hi, (v: number) => set(lo, v)]] as const).map(([label, val, fn]) => (
          <input key={label} type="range" aria-label={label} min={b.min} max={b.max} step={500} value={val} onChange={(e) => fn(Number(e.target.value))}
            className="pointer-events-none absolute inset-0 size-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ivory [&::-moz-range-thumb]:bg-kumkum [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ivory [&::-webkit-slider-thumb]:bg-kumkum [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--color-kumkum)]" />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor={`${id}-min`} className="sr-only">Minimum price in rupees</label>
          <input id={`${id}-min`} inputMode="numeric" value={lo} onChange={(e) => set(Number(e.target.value.replace(/\D/g, '')) || b.min, hi)} className="t-price min-h-11 w-full border border-line bg-parchment px-3 text-sm" />
        </div>
        <span aria-hidden="true">–</span>
        <div className="flex-1">
          <label htmlFor={`${id}-max`} className="sr-only">Maximum price in rupees</label>
          <input id={`${id}-max`} inputMode="numeric" value={hi} onChange={(e) => set(lo, Number(e.target.value.replace(/\D/g, '')) || b.max)} className="t-price min-h-11 w-full border border-line bg-parchment px-3 text-sm" />
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">{formatRupees(lo)} to {formatRupees(hi)}</p>
    </div>
  )
}

interface Props { filters: Filters; onChange: (f: Filters, replace?: boolean) => void; hide?: ('fabric' | 'occasion')[] }

export function FilterPanel({ filters: f, onChange, hide = [] }: Props) {
  const set = (patch: Partial<Filters>, replace = false) => onChange({ ...f, ...patch }, replace)
  const count = (fn: (p: (typeof products)[number]) => boolean) => products.filter(fn).length
  return (
    <div>
      {!hide.includes('fabric') && (
        <Group title="Fabric">
          {getFabricCategories().map((c) => (
            <Check key={c.slug} label={c.title} checked={f.fabric.includes(c.slug)} count={count((p) => p.fabricSlug === c.slug)} onChange={(v) => set({ fabric: toggle(f.fabric, c.slug, v) })} />
          ))}
        </Group>
      )}
      <Group title="Collection">
        {collections.map((c) => <Check key={c} label={c} checked={f.collection.includes(c)} count={count((p) => p.collection === c)} onChange={(v) => set({ collection: toggle(f.collection, c, v) })} />)}
      </Group>
      {!hide.includes('occasion') && (
        <Group title="Occasion">
          {occasions.map((o) => <Check key={o.slug} label={o.title} checked={f.occasion.includes(o.slug)} count={count((p) => p.occasion.includes(o.slug))} onChange={(v) => set({ occasion: toggle(f.occasion, o.slug, v) })} />)}
        </Group>
      )}
      <Group title="Colour">
        <div role="group" aria-label="Colour" className="flex flex-wrap gap-1">
          {allColorFamilies().map((c) => {
            const on = f.color.includes(c.name)
            return (
              <button key={c.name} type="button" aria-pressed={on} aria-label={c.name} title={c.name} onClick={() => set({ color: toggle(f.color, c.name, !on) })} className="grid size-11 place-items-center">
                <span className={`block size-6 rounded-full border ${on ? 'border-ivory shadow-[0_0_0_2px_var(--color-ink)]' : 'border-line'}`} style={{ background: c.hex }} />
              </button>
            )
          })}
        </div>
      </Group>
      <Group title="Price">
        <PriceRange min={f.min} max={f.max} onChange={(min, max) => set({ min, max }, true)} />
      </Group>
      <Group title="Weave & work">
        {works.map((w) => <Check key={w} label={w} checked={f.work.includes(w)} count={count((p) => p.work.includes(w))} onChange={(v) => set({ work: toggle(f.work, w, v) })} />)}
      </Group>
      <Group title="More">
        <Check label="In stock only" checked={f.inStock} onChange={(v) => set({ inStock: v })} />
        <Check label="On sale" checked={f.onSale} onChange={(v) => set({ onSale: v })} />
        <Check label="Blouse piece included" checked={f.blouse} onChange={(v) => set({ blouse: v })} />
      </Group>
    </div>
  )
}
