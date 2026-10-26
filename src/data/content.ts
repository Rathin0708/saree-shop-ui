import { img } from './images'
import type { Category, Occasion } from './types'

export const categories: Category[] = [
  { slug: 'kanjivaram-silk', title: 'Kanjivaram Silk', kind: 'fabric', order: 1, enabled: true, descriptor: 'Temple borders, mulberry silk',
    description: 'Heavy, lustrous silk with contrast borders and interlocked pallus, a South Indian bridal and festive staple.',
    heroImage: img(129, 'Red silk saree with gold paisley border', 'center 70%'), macroImage: img(42, 'Close-up of red silk border with gold paisley motifs') },
  { slug: 'banarasi', title: 'Banarasi', kind: 'fabric', order: 2, enabled: true, descriptor: 'Brocade, kadhwa and zari jaal',
    description: 'Brocade weaves from the Varanasi tradition: dense floral jaals, fine zari and a weighty drape.',
    heroImage: img(59, 'Model in a violet Banarasi saree', 'center 22%'), macroImage: img(56, 'Violet brocade with gold floral detail') },
  { slug: 'soft-silk', title: 'Soft Silk', kind: 'fabric', order: 3, enabled: true, descriptor: 'Light silk for long days',
    description: 'Lighter silks, ikats and tissue weaves that move easily and still look occasion-ready.',
    heroImage: img(99, 'Mulberry and olive soft silk sarees fanned in pleats', 'center 40%'), macroImage: img(134, 'Brown and gold ikat saree length') },
  { slug: 'cotton', title: 'Cotton', kind: 'fabric', order: 4, enabled: true, descriptor: 'Handloom, mulmul, breathable',
    description: 'Handloom and mulmul cottons that breathe, soften with every wash and suit long days.',
    heroImage: img(47, 'Red Sambalpuri pallu with a peacock motif'), macroImage: img(127, 'Black and red Sambalpuri ikat') },
  { slug: 'linen', title: 'Linen', kind: 'fabric', order: 5, enabled: true, descriptor: 'Crisp, cool, understated',
    description: 'Crisp linen sarees with a dry hand and a clean fall.', heroImage: img(128, 'Ivory saree with a red border'), macroImage: img(128, 'Ivory saree border') },
  { slug: 'designer', title: 'Designer', kind: 'fabric', order: 6, enabled: true, descriptor: 'Embroidered and embellished',
    description: 'Embroidered organza, chikankari and embellished sarees for evenings and receptions.',
    heroImage: img(8, 'Ivory embroidered saree on a mannequin', 'center 30%'), macroImage: img(51, 'Ivory chikankari saree detail', 'center 30%') },
  { slug: 'georgette-chiffon', title: 'Georgette & Chiffon', kind: 'fabric', order: 7, enabled: true, descriptor: 'Fluid, sheer, weightless',
    description: 'Fluid sarees in georgette and chiffon.', heroImage: img(20, 'Marigold tie-dye saree', 'center 25%'), macroImage: img(67, 'Marigold fabric') },
  { slug: 'bridal', title: 'Bridal', kind: 'occasion', order: 8, enabled: true, descriptor: 'For the muhurtham and beyond',
    description: 'Sarees chosen for weddings: deep colours, heavy zari and pallus built to be photographed and passed down.',
    heroImage: img(129, 'Red bridal silk saree', 'center 70%'), macroImage: img(42, 'Bridal saree border') },
  { slug: 'party-wear', title: 'Party Wear', kind: 'occasion', order: 9, enabled: true, descriptor: 'Evenings, receptions, celebrations',
    description: 'Brocades, embroidery and tissue silks for evenings that call for more.',
    heroImage: img(105, 'Amethyst brocade saree', 'center 30%'), macroImage: img(107, 'Purple brocade detail') },
  { slug: 'lightweight-daily-wear', title: 'Lightweight Daily Wear', kind: 'occasion', order: 10, enabled: true, descriptor: 'Easy, breathable, every day',
    description: 'Cottons and soft silks light enough to wear from morning to night.',
    heroImage: img(17, 'Charcoal block-print saree'), macroImage: img(133, 'Grey ikat saree') },
]

export const occasions: Occasion[] = [
  { slug: 'bridal', title: 'Bridal', blurb: 'Muhurtham silks and heirloom pallus', image: img(129, 'Red Kanjivaram bridal silk', 'center 70%') },
  { slug: 'festive', title: 'Festive', blurb: 'Colour for every celebration', image: img(124, 'Peacock and lime festive saree', 'center 25%') },
  { slug: 'party', title: 'Party', blurb: 'Brocade, embroidery and tissue', image: img(105, 'Amethyst brocade saree', 'center 30%') },
  { slug: 'office', title: 'Office', blurb: 'Poised, light and crease-forgiving', image: img(128, 'Ivory saree with a red border', 'center 70%') },
  { slug: 'daily', title: 'Everyday', blurb: 'Cottons you reach for first', image: img(47, 'Red Sambalpuri cotton pallu') },
]

