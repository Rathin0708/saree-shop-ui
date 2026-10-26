import { categories, occasions, synonyms } from '../data/content'
import { products } from '../data/products'
import type { Category, ColorVariant, Product } from '../data/types'
import { percentOff } from './money'

/* ---------- Data-access layer: swap these for an API/CMS later ---------- */
export const getProducts = (): Product[] => products
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug)
export const getProductById = (id: string) => products.find((p) => p.id === id)
export const getOccasion = (slug: string) => occasions.find((o) => o.slug === slug)

const occasionForCategory: Record<string, string> = { bridal: 'bridal', 'party-wear': 'party', 'lightweight-daily-wear': 'daily' }

export function inCategory(p: Product, cat: Category) {
  return cat.kind === 'fabric' ? p.fabricSlug === cat.slug : p.occasion.includes(occasionForCategory[cat.slug] as never)
}

/** Only enabled categories that actually have stock-keeping products are rendered. */
export const getCategories = (): Category[] =>
  categories.filter((c) => c.enabled && products.some((p) => inCategory(p, c))).sort((a, b) => a.order - b.order)
export const getFabricCategories = () => getCategories().filter((c) => c.kind === 'fabric')
export const countIn = (cat: Category) => products.filter((p) => inCategory(p, cat)).length

export interface CollectionDef {
  slug: string
  title: string
  description: string
  heroImage: Category['heroImage']
  products: Product[]
}

export function getCollection(slug: string): CollectionDef | undefined {
  if (slug === 'new-arrivals')
    return { slug, title: 'New Arrivals', description: 'The latest weaves, freshly unfolded.', heroImage: categories[0].heroImage,
      products: [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8) }
  if (slug === 'best-sellers')
    return { slug, title: 'Best Sellers', description: 'The sarees most often chosen.', heroImage: categories[1].heroImage, products: products.filter((p) => p.isBestseller) }
  const cat = getCategories().find((c) => c.slug === slug)
  if (!cat) return undefined
  return { slug, title: cat.title, description: cat.description, heroImage: cat.heroImage, products: products.filter((p) => inCategory(p, cat)) }
}

/* ---------- Filtering ---------- */
export interface Filters {
  q: string
  fabric: string[]
  collection: string[]
  occasion: string[]
  color: string[]
  work: string[]
  min: number
  max: number
  inStock: boolean
  onSale: boolean
  blouse: boolean
}
export const emptyFilters: Filters = { q: '', fabric: [], collection: [], occasion: [], color: [], work: [], min: 0, max: 0, inStock: false, onSale: false, blouse: false }
export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'best' | 'discount'
export const sortLabels: Record<SortKey, string> = {
  featured: 'Featured', newest: 'Newest', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', best: 'Best selling', discount: 'Biggest discount',
}

export const priceBounds = () => {
  const prices = products.map((p) => p.price)
  return { min: Math.floor(Math.min(...prices) / 500) * 500, max: Math.ceil(Math.max(...prices) / 1000) * 1000 }
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** AND across groups, OR within a group. */
export function filterProducts(list: Product[], f: Filters): Product[] {
  return list.filter((p) => {
    if (f.q && !matchesQuery(p, f.q)) return false
    if (f.fabric.length && !f.fabric.includes(p.fabricSlug)) return false
    if (f.collection.length && !f.collection.includes(p.collection)) return false
    if (f.occasion.length && !p.occasion.some((o) => f.occasion.includes(o))) return false
    if (f.color.length && !p.colors.some((c) => f.color.includes(c.family))) return false
    if (f.work.length && !p.work.some((w) => f.work.includes(w))) return false
    if (f.min && p.price < f.min) return false
    if (f.max && p.price > f.max) return false
    if (f.inStock && p.stock <= 0) return false
    if (f.onSale && percentOff(p.price, p.compareAtPrice) === 0) return false
    if (f.blouse && !p.blousePiece.included) return false
    return true
  })
}

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const l = [...list]
  switch (key) {
    case 'newest': return l.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'price-asc': return l.sort((a, b) => a.price - b.price)
    case 'price-desc': return l.sort((a, b) => b.price - a.price)
    case 'best': return l.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller))
    case 'discount': return l.sort((a, b) => percentOff(b.price, b.compareAtPrice) - percentOff(a.price, a.compareAtPrice))
    default: return l
  }
}

/* ---------- Search with synonyms ---------- */
const haystack = (p: Product) =>
  norm([p.name, p.fabric, p.collection, p.weave, ...p.occasion, ...p.tags, ...p.work, ...p.colors.map((c) => `${c.name} ${c.family}`)].join(' '))

export const queryTerms = (q: string): string[][] =>
  norm(q).split(/[^a-z0-9]+/).filter(Boolean).map((t) => [t, ...(synonyms[t] ?? [])])

/** Every typed word must match (directly or via a synonym). */
export function matchesQuery(p: Product, q: string) {
  const h = haystack(p)
  return queryTerms(q).every((alts) => alts.some((a) => h.includes(a)))
}
export const searchProducts = (q: string, limit = 50) => (q.trim() ? products.filter((p) => matchesQuery(p, q)).slice(0, limit) : [])

export function highlightParts(text: string, q: string): { t: string; hit: boolean }[] {
  const terms = queryTerms(q).flat().filter((t) => t.length > 1)
  if (!terms.length) return [{ t: text, hit: false }]
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig')
  // split with a capture group alternates [text, match, text, match, ...]
  return text.split(re).map((t, i) => ({ t, hit: i % 2 === 1 })).filter((x) => x.t)
}

/* ---------- Recommendations ---------- */
export const sameFabric = (p: Product, n = 4) => products.filter((x) => x.id !== p.id && x.fabricSlug === p.fabricSlug).slice(0, n)
export function completeTheLook(p: Product, n = 4) {
  const fam = new Set(p.colors.map((c) => c.family))
  return products
    .filter((x) => x.id !== p.id && x.fabricSlug !== p.fabricSlug)
    .map((x) => ({ x, s: x.occasion.filter((o) => p.occasion.includes(o)).length * 2 + x.colors.filter((c) => fam.has(c.family)).length }))
    .sort((a, b) => b.s - a.s).slice(0, n).map((r) => r.x)
}

export const allColorFamilies = () => {
  const m = new Map<string, string>()
  products.forEach((p) => p.colors.forEach((c) => !m.has(c.family) && m.set(c.family, c.hex)))
  return [...m].map(([name, hex]) => ({ name, hex }))
}
export const defaultColor = (p: Product): ColorVariant => p.colors[0]
