import { occasions } from '../../data/content'
import { getFabricCategories, type Filters } from '../../lib/catalog'
import { formatRupees } from '../../lib/money'

export interface Chip { id: string; label: string; remove: (f: Filters) => Filters }

export function chipsFor(f: Filters): Chip[] {
  const chips: Chip[] = []
  if (f.q) chips.push({ id: 'q', label: `“${f.q}”`, remove: (x) => ({ ...x, q: '' }) })
  for (const s of f.fabric) chips.push({ id: `fabric-${s}`, label: getFabricCategories().find((c) => c.slug === s)?.title ?? s, remove: (x) => ({ ...x, fabric: x.fabric.filter((v) => v !== s) }) })
  for (const s of f.collection) chips.push({ id: `col-${s}`, label: s, remove: (x) => ({ ...x, collection: x.collection.filter((v) => v !== s) }) })
  for (const s of f.occasion) chips.push({ id: `occ-${s}`, label: occasions.find((o) => o.slug === s)?.title ?? s, remove: (x) => ({ ...x, occasion: x.occasion.filter((v) => v !== s) }) })
  for (const s of f.color) chips.push({ id: `color-${s}`, label: s, remove: (x) => ({ ...x, color: x.color.filter((v) => v !== s) }) })
  for (const s of f.work) chips.push({ id: `work-${s}`, label: s, remove: (x) => ({ ...x, work: x.work.filter((v) => v !== s) }) })
  if (f.min || f.max) chips.push({ id: 'price', label: `${f.min ? formatRupees(f.min) : 'Any'} – ${f.max ? formatRupees(f.max) : 'Any'}`, remove: (x) => ({ ...x, min: 0, max: 0 }) })
  if (f.inStock) chips.push({ id: 'stock', label: 'In stock', remove: (x) => ({ ...x, inStock: false }) })
  if (f.onSale) chips.push({ id: 'sale', label: 'On sale', remove: (x) => ({ ...x, onSale: false }) })
  if (f.blouse) chips.push({ id: 'blouse', label: 'Blouse included', remove: (x) => ({ ...x, blouse: false }) })
  return chips
}
