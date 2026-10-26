export type ViewKey = 'drape' | 'pallu' | 'border' | 'texture' | 'blouse'

export interface ImageRef {
  /** Number of the file in /public/img (s###-480/800/1200.webp). */
  n: number
  alt: string
  /** CSS object-position, tuned so drape/pallu is never awkwardly cropped. */
  pos?: string
}

export interface ColorVariant {
  name: string
  hex: string
  family: string
  images: Partial<Record<ViewKey, ImageRef>> & { drape: ImageRef }
}

export type Work = 'Zari' | 'Embroidered' | 'Printed' | 'Woven' | 'Plain'
export type FabricSlug = 'kanjivaram-silk' | 'banarasi' | 'soft-silk' | 'cotton' | 'linen' | 'designer' | 'georgette-chiffon'
export type OccasionSlug = 'bridal' | 'festive' | 'party' | 'office' | 'daily'
export type CollectionLine = 'Heirloom' | 'Festive' | 'Contemporary' | 'Everyday'

export interface Product {
  id: string
  slug: string
  name: string
  fabricSlug: FabricSlug
  fabric: string
  collection: CollectionLine
  weave: string
  work: Work[]
  occasion: OccasionSlug[]
  colors: ColorVariant[]
  /** Whole rupees. All cart maths converts to integer paise. */
  price: number
  compareAtPrice?: number
  stock: number
  isNew: boolean
  isBestseller: boolean
  isHandloom?: boolean
  isLimited?: boolean
  length: string
  width: string
  blousePiece: { included: boolean; length?: string; stitched: boolean }
  weight: string
  composition: string
  zari?: string
  care: string[]
  description: string
  details: string[]
  tags: string[]
  createdAt: string
}

export interface Category {
  slug: string
  title: string
  description: string
  descriptor: string
  kind: 'fabric' | 'occasion'
  heroImage: ImageRef
  macroImage: ImageRef
  enabled: boolean
  order: number
}

export interface Occasion {
  slug: OccasionSlug
  title: string
  blurb: string
  image: ImageRef
}
