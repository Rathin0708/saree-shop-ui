export type Variant = 'solid' | 'outline' | 'ghost' | 'light' | 'outline-light'
const base =
  'relative inline-flex min-h-11 items-center justify-center gap-2 px-6 text-[12px] font-semibold uppercase tracking-[0.16em] transition-[background,color,border-color,transform] duration-300 disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.98] motion-reduce:active:scale-100'
const variants: Record<Variant, string> = {
  solid: 'bg-kumkum text-ivory hover:bg-kumkum-deep border border-kumkum',
  outline: 'border border-ink/70 text-ink hover:bg-ink hover:text-ivory',
  ghost: 'text-ink underline-offset-8 hover:underline',
  light: 'bg-ivory text-kumkum-deep border border-ivory hover:bg-parchment',
  'outline-light': 'border border-ivory/70 text-ivory hover:bg-ivory hover:text-kumkum-deep',
}
export const btn = (v: Variant = 'solid', extra = '') => `${base} ${variants[v]} ${extra}`
