import { useMemo } from 'react'
import { computeTotals } from '../lib/cart'
import { cartStore, overlayStore, recentStore, toastStore, wishStore } from '../store/stores'

export const useCartLines = () => cartStore.use((s) => s.lines)
export const useCartPromo = () => cartStore.use((s) => s.promo)
export const useCartBump = () => cartStore.use((s) => s.bump)
export function useCartTotals() {
  const lines = useCartLines()
  const promo = useCartPromo()
  return useMemo(() => computeTotals(lines, promo), [lines, promo])
}
export const useWishlist = () => wishStore.use((s) => s)
export const useIsWished = (slug: string) => wishStore.use((s) => s.includes(slug))
export const useRecent = () => recentStore.use((s) => s)
export const useOverlay = () => overlayStore.use((s) => s)
export const useToasts = () => toastStore.use((s) => s)
