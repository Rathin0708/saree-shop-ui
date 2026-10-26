export function WovenDivider({ className = '', thin = false }: { className?: string; thin?: boolean }) {
  return <div aria-hidden="true" className={`${thin ? 'woven-line' : 'woven'} ${className}`} />
}
