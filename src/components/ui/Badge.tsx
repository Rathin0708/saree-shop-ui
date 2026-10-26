import type { ReactNode } from 'react'

export function Badge({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'kumkum' | 'peacock' }) {
  const t = { light: 'bg-ivory text-ink', kumkum: 'bg-kumkum text-ivory', peacock: 'bg-peacock text-ivory' }[tone]
  return <span className={`inline-block px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.14em] ${t}`}>{children}</span>
}
