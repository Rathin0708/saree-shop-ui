import { img } from './images'
import type { ColorVariant, Product } from './types'

type Seed = Omit<Product, 'width' | 'weight' | 'care' | 'blousePiece' | 'length' | 'tags' | 'isNew' | 'isBestseller'> &
  Partial<Pick<Product, 'width' | 'weight' | 'care' | 'blousePiece' | 'length' | 'tags' | 'isNew' | 'isBestseller'>>

const silkCare = ['Dry clean only', 'Store folded in muslin, refold every few months', 'Avoid direct sunlight and perfume contact']
const cottonCare = ['Gentle hand wash in cold water', 'Dry in shade', 'Iron on medium heat while slightly damp']

const p = (s: Seed): Product => ({
  width: '1.15 m',
  length: '5.5 m',
  weight: '650 g',
  care: silkCare,
  blousePiece: { included: true, length: '0.8 m', stitched: false },
  tags: [],
  isNew: false,
  isBestseller: false,
  ...s,
})

const v = (name: string, hex: string, family: string, images: ColorVariant['images']): ColorVariant => ({ name, hex, family, images })

/**
 * Sample catalogue. Photographs are Wikimedia Commons textile and saree images (see /img/CREDITS.txt); each product's
 * second photo shows the same colour family and weave tradition, not always the identical piece. Replace with your own photography.
 */
