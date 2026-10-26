import { motion } from 'motion/react'
import { useId, useRef, type KeyboardEvent } from 'react'

interface Props {
  tabs: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
  label: string
  panelId?: string
  tone?: 'light' | 'dark'
}

/** WAI-ARIA tabs with roving tabindex and arrow-key navigation. */
export function Tabs({ tabs, value, onChange, label, panelId, tone = 'light' }: Props) {
  const gid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const n =
      e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1
    if (n < 0) return
    e.preventDefault()
    onChange(tabs[n].id)
    refs.current[n]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
      {tabs.map((t, i) => {
        const sel = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            id={`${gid}-${t.id}`}
            aria-selected={sel}
            aria-controls={panelId}
            tabIndex={sel ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative min-h-11 shrink-0 px-4 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors ${
              sel ? (tone === 'dark' ? 'text-ivory' : 'text-kumkum') : tone === 'dark' ? 'text-ivory/70 hover:text-ivory' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
            {sel && <motion.span layoutId={`${gid}-ind`} className={`absolute inset-x-3 bottom-0 h-px ${tone === 'dark' ? 'bg-zari' : 'bg-kumkum'}`} />}
          </button>
        )
      })}
    </div>
  )
}
