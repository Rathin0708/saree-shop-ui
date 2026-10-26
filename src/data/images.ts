import type { ImageRef } from './types'

/** Pixel dimensions of each processed file (width x height) in /public/img. Source credits: /img/CREDITS.txt */
const dims: Record<number, [number, number]> = {
  0: [1280, 1487], 2: [1280, 850], 4: [1280, 960], 7: [1280, 2078], 8: [1280, 2256], 17: [1280, 960], 20: [1024, 1280],
  28: [1280, 960], 36: [1144, 1852], 37: [1280, 853], 38: [1280, 855], 39: [1280, 1714], 42: [1280, 842], 46: [1280, 1707],
  47: [1280, 853], 51: [1280, 1707], 53: [917, 660], 54: [940, 2770], 56: [1280, 2276], 59: [1280, 1920], 67: [1280, 960],
  71: [1280, 1707], 75: [1220, 1280], 79: [1280, 857], 81: [1280, 1920], 87: [1280, 848], 91: [1280, 2741], 92: [1280, 853],
  95: [1280, 964], 96: [1280, 1047], 99: [1280, 1653], 104: [1280, 960], 105: [1280, 1920], 107: [1280, 853],
  116: [1280, 1707], 124: [1280, 1707], 127: [1280, 1920], 128: [1280, 960], 129: [1280, 960], 130: [1280, 823],
  132: [1024, 576], 133: [1200, 1600], 134: [1280, 1920],
}

const pad = (n: number) => `s${String(n).padStart(3, '0')}`
const widthsFor = (n: number) => [480, 800, 1200].filter((w) => w <= dims[n][0])

export const img = (n: number, alt: string, pos?: string): ImageRef => ({ n, alt, pos })
export const imgSrc = (r: ImageRef, w = 800) => {
  const ws = widthsFor(r.n)
  const pick = ws.reduce((best, x) => (Math.abs(x - w) < Math.abs(best - w) ? x : best), ws[0])
  return `/img/${pad(r.n)}-${pick}.webp`
}
export const imgSrcSet = (r: ImageRef) => widthsFor(r.n).map((w) => `/img/${pad(r.n)}-${w}.webp ${w}w`).join(', ')
export const imgSize = (r: ImageRef) => ({ width: dims[r.n][0], height: dims[r.n][1] })