export const products: Product[] = [
  p({
    id: 'p01', slug: 'temple-border-kanjivaram-kumkum-gold', name: 'Temple Border Kanjivaram — Kumkum & Gold',
    fabricSlug: 'kanjivaram-silk', fabric: 'Kanjivaram Silk', collection: 'Heirloom', weave: 'Korvai temple border, interlocked pallu', work: ['Zari', 'Woven'],
    occasion: ['bridal', 'festive'], price: 48500, compareAtPrice: 52000, stock: 4, isNew: false, isBestseller: true, isHandloom: true, isLimited: true,
    colors: [v('Kumkum & Gold', '#8b1a2b', 'Red', {
      drape: img(129, 'Red silk saree with gold paisley border and dotted body', 'center 70%'),
      border: img(42, 'Close-up of a red silk saree border woven with gold paisley motifs'),
    })],
    weight: '780 g', composition: 'Mulberry silk with gold-tone zari', zari: 'Gold-tone zari (sample specification)',
    description: 'A deep kumkum body framed by a wide temple border in gold-tone zari. Cut for the muhurtham and kept for the generations after.',
    details: ['Wide korvai-style border with paisley and temple motifs', 'Contrast pallu with dense zari', 'Unstitched blouse piece in a matching tone'],
    tags: ['kanchipuram', 'wedding', 'pattu', 'temple'], createdAt: '2026-04-02',
  }),
  p({
    id: 'p02', slug: 'kanjivaram-peacock-blue-paisley-butta', name: 'Kanjivaram — Peacock Blue Paisley Butta',
    fabricSlug: 'kanjivaram-silk', fabric: 'Kanjivaram Silk', collection: 'Festive', weave: 'Plain body with woven paisley butta, contrast border', work: ['Zari', 'Woven'],
    occasion: ['festive', 'party'], price: 36500, stock: 6, isNew: true, isBestseller: false, isHandloom: true,
    colors: [v('Peacock Blue', '#2f7fb5', 'Blue', {
      drape: img(39, 'Peacock blue silk saree with a woven gold paisley motif', 'center 30%'),
      border: img(79, 'Blue and rust-orange silk saree with a temple-style woven border'),
    })],
    weight: '720 g', composition: 'Mulberry silk, zari', zari: 'Gold-tone zari (sample specification)',
    description: 'A saturated peacock-blue field with a single oversized paisley butta, finished with a rust temple border for contrast.',
    details: ['Large woven paisley butta', 'Rust contrast border', 'Soft, fluid drape for a pure silk'],
    tags: ['kanchipuram', 'pattu', 'paisley', 'blue silk'], createdAt: '2026-09-14',
  }),
  p({
    id: 'p03', slug: 'kadhwa-banarasi-violet-meena', name: 'Kadhwa Banarasi — Violet Meena',
    fabricSlug: 'banarasi', fabric: 'Banarasi Silk', collection: 'Heirloom', weave: 'Kadhwa brocade with meenakari-style floral pallu', work: ['Zari', 'Woven'],
    occasion: ['bridal', 'party'], price: 29800, compareAtPrice: 34000, stock: 3, isNew: false, isBestseller: true, isLimited: true,
    colors: [v('Violet', '#5b2e91', 'Purple', {
      drape: img(59, 'Model draped in a violet Banarasi silk saree with a gold zari pallu', 'center 22%'),
      texture: img(56, 'Violet brocade with gold floral and peacock border detail'),
    })],
    weight: '900 g', composition: 'Silk, metallic zari', zari: 'Gold-tone zari (sample specification)',
    description: 'Violet silk carrying a dense floral brocade, with a pallu worked in colour and zari. A reception saree with presence.',
    details: ['Dense floral brocade body', 'Heavy pallu with peacock-and-floral weave', 'Falls with weight and movement'],
    tags: ['banaras', 'wedding', 'brocade', 'purple'], createdAt: '2026-03-18',
  }),
  p({
    id: 'p04', slug: 'kadhwa-banarasi-jaal', name: 'Kadhwa Banarasi — Medallion Jaal',
    fabricSlug: 'banarasi', fabric: 'Banarasi Silk', collection: 'Heirloom', weave: 'Kadhwa jaal with gold medallions', work: ['Zari', 'Woven'],
    occasion: ['bridal', 'festive', 'party'], price: 24500, stock: 7, isNew: true, isBestseller: true,
    colors: [
      v('Amethyst', '#6a4c93', 'Purple', {
        drape: img(105, 'Amethyst brocade saree with a gold medallion jaal', 'center 30%'),
        texture: img(107, 'Close-up of purple brocade with diagonal gold floral bands'),
      }),
      v('Wine', '#6b1d2e', 'Red', {
        drape: img(91, 'Wine-red and gold patterned saree length with a crimson border', 'center 30%'),
        texture: img(37, 'Maroon fabric with a gold diamond and floral weave'),
      }),
    ],
    weight: '850 g', composition: 'Silk, metallic zari', zari: 'Gold-tone zari (sample specification)',
    description: 'A latticed jaal of gold medallions across the body. Choose amethyst for a cooler evening or wine for a warmer one.',
    details: ['All-over medallion jaal', 'Two colourways', 'Self border with a woven edge'],
    tags: ['banaras', 'brocade', 'medallion', 'wine', 'purple'], createdAt: '2026-10-02',
  }),
  p({
    id: 'p05', slug: 'banarasi-brocade-midnight-buti', name: 'Banarasi Brocade — Midnight Buti',
    fabricSlug: 'banarasi', fabric: 'Banarasi Silk', collection: 'Contemporary', weave: 'Brocade with paisley buti rows', work: ['Zari', 'Woven'],
    occasion: ['party', 'festive'], price: 21800, stock: 0, isNew: false, isBestseller: false,
    colors: [v('Midnight', '#16161c', 'Black', {
      drape: img(53, 'Black and gold Banarasi brocade with rows of paisley buti', 'center'),
      texture: img(104, 'Navy fabric with a geometric gold zari weave'),
    })],
    weight: '800 g', composition: 'Silk, metallic zari', zari: 'Gold-tone zari (sample specification)',
    description: 'Black silk with rows of small gold paisley butis between narrow zari bands. Quiet at a distance, rich up close.',
    details: ['Paisley buti rows', 'Narrow zari border', 'Evening-ready'],
    tags: ['banaras', 'black saree', 'brocade', 'party'], createdAt: '2026-02-11',
  }),
  p({
    id: 'p06', slug: 'tissue-silk-antique-gold', name: 'Tissue Silk — Antique Gold',
    fabricSlug: 'soft-silk', fabric: 'Soft Silk', collection: 'Festive', weave: 'Tissue-weight silk with self butis', work: ['Woven'],
    occasion: ['festive', 'party'], price: 14900, compareAtPrice: 17500, stock: 9, isNew: false, isBestseller: true,
    colors: [v('Antique Gold', '#b88a2e', 'Gold', {
      drape: img(54, 'Antique gold silk saree draped on a mannequin', 'center 35%'),
      texture: img(87, 'Gold and green brocade fabric with a woven border'),
    })],
    weight: '520 g', composition: 'Silk tissue blend', zari: 'Self-tone, no contrast zari',
    description: 'A light, lustrous tissue silk in antique gold. It catches candlelight and still folds into a small bag.',
    details: ['Lightweight tissue drape', 'Self butis', 'Easy to pleat'],
    tags: ['tissue', 'gold', 'festive', 'pattu'], createdAt: '2026-05-21',
  }),
  p({
    id: 'p07', slug: 'soft-silk-mulberry-olive', name: 'Soft Silk — Mulberry & Olive',
    fabricSlug: 'soft-silk', fabric: 'Soft Silk', collection: 'Everyday', weave: 'Two-tone body with woven border', work: ['Woven', 'Zari'],
    occasion: ['office', 'festive', 'daily'], price: 9800, stock: 12, isNew: true, isBestseller: false,
    colors: [v('Mulberry & Olive', '#7a3b4a', 'Maroon', {
      drape: img(99, 'Mulberry and olive soft silk sarees fanned out in pleats', 'center 40%'),
      texture: img(134, 'Brown and gold ikat-patterned saree length'),
    })],
    weight: '580 g', composition: 'Soft silk, fine zari', zari: 'Fine gold-tone zari (sample specification)',
    description: 'Mulberry and olive in one saree, with a gentle sheen. Soft enough for long days, finished enough for dinner.',
    details: ['Two-tone drape', 'Fine zari edge', 'Gentle on pleats'],
    tags: ['soft silk', 'office', 'two tone'], createdAt: '2026-10-10',
  }),
  p({
    id: 'p08', slug: 'paithani-style-silk-peacock-lime', name: 'Paithani-style Silk — Peacock & Lime',
    fabricSlug: 'soft-silk', fabric: 'Soft Silk', collection: 'Festive', weave: 'Woven motif pallu, contrast borders', work: ['Woven', 'Zari'],
    occasion: ['festive', 'bridal'], price: 17600, stock: 2, isNew: false, isBestseller: false, isLimited: true,
    colors: [v('Peacock & Lime', '#1c8ea6', 'Blue', {
      drape: img(124, 'Peacock blue and lime Paithani-style saree held open to show the pallu', 'center 25%'),
      pallu: img(132, 'Close-up of marigold silk with floral Paithani-style motifs'),
    })],
    weight: '700 g', composition: 'Silk blend', zari: 'Gold-tone zari (sample specification)',
    description: 'Peacock blue meets lime with a pallu woven in floral and bird motifs, in the Paithani tradition.',
    details: ['Motif-woven pallu', 'Colour-blocked borders', 'Bright and festive'],
    tags: ['paithani', 'peacock', 'lime', 'maharashtra'], createdAt: '2026-06-30',
  }),
  p({
    id: 'p09', slug: 'ikat-silk-indigo-and-madder', name: 'Ikat Silk — Indigo & Madder',
    fabricSlug: 'soft-silk', fabric: 'Ikat Silk', collection: 'Contemporary', weave: 'Hand-tied ikat with zari-dotted border', work: ['Woven', 'Zari'],
    occasion: ['festive', 'office'], price: 12400, stock: 8, isNew: false, isBestseller: true, isHandloom: true,
    colors: [
      v('Indigo', '#243a73', 'Blue', {
        drape: img(46, 'Indigo ikat saree with teal and red diamond motifs and a gold-dotted border', 'center 30%'),
        texture: img(71, 'Blue and white bandhani-style saree with a silver zari border'),
      }),
      v('Madder', '#a2432f', 'Red', {
        drape: img(0, 'Madder-red double-ikat textile with geometric motifs', 'center'),
        texture: img(95, 'Red and ochre block-patterned textile with a border'),
      }),
    ],
    weight: '610 g', composition: 'Silk, zari-dotted border', zari: 'Zari-dotted border (sample specification)',
    description: 'Ikat blurs where the dyed threads meet, which is why no two metres are identical. Indigo for calm, madder for warmth.',
    details: ['Hand-tied resist-dyed motifs', 'Zari-dotted border', 'Two colourways'],
    tags: ['ikat', 'pochampally', 'patola', 'indigo'], createdAt: '2026-07-08',
  }),
  p({
    id: 'p10', slug: 'sambalpuri-handloom-cotton-peacock-red', name: 'Sambalpuri Handloom Cotton — Peacock Red',
    fabricSlug: 'cotton', fabric: 'Handloom Cotton', collection: 'Everyday', weave: 'Ikat cotton with motif pallu', work: ['Woven'],
    occasion: ['daily', 'office'], price: 4650, stock: 15, isNew: false, isBestseller: true, isHandloom: true,
    colors: [
      v('Peacock Red', '#b4232a', 'Red', {
        drape: img(47, 'Red Sambalpuri pallu with a woven peacock motif', 'center'),
        pallu: img(127, 'Black and red Sambalpuri ikat with tree and elephant motifs'),
      }),
      v('Plum & Saffron', '#5e1f4a', 'Purple', {
        drape: img(36, 'Model in a plum Sambalpuri ikat saree with a saffron border', 'center 20%'),
        texture: img(38, 'Purple fabric with a white bandhani leaf pattern'),
      }),
    ],
    weight: '480 g', composition: '100% cotton', care: cottonCare,
    description: 'Breathable handloom cotton with ikat motifs and a bold pallu. A saree for long, warm days.',
    details: ['Ikat-woven motif pallu', 'Breathable cotton', 'Softens with each wash'],
    tags: ['sambalpuri', 'odisha', 'cotton', 'ikat'], createdAt: '2026-01-25',
  }),
  p({
    id: 'p11', slug: 'block-print-mulmul-charcoal', name: 'Block-Print Mulmul — Charcoal & Ivory',
    fabricSlug: 'cotton', fabric: 'Mulmul Cotton', collection: 'Everyday', weave: 'Hand-block print on soft cotton', work: ['Printed'],
    occasion: ['daily', 'office'], price: 2250, compareAtPrice: 2800, stock: 22, isNew: false, isBestseller: true,
    colors: [v('Charcoal', '#3b3a3d', 'Black', {
      drape: img(17, 'Charcoal block-printed cotton saree with a geometric border', 'center'),
      texture: img(133, 'Grey ikat saree draped to show a temple-style border'),
    })],
    weight: '380 g', composition: '100% mulmul cotton', care: cottonCare,
    description: 'Feather-light mulmul in charcoal with an ivory print. The easiest saree to wear all day.',
    details: ['Featherweight cotton', 'Printed border', 'Machine-washable on gentle'],
    tags: ['mulmul', 'block print', 'light', 'summer'], createdAt: '2026-03-02',
  }),
  p({
    id: 'p12', slug: 'shibori-mulmul-marigold-ruby', name: 'Shibori Mulmul — Marigold & Ruby',
    fabricSlug: 'cotton', fabric: 'Mulmul Cotton', collection: 'Everyday', weave: 'Tie-dye on soft cotton', work: ['Printed'],
    occasion: ['daily', 'party'], price: 3150, stock: 14, isNew: true, isBestseller: false,
    colors: [v('Marigold & Ruby', '#e0a21a', 'Orange', {
      drape: img(20, 'Model in a marigold and ruby shibori-dyed cotton saree', 'center 25%'),
      texture: img(67, 'Folded marigold cotton fabric with a white print'),
    })],
    weight: '400 g', composition: '100% mulmul cotton', care: cottonCare,
    description: 'Marigold and ruby tie-dyed in loose bands on cloud-soft cotton. Cheerful, and still polished with the right blouse.',
    details: ['Tie-dyed pallu bands', 'Soft, airy cotton', 'Pairs with solid blouses'],
    tags: ['shibori', 'tie dye', 'yellow', 'cotton'], createdAt: '2026-10-18',
  }),
  p({
    id: 'p13', slug: 'ivory-temple-border-silk', name: 'Ivory Temple-Border Silk',
    fabricSlug: 'soft-silk', fabric: 'Soft Silk', collection: 'Heirloom', weave: 'Plain body with red temple border', work: ['Woven', 'Plain'],
    occasion: ['office', 'festive', 'daily'], price: 7950, stock: 11, isNew: false, isBestseller: false, isHandloom: true,
    colors: [v('Ivory & Red', '#f1e9d8', 'Ivory', {
      drape: img(128, 'Ivory silk saree with a red temple-style border', 'center 70%'),
      texture: img(7, 'Cream silk saree draped on a mannequin', 'center 30%'),
    })],
    weight: '560 g', composition: 'Silk blend', zari: 'No zari',
    description: 'A clean ivory field with a crisp red temple border. Understated, and endlessly re-styled.',
    details: ['Temple-motif border', 'Plain body', 'Works with any contrast blouse'],
    tags: ['ivory', 'temple border', 'office', 'minimal'], createdAt: '2026-02-27',
  }),
  p({
    id: 'p14', slug: 'embroidered-organza-pearl-ivory', name: 'Embroidered Organza — Pearl Ivory',
    fabricSlug: 'designer', fabric: 'Designer Organza', collection: 'Contemporary', weave: 'Pearl and thread embroidery', work: ['Embroidered'],
    occasion: ['party', 'bridal'], price: 18900, compareAtPrice: 21500, stock: 3, isNew: true, isBestseller: false, isLimited: true,
    colors: [v('Pearl Ivory', '#efe6d3', 'Ivory', {
      drape: img(8, 'Ivory embroidered saree with a pearl blouse on a mannequin', 'center 30%'),
      blouse: img(116, 'Back view of an ivory embroidered saree and blouse'),
    })],
    weight: '700 g', composition: 'Organza, pearl and thread embroidery', zari: 'None',
    description: 'Ivory organza scattered with pearl and thread embroidery, paired with a matching embellished blouse piece.',
    details: ['Embroidered pallu and border', 'Pre-embellished blouse piece', 'Sheer, structured drape'],
    tags: ['organza', 'designer', 'pearl', 'reception'], createdAt: '2026-10-20',
  }),
  p({
    id: 'p15', slug: 'chikankari-georgette-ivory', name: 'Chikankari Saree — Ivory',
    fabricSlug: 'designer', fabric: 'Designer Chikankari', collection: 'Contemporary', weave: 'Chikankari-style embroidery', work: ['Embroidered'],
    occasion: ['party', 'festive', 'office'], price: 11400, stock: 6, isNew: false, isBestseller: true,
    colors: [v('Ivory', '#f0e8da', 'Ivory', {
      drape: img(51, 'Ivory chikankari-style embroidered saree on a mannequin', 'center 30%'),
      pallu: img(4, 'Black chikan embroidery on a saree pallu'),
    })],
    weight: '540 g', composition: 'Light fabric with thread embroidery', zari: 'None',
    description: 'Fine thread embroidery in an ivory tone-on-tone, with a scalloped pallu. Cool, elegant and quietly luxurious.',
    details: ['Tone-on-tone embroidery', 'Scalloped pallu edge', 'Light and breathable'],
    tags: ['chikankari', 'lucknow', 'embroidered', 'ivory'], createdAt: '2026-04-19',
  }),
]
