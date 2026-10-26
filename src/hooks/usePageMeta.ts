import { useEffect } from 'react'
import { brand } from '../config/brand'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.content = content
}

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const full = title ? `${title} — ${brand.name}` : `${brand.name} — ${brand.tagline}`
    document.title = full
    setMeta('property', 'og:title', full)
    if (description) { setMeta('name', 'description', description); setMeta('property', 'og:description', description) }
  }, [title, description])
}
