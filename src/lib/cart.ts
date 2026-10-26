import { brand } from '../config/brand'
import { getProductById } from './catalog'
import { toPaise } from './money'

export interface CartLine {
  key: string
  productId: string
  color: string
  addOns: string[]
  qty: number
}

export const lineKey = (productId: string, color: string, addOns: string[]) => `${productId}|${color}|${[...addOns].sort().join('+')}`

export const addOnsPaise = (ids: string[]) =>
  ids.reduce((sum, id) => sum + toPaise(brand.addOns.find((a) => a.id === id)?.price ?? 0), 0)

export function unitPaise(l: CartLine) {
  const p = getProductById(l.productId)
  return p ? toPaise(p.price) + addOnsPaise(l.addOns) : 0
}

export function addLine(lines: CartLine[], add: Omit<CartLine, 'key'>): CartLine[] {
  const p = getProductById(add.productId)
  if (!p || p.stock <= 0) return lines
  const key = lineKey(add.productId, add.color, add.addOns)
  const existing = lines.find((l) => l.key === key)
  if (existing) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(p.stock, l.qty + add.qty) } : l))
  return [...lines, { ...add, key, qty: Math.min(p.stock, add.qty) }]
}

export function setQty(lines: CartLine[], key: string, qty: number): CartLine[] {
  return lines.flatMap((l) => {
    if (l.key !== key) return [l]
    const p = getProductById(l.productId)
    const next = Math.min(p?.stock ?? 1, qty)
    return next <= 0 ? [] : [{ ...l, qty: next }]
  })
}

export function validateLines(v: unknown): v is CartLine[] {
  return (
    Array.isArray(v) &&
    v.every(
      (l) =>
        l && typeof l.key === 'string' && typeof l.productId === 'string' && typeof l.color === 'string' &&
        Array.isArray(l.addOns) && Number.isInteger(l.qty) && l.qty > 0 && !!getProductById(l.productId),
    )
  )
}

export interface PromoResult { ok: boolean; message: string; code?: string }
export const findPromo = (code: string) => brand.promoCodes.find((c) => c.code === code.trim().toUpperCase())

export interface Totals {
  count: number
  subtotal: number
  mrpSavings: number
  promoDiscount: number
  shipping: number
  total: number
  toFreeShipping: number
  freeShipping: boolean
}

export function computeTotals(lines: CartLine[], promoCode: string | null): Totals {
  let subtotal = 0
  let mrp = 0
  let count = 0
  for (const l of lines) {
    const p = getProductById(l.productId)
    if (!p) continue
    const add = addOnsPaise(l.addOns)
    subtotal += (toPaise(p.price) + add) * l.qty
    mrp += (toPaise(p.compareAtPrice ?? p.price) + add) * l.qty
    count += l.qty
  }
  const promo = promoCode ? findPromo(promoCode) : undefined
  let promoDiscount = 0
  if (promo && subtotal >= toPaise(promo.minSubtotal)) {
    promoDiscount = promo.type === 'percent' ? Math.round((subtotal * promo.value) / 100) : Math.min(subtotal, toPaise(promo.value))
  }
  const after = subtotal - promoDiscount
  const threshold = toPaise(brand.freeShippingThreshold)
  const freeShipping = lines.length === 0 || after >= threshold
  const shipping = freeShipping ? 0 : toPaise(brand.shippingFlat)
  return {
    count, subtotal, mrpSavings: mrp - subtotal, promoDiscount, shipping, total: after + shipping,
    toFreeShipping: Math.max(0, threshold - after), freeShipping,
  }
}
