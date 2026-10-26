import { X } from 'lucide-react'
import type { Filters } from '../../lib/catalog'
import { chipsFor } from './chips'


export function ActiveChips({ filters, onChange, onClear }: { filters: Filters; onChange: (f: Filters) => void; onClear: () => void }) {
  const chips = chipsFor(filters)
  if (!chips.length) return null
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.id}>
          <button type="button" onClick={() => onChange(c.remove(filters))} aria-label={`Remove filter ${c.label}`} className="inline-flex min-h-11 items-center gap-2 border border-ink/30 bg-parchment px-3 text-sm hover:border-kumkum">
            {c.label} <X size={14} aria-hidden="true" />
          </button>
        </li>
      ))}
      <li><button type="button" onClick={onClear} className="min-h-11 px-2 text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">Clear all</button></li>
    </ul>
  )
}
