import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

const control = 'min-h-12 w-full border bg-parchment px-4 text-[15px] placeholder:text-muted/70 focus-visible:outline-offset-0'

export function Field({ label, error, hint, className = '', ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="t-label mb-2 block text-muted">{label}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} {...p} className={`${control} ${error ? 'border-danger' : 'border-line'}`} />
      {hint && !error && <p id={`${id}-h`} className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-e`} className="mt-1.5 text-xs font-medium text-danger">Error: {error}</p>}
    </div>
  )
}

export function SelectField({ label, error, children, className = '', ...p }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; children: ReactNode }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="t-label mb-2 block text-muted">{label}</label>
      <select id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...p} className={`${control} ${error ? 'border-danger' : 'border-line'}`}>
        {children}
      </select>
      {error && <p id={`${id}-e`} className="mt-1.5 text-xs font-medium text-danger">Error: {error}</p>}
    </div>
  )
}
