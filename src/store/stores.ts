import { addLine, setQty, validateLines, findPromo, type CartLine, type PromoResult } from '../lib/cart'
import { getProductById, getProductBySlug } from '../lib/catalog'
import { readJSON, writeJSON } from '../lib/storage'
import { createStore } from './createStore'

/* ---------------- Overlays: one open at a time ---------------- */
export type OverlayKind = 'search' | 'cart' | 'menu' | 'quickview' | 'filters' | 'account' | null
interface OverlayState { kind: OverlayKind; slug?: string; color?: string; returnFocus?: HTMLElement | null }
export const overlayStore = createStore<OverlayState>({ kind: null })
export const openOverlay = (kind: Exclude<OverlayKind, null>, extra: Partial<OverlayState> = {}) =>
  overlayStore.set({ kind, returnFocus: document.activeElement as HTMLElement | null, ...extra })
export const closeOverlay = () => {
  const { returnFocus } = overlayStore.get()
  overlayStore.set({ kind: null })
  // restore focus after the overlay unmounts
  if (returnFocus && document.contains(returnFocus)) requestAnimationFrame(() => returnFocus.focus({ preventScroll: true }))
}

/* ---------------- Toasts ---------------- */
export interface Toast { id: number; message: string; actionLabel?: string; onAction?: () => void; to?: string }
export const toastStore = createStore<Toast[]>([])
let toastId = 1
export function toast(message: string, opts: Omit<Toast, 'id' | 'message'> = {}) {
  const id = toastId++
  toastStore.set((t) => [...t.slice(-2), { id, message, ...opts }])
  window.setTimeout(() => dismissToast(id), opts.onAction ? 6500 : 4200)
}
export const dismissToast = (id: number) => toastStore.set((t) => t.filter((x) => x.id !== id))

/* ---------------- Cart ---------------- */
const CART_KEY = 'neythal.cart.v1'
interface CartState { lines: CartLine[]; promo: string | null; bump: number }
export const cartStore = createStore<CartState>({
  lines: readJSON<CartLine[]>(`${CART_KEY}.lines`, [], validateLines),
  promo: readJSON<string | null>(`${CART_KEY}.promo`, null, (v): v is string | null => v === null || typeof v === 'string'),
  bump: 0,
})
cartStore.subscribe(() => {
  const { lines, promo } = cartStore.get()
  writeJSON(`${CART_KEY}.lines`, lines)
  writeJSON(`${CART_KEY}.promo`, promo)
})

export function addToCart(productId: string, color: string, addOns: string[] = [], qty = 1, openDrawer = true) {
  const before = cartStore.get().lines
  const after = addLine(before, { productId, color, addOns, qty })
  if (after === before) return false
  cartStore.set((s) => ({ ...s, lines: after, bump: s.bump + 1 }))
  if (openDrawer) openOverlay('cart')
  return true
}
export const updateQty = (key: string, qty: number) => cartStore.set((s) => ({ ...s, lines: setQty(s.lines, key, qty) }))
export function removeLine(key: string) {
  const { lines } = cartStore.get()
  const idx = lines.findIndex((l) => l.key === key)
  if (idx < 0) return
  const removed = lines[idx]
  cartStore.set((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) }))
  const name = getProductById(removed.productId)?.name ?? 'Item'
  toast(`Removed ${name}`, {
    actionLabel: 'Undo',
    onAction: () => cartStore.set((s) => ({ ...s, lines: [...s.lines.slice(0, idx), removed, ...s.lines.slice(idx)] })),
  })
}
export const clearCart = () => cartStore.set((s) => ({ ...s, lines: [], promo: null }))
export function applyPromo(code: string): PromoResult {
  const promo = findPromo(code)
  if (!code.trim()) return { ok: false, message: 'Enter a promo code.' }
  if (!promo) return { ok: false, message: 'That code is not valid in this demo.' }
  cartStore.set((s) => ({ ...s, promo: promo.code }))
  toast(`${promo.code} applied: ${promo.label}`)
  return { ok: true, message: `${promo.code} applied.`, code: promo.code }
}
export const removePromo = () => cartStore.set((s) => ({ ...s, promo: null }))

/* ---------------- Wishlist ---------------- */
const WISH_KEY = 'neythal.wishlist.v1'
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')
export const wishStore = createStore<string[]>(readJSON<string[]>(WISH_KEY, [], isStrArr).filter((s) => !!getProductBySlug(s)))
wishStore.subscribe(() => writeJSON(WISH_KEY, wishStore.get()))
export function toggleWish(slug: string) {
  const has = wishStore.get().includes(slug)
  wishStore.set((w) => (has ? w.filter((s) => s !== slug) : [...w, slug]))
  const name = getProductBySlug(slug)?.name ?? 'Saree'
  toast(has ? `Removed ${name} from wishlist` : `Saved ${name} to wishlist`, has ? {} : { actionLabel: 'View wishlist', to: '/wishlist' })
}

/* ---------------- Recently viewed ---------------- */
const RECENT_KEY = 'neythal.recent.v1'
export const recentStore = createStore<string[]>(readJSON<string[]>(RECENT_KEY, [], isStrArr).filter((s) => !!getProductBySlug(s)))
export function pushRecent(slug: string) {
  recentStore.set((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 8))
  writeJSON(RECENT_KEY, recentStore.get())
}

/* ---------------- Demo orders ---------------- */
export interface DemoOrder { id: string; placedAt: string; total: number; lines: { name: string; qty: number }[] }
const ORDERS_KEY = 'neythal.orders.v1'
export const ordersStore = createStore<DemoOrder[]>(readJSON<DemoOrder[]>(ORDERS_KEY, [], (v): v is DemoOrder[] => Array.isArray(v)))
export function saveOrder(o: DemoOrder) {
  ordersStore.set((l) => [o, ...l].slice(0, 20))
  writeJSON(ORDERS_KEY, ordersStore.get())
}
