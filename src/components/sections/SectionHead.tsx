import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'

interface Props {
  num: string
  label: string
  title: ReactNode
  linkTo?: string
  linkLabel?: string
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  id?: string
}

/** Numbered editorial chapter heading ("02 / New arrivals"). */
export function SectionHead({ num, label, title, linkTo, linkLabel, tone = 'light', align = 'left', id }: Props) {
  return (
    <Reveal className={`mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-16 ${align === 'center' ? 'justify-center text-center' : ''}`}>
      <div>
        <p className={`t-label mb-4 flex items-center gap-3 ${tone === 'dark' ? 'text-zari' : 'text-kumkum'} ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="t-price">{num}</span><span aria-hidden="true" className="h-px w-8 bg-current" /><span>{label}</span>
        </p>
        <h2 id={id} className="t-display max-w-[16ch] [overflow-wrap:anywhere]">{title}</h2>
      </div>
      {linkTo && (
        <Link to={linkTo} className={`inline-flex min-h-11 items-center text-[12px] font-semibold uppercase tracking-[0.16em] underline underline-offset-8 ${tone === 'dark' ? 'text-ivory' : 'text-ink hover:text-kumkum'}`}>
          {linkLabel ?? 'View all'}
        </Link>
      )}
    </Reveal>
  )
}
