import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { footerLinks } from '../../data/content'
import { getFabricCategories } from '../../lib/catalog'
import { WovenDivider } from '../ui/WovenDivider'

const YEAR = new Date().getFullYear()
const col = 'space-y-1'
const link = 'inline-flex min-h-9 items-center text-[15px] text-ivory/80 hover:text-ivory hover:underline underline-offset-4'

export function Footer() {
  const socials = Object.entries(brand.social).filter(([, url]) => url)
  return (
    <footer className="on-dark bg-kumkum-deep text-ivory">
      <div className="wrap pt-16 md:pt-24">
        <p className="font-display text-[clamp(3.5rem,17vw,17rem)] font-medium leading-[0.85] tracking-[0.06em] text-ivory/95" aria-hidden="true">{brand.name}</p>
        <WovenDivider className="mt-8" />
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl italic">{brand.tagline}</p>
            <p className="mt-3 text-sm text-ivory/70">
              <span lang={brand.accent.lang} className="font-script text-lg text-ivory">{brand.accent.text}</span> is Tamil for {brand.accent.meaning}.
            </p>
          </div>
          <nav aria-label="Shop">
            <p className="t-label mb-3 text-zari">Shop</p>
            <ul className={col}>
              {getFabricCategories().map((c) => <li key={c.slug}><Link className={link} to={`/collections/${c.slug}`}>{c.title}</Link></li>)}
              <li><Link className={link} to="/occasion/bridal">Bridal</Link></li>
              <li><Link className={link} to="/collections/new-arrivals">New Arrivals</Link></li>
            </ul>
          </nav>
          <nav aria-label="Help">
            <p className="t-label mb-3 text-zari">Help</p>
            <ul className={col}>{footerLinks.help.map((l) => <li key={l.label}><Link className={link} to={l.to}>{l.label}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Company and legal">
            <p className="t-label mb-3 text-zari">Company</p>
            <ul className={col}>{footerLinks.company.map((l) => <li key={l.label}><Link className={link} to={l.to}>{l.label}</Link></li>)}</ul>
            <p className="t-label mb-3 mt-6 text-zari">Legal</p>
            <ul className={col}>{footerLinks.legal.map((l) => <li key={l.label}><Link className={link} to={l.to}>{l.label}</Link></li>)}</ul>
          </nav>
          <div>
            <p className="t-label mb-3 text-zari">Visit & write</p>
            <address className="text-[15px] not-italic leading-relaxed text-ivory/80">
              {brand.contact.address}<br />
              {brand.contact.hours}<br />
              <a className="underline underline-offset-4" href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a><br />
              {brand.contact.phone}
            </address>
            {socials.length > 0 && (
              <ul className="mt-4 flex gap-4">
                {socials.map(([name, url]) => <li key={name}><a href={url} className="inline-flex min-h-11 items-center text-sm capitalize underline underline-offset-4" rel="noopener noreferrer" target="_blank">{name}</a></li>)}
              </ul>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ivory/15 py-6 text-xs text-ivory/70">
          <p>© {YEAR} {brand.name}. Demo storefront: no payments, orders or accounts are active.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Payment methods (demo only)">
            {['UPI', 'Card', 'Cash on delivery'].map((m) => <li key={m} className="border border-ivory/25 px-2 py-1 uppercase tracking-[0.12em]">{m} · Demo</li>)}
          </ul>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })} className="inline-flex min-h-11 items-center gap-2 font-semibold uppercase tracking-[0.14em] hover:text-ivory">
            Back to top <ArrowUp size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
