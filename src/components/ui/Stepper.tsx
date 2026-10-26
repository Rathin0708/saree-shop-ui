import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  onChange: (n: number) => void
  max: number
  min?: number
  label?: string
}

export function Stepper({ value, onChange, max, min = 1, label = 'Quantity' }: Props) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center border border-line bg-parchment">
      <button type="button" aria-label={`Decrease ${label.toLowerCase()}`} onClick={() => onChange(value - 1)} disabled={value <= min && min > 0} className="grid size-11 place-items-center hover:bg-ink/5 disabled:opacity-35">
        <Minus size={14} />
      </button>
      <output aria-live="polite" className="t-price min-w-8 text-center text-sm font-medium">{value}</output>
      <button type="button" aria-label={`Increase ${label.toLowerCase()}`} onClick={() => onChange(value + 1)} disabled={value >= max} className="grid size-11 place-items-center hover:bg-ink/5 disabled:opacity-35">
        <Plus size={14} />
      </button>
    </div>
  )
}
