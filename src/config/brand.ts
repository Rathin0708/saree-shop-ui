/** Single source of truth for brand, commerce rules and demo configuration. Rename the house here. */
export const brand = {
  name: 'NEYTHAL',
  tagline: 'Woven for every chapter',
  hashtag: '#DrapedInNeythal',
  /** Decorative script word. Tamil for "weaving". Always paired with the English meaning. */
  accent: { text: 'நெய்தல்', lang: 'ta', meaning: 'weaving' },
  currency: 'INR',
  locale: 'en-IN',
  freeShippingThreshold: 5000,
  shippingFlat: 149,
  returnWindowDays: 7,
  /** ISO date for the promo countdown. Change freely; an expired date shows a graceful state. */
  promoEndsAt: '2026-12-31T18:30:00.000Z',
  promoCodes: [
    { code: 'FESTIVE10', label: '10% off your order', type: 'percent' as const, value: 10, minSubtotal: 0 },
    { code: 'WELCOME5', label: '5% off your first order', type: 'percent' as const, value: 5, minSubtotal: 0 },
    { code: 'SILK500', label: '₹500 off orders above ₹10,000', type: 'flat' as const, value: 500, minSubtotal: 10000 },
  ],
  addOns: [
    { id: 'fall-pico', label: 'Fall & pico finishing', price: 450, note: 'Demo pricing' },
    { id: 'blouse-stitch', label: 'Blouse stitching', price: 950, note: 'Demo pricing, made to your measurements' },
  ],
  contact: {
    email: 'hello@neythal.example',
    phone: '+91 00000 00000',
    address: 'Studio address placeholder, India',
    hours: 'Mon–Sat, 10:00–18:00 IST (placeholder)',
  },
  /** Leave a URL empty to hide that social link. */
  social: { instagram: '', pinterest: '', youtube: '' } as Record<string, string>,
  demoNotice: 'This is a demo checkout. No payment is processed and no order is placed.',
}

export const money = new Intl.NumberFormat(brand.locale, {
  style: 'currency',
  currency: brand.currency,
  maximumFractionDigits: 0,
})
