import { ArrowRight, Search } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { popularSearches } from '../../data/content'
import { getFabricCategories, highlightParts, searchProducts } from '../../lib/catalog'
import { formatRupees } from '../../lib/money'
import { closeOverlay } from '../../store/stores'
import { Img } from '../ui/Img'
import { Overlay } from '../ui/Overlay'

function Highlight({ text, q }: { text: string; q: string }) {
  return <>{highlightParts(text, q).map((p, i) => (p.hit ? <mark key={i}>{p.t}</mark> : <span key={i}>{p.t}</span>))}</>
}

/** Full-screen client-side search with synonyms, debounced input and arrow-key navigation. */
export default function SearchOverlay() {
  const navigate = useNavigate()
  const [raw, setRaw] = useState('')
  const [q, setQ] = useState('')
  const [active, setActive] = useState(-1)
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => { setQ(raw.trim()); setActive(-1) }, 160)
    return () => window.clearTimeout(t)
  }, [raw])

  const results = useMemo(() => searchProducts(q, 8), [q])
  const total = useMemo(() => searchProducts(q, 500).length, [q])
  const go = (to: string) => { closeOverlay(); navigate(to) }

  const onKey = (e: React.KeyboardEvent) => {
    if (!results.length) { if (e.key === 'Enter' && q) go(`/sarees?q=${encodeURIComponent(q)}`); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % results.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? results.length - 1 : a - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(active >= 0 ? `/saree/${results[active].slug}` : `/sarees?q=${encodeURIComponent(q)}`) }
  }

  return (
    <Overlay open onClose={closeOverlay} label="Search" side="full" initialFocus="#site-search">
      <div className="wrap flex min-h-dvh flex-col pb-16 pt-20 md:pt-28">
        <label htmlFor="site-search" className="t-label text-muted">Search the collection</label>
        <div className="mt-3 flex items-center gap-4 border-b border-ink">
          <Search size={28} aria-hidden="true" className="shrink-0 text-kumkum" />
          <input
            id="site-search" ref={inputRef} role="combobox" aria-expanded={results.length > 0} aria-controls={listId} aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            value={raw} onChange={(e) => setRaw(e.target.value)} onKeyDown={onKey} autoComplete="off" spellCheck={false}
            placeholder="Kanjivaram, wedding, pattu…" className="min-w-0 flex-1 bg-transparent py-3 font-display text-[clamp(2rem,6vw,4.5rem)] placeholder:text-muted/50 focus:outline-none"
          />
        </div>
        <p className="sr-only" aria-live="polite">{q ? `${total} results for ${q}` : ''}</p>

        {!q ? (
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <p className="t-label mb-4 text-muted">Popular searches</p>
              <ul className="flex flex-wrap gap-2">
                {popularSearches.map((s) => (
                  <li key={s}><button type="button" onClick={() => setRaw(s)} className="min-h-11 border border-line bg-parchment px-4 text-sm hover:border-kumkum">{s}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label mb-4 text-muted">Shop by fabric</p>
              <ul className="flex flex-wrap gap-2">
                {getFabricCategories().map((c) => (
                  <li key={c.slug}><button type="button" onClick={() => go(`/collections/${c.slug}`)} className="min-h-11 border border-line px-4 font-display text-lg hover:border-kumkum">{c.title}</button></li>
                ))}
              </ul>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-12 max-w-xl">
            <p className="font-display text-3xl">Nothing matches “{q}”.</p>
            <p className="mt-3 text-muted">Try a fabric (Kanjivaram, cotton), an occasion (wedding, office) or a colour.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {popularSearches.map((s) => <li key={s}><button type="button" onClick={() => setRaw(s)} className="min-h-11 border border-line px-4 text-sm hover:border-kumkum">{s}</button></li>)}
            </ul>
          </div>
        ) : (
          <div className="mt-8">
            <ul id={listId} role="listbox" aria-label="Search results" className="grid gap-x-8 md:grid-cols-2">
              {results.map((p, i) => (
                <li key={p.id} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <Link to={`/saree/${p.slug}`} onClick={closeOverlay} tabIndex={-1} className={`flex items-center gap-4 border-b border-line p-3 ${i === active ? 'bg-parchment' : 'hover:bg-parchment'}`}>
                    <span className="block h-24 w-[72px] shrink-0 overflow-hidden bg-parchment"><Img image={p.colors[0].images.drape} sizes="80px" className="size-full" /></span>
                    <span className="min-w-0">
                      <span className="t-label block text-muted">{p.fabric}</span>
                      <span className="block font-display text-xl leading-tight"><Highlight text={p.name} q={q} /></span>
                      <span className="t-price text-sm">{formatRupees(p.price)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to={`/sarees?q=${encodeURIComponent(q)}`} onClick={closeOverlay} className="mt-6 inline-flex min-h-11 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] underline underline-offset-8">
              See all {total} results <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </Overlay>
  )
}
