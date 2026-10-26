import { Link, type LinkProps } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { btn, type Variant } from './buttonStyles'

export function Button({ variant = 'solid', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" {...p} className={btn(variant, className)} />
}
export function LinkButton({ variant = 'solid', className = '', ...p }: LinkProps & { variant?: Variant; children?: ReactNode }) {
  return <Link {...p} className={btn(variant, className)} />
}

export function IconButton({ label, className = '', children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...p}
      className={`inline-grid size-11 place-items-center rounded-full transition-colors duration-200 hover:bg-ink/5 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  )
}
