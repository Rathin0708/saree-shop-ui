import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { WovenDivider } from '../ui/WovenDivider'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label={`${brand.name}, home`} className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <span className="font-display text-[clamp(1.1rem,5.6vw,1.7rem)] font-medium leading-none tracking-[0.26em] text-kumkum sm:tracking-[0.34em] md:text-[2rem]">{brand.name}</span>
      <WovenDivider thin className="w-full" />
    </Link>
  )
}
