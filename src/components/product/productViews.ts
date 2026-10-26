import type { ColorVariant, ImageRef, Product, ViewKey } from '../../data/types'
import { percentOff } from '../../lib/money'

const viewOrder: ViewKey[] = ['drape', 'pallu', 'border', 'texture', 'blouse']
export const viewLabels: Record<ViewKey, string> = { drape: 'Full drape', pallu: 'Pallu', border: 'Border', texture: 'Weave', blouse: 'Blouse piece' }

export const colorViews = (c: ColorVariant): { key: ViewKey; image: ImageRef }[] =>
  viewOrder.flatMap((k) => (c.images[k] ? [{ key: k, image: c.images[k] as ImageRef }] : []))

/** The detail photograph shown on hover (pallu, border, weave or blouse). */
export const detailImage = (c: ColorVariant): ImageRef | undefined => c.images.border ?? c.images.texture ?? c.images.pallu ?? c.images.blouse

export const badgesFor = (p: Product): { label: string; tone: 'light' | 'kumkum' | 'peacock' }[] => {
  const off = percentOff(p.price, p.compareAtPrice)
  return [
    ...(p.stock <= 0 ? [{ label: 'Sold out', tone: 'light' as const }] : []),
    ...(p.isNew ? [{ label: 'New', tone: 'peacock' as const }] : []),
    ...(p.isBestseller ? [{ label: 'Bestseller', tone: 'light' as const }] : []),
    ...(p.isHandloom ? [{ label: 'Handloom', tone: 'light' as const }] : []),
    ...(p.isLimited ? [{ label: 'Limited', tone: 'light' as const }] : []),
    ...(off > 0 ? [{ label: `−${off}%`, tone: 'kumkum' as const }] : []),
  ]
}