export const popularSearches = ['Kanjivaram', 'Wedding', 'Banarasi', 'Cotton', 'Pattu', 'Ikat']

export const synonyms: Record<string, string[]> = {
  kanchipuram: ['kanjivaram'], kanchi: ['kanjivaram'], kanjeevaram: ['kanjivaram'],
  wedding: ['bridal'], marriage: ['bridal'], bride: ['bridal'],
  pattu: ['silk', 'kanjivaram'], benares: ['banarasi'], banaras: ['banarasi'], varanasi: ['banarasi'],
  mulmul: ['cotton'], handloom: ['cotton', 'handloom'], daily: ['everyday', 'daily'], everyday: ['daily'],
  evening: ['party'], reception: ['party'], work: ['office'], lucknow: ['chikankari'], pochampally: ['ikat'], patola: ['ikat'],
}

export const announcements = [
  'Free shipping above ₹5,000 — across India',
  'The Festive Edit: use FESTIVE10 at cart (demo code)',
  'Blouse stitching available on every saree (demo pricing)',
]

export const navigation = {
  primary: [
    { label: 'New Arrivals', to: '/collections/new-arrivals' },
    { label: 'Sarees', to: '/sarees', mega: 'sarees' as const },
    { label: 'Occasions', to: '/occasion/bridal', mega: 'occasions' as const },
    { label: 'Bridal', to: '/occasion/bridal' },
    { label: 'Craft', to: '/craft' },
    { label: 'Our Story', to: '/our-story' },
  ],
  priceBands: [
    { label: 'Under ₹5,000', to: '/sarees?max=5000' },
    { label: '₹5,000 – ₹15,000', to: '/sarees?min=5000&max=15000' },
    { label: 'Above ₹15,000', to: '/sarees?min=15000' },
  ],
}

export const footerLinks = {
  help: [
    { label: 'Shipping', to: '/shipping' }, { label: 'Returns', to: '/returns' }, { label: 'Care Guide', to: '/care-guide' },
    { label: 'FAQ', to: '/faq' }, { label: 'Contact', to: '/contact' }, { label: 'Size & Blouse Guide', to: '/care-guide#blouse' },
  ],
  company: [{ label: 'Our Story', to: '/our-story' }, { label: 'The Craft', to: '/craft' }],
  legal: [{ label: 'Privacy', to: '/privacy' }, { label: 'Terms', to: '/terms' }],
}

/** SAMPLE content. Replace or delete this file's entries before launch. */
export const testimonials = [
  { id: 't1', name: 'A.', city: 'Chennai', rating: 5, saree: 'Temple Border Kanjivaram', slug: 'temple-border-kanjivaram-kumkum-gold', text: 'The border is even richer in person, and the pallu fell exactly as pictured.', isSample: true as const },
  { id: 't2', name: 'M.', city: 'Bengaluru', rating: 5, saree: 'Kadhwa Banarasi — Violet Meena', slug: 'kadhwa-banarasi-violet-meena', text: 'Heavy but not stiff. I wore it for hours and it still pleated beautifully.', isSample: true as const },
  { id: 't3', name: 'S.', city: 'Pune', rating: 4, saree: 'Sambalpuri Handloom Cotton', slug: 'sambalpuri-handloom-cotton-peacock-red', text: 'My everyday saree now. It breathes, and the pallu gets compliments.', isSample: true as const },
  { id: 't4', name: 'R.', city: 'Kolkata', rating: 5, saree: 'Embroidered Organza — Pearl Ivory', slug: 'embroidered-organza-pearl-ivory', text: 'Light, elegant and photographs beautifully under evening light.', isSample: true as const },
]

export const faqs = [
  { q: 'How do I choose between Kanjivaram and Banarasi?', a: 'Kanjivaram sarees are typically heavier silk with contrast temple borders and interlocked pallus. Banarasi sarees usually carry brocade jaals with finer zari work and a more fluid drape. Both suit weddings; Kanjivaram leans traditional, Banarasi leans evening.' },
  { q: 'Is a blouse piece included?', a: 'Where a saree includes a blouse piece, its length is listed in the specifications. Blouse stitching is an optional add-on on every product page (demo pricing).' },
  { q: 'How should I care for a silk saree?', a: 'Dry clean only, store folded in a muslin cloth, refold along different lines every few months, and keep away from direct sunlight and perfume. See the full Care Guide for details.' },
  { q: 'What are the shipping timelines?', a: 'The PIN-code checker on each product page shows a demo estimate. In this demo, no real shipments are created.' },
  { q: 'Can I return a saree?', a: 'Our demo policy allows returns within 7 days for unused sarees with tags and packaging intact. Customised items such as stitched blouses are not returnable. See Returns for the full text.' },
  { q: 'Is this a real store?', a: 'No. This is a front-end demo. No payments are processed, no orders are placed and accounts are not active.' },
]

/** Bridal sticky story. Positions are percentages on the image. */
export const bridalChapters = [
  { id: 'c1', title: 'The Muhurtham Silk', copy: 'The saree that carries the ceremony: a kumkum field, a temple border in gold-tone zari, and a pallu meant to be lifted into the light.',
    image: img(129, 'Red Kanjivaram silk saree with gold paisley border', 'center 70%'), picks: ['temple-border-kanjivaram-kumkum-gold', 'kanjivaram-peacock-blue-paisley-butta'],
    hotspots: [{ x: 30, y: 62, slug: 'temple-border-kanjivaram-kumkum-gold' }, { x: 74, y: 30, slug: 'kanjivaram-peacock-blue-paisley-butta' }] },
  { id: 'c2', title: 'The Reception Drape', copy: 'When the evening turns, brocade takes over. Deep violets and wines, woven jaals, and a fall with real weight.',
    image: img(59, 'Model in a violet Banarasi silk saree', 'center 22%'), picks: ['kadhwa-banarasi-violet-meena', 'kadhwa-banarasi-jaal'],
    hotspots: [{ x: 50, y: 48, slug: 'kadhwa-banarasi-violet-meena' }, { x: 36, y: 78, slug: 'kadhwa-banarasi-jaal' }] },
  { id: 'c3', title: 'The Heirloom Pallu', copy: 'A pallu worked so densely it is meant to be passed on. Paithani motifs and pearl embroidery for the next chapter.',
    image: img(124, 'Peacock and lime Paithani-style saree held open', 'center 25%'), picks: ['paithani-style-silk-peacock-lime', 'embroidered-organza-pearl-ivory'],
    hotspots: [{ x: 50, y: 62, slug: 'paithani-style-silk-peacock-lime' }, { x: 80, y: 20, slug: 'embroidered-organza-pearl-ivory' }] },
]

export const weaveAnatomy = {
  image: img(59, 'Model draped in a violet Banarasi saree showing body, border, pallu and blouse', 'center 30%'),
  points: [
    { id: 'blouse', label: 'Blouse piece', x: 44, y: 17, zoom: 2.4, text: 'An unstitched length woven alongside the saree, often in the same palette. It is cut and stitched to your measurements.' },
    { id: 'pallu', label: 'Pallu', x: 66, y: 36, zoom: 2.2, text: 'The decorated end that drapes over the shoulder. It is usually the most densely woven part, with the richest motifs.' },
    { id: 'zari', label: 'Zari', x: 46, y: 64, zoom: 2.8, text: 'Metallic thread, traditionally silver wound with gold, used to weave motifs into the cloth. Today it ranges from real metal to metallic polyester.' },
    { id: 'body', label: 'Body', x: 34, y: 52, zoom: 2.2, text: 'The long field of the saree: plain, striped, checked or woven with all-over motifs such as butis and jaals.' },
    { id: 'border', label: 'Border', x: 56, y: 93, zoom: 2.4, text: 'The edge band that frames the saree. In temple-border weaves it is built in a contrasting colour and interlocked with the body.' },
  ],
}

export const galleryTiles = [
  { n: 129, slug: 'temple-border-kanjivaram-kumkum-gold', alt: 'Red Kanjivaram silk with a gold paisley border', h: 'tall' },
  { n: 47, slug: 'sambalpuri-handloom-cotton-peacock-red', alt: 'Sambalpuri pallu with a peacock motif', h: 'short' },
  { n: 99, slug: 'soft-silk-mulberry-olive', alt: 'Fanned mulberry and olive soft silk', h: 'tall' },
  { n: 20, slug: 'shibori-mulmul-marigold-ruby', alt: 'Marigold and ruby shibori saree', h: 'tall' },
  { n: 105, slug: 'kadhwa-banarasi-jaal', alt: 'Amethyst medallion jaal brocade', h: 'short' },
  { n: 8, slug: 'embroidered-organza-pearl-ivory', alt: 'Ivory embroidered organza saree', h: 'tall' },
  { n: 46, slug: 'ikat-silk-indigo-and-madder', alt: 'Indigo ikat saree with a gold-dotted border', h: 'short' },
  { n: 59, slug: 'kadhwa-banarasi-violet-meena', alt: 'Violet Banarasi saree on a model', h: 'tall' },
]

export const dayParts = [
  { slug: 'kanjivaram', title: 'Kanchipuram', copy: 'Heavy mulberry silk, contrast temple borders and interlocked pallus, associated with Tamil Nadu’s temple town.' },
  { slug: 'banarasi', title: 'Varanasi', copy: 'Brocade, kadhwa and fine zari jaals woven in the city of Banaras.' },
  { slug: 'ikat', title: 'Odisha & Telangana', copy: 'Ikat: threads are tied and dyed before weaving, so patterns blur softly at the edges.' },
]
