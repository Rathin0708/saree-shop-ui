import { money } from '../config/brand'

/** All money maths is done in integer paise to avoid floating-point drift. */
export const toPaise = (rupees: number) => Math.round(rupees * 100)
export const formatPaise = (paise: number) => money.format(paise / 100)
export const formatRupees = (rupees: number) => money.format(rupees)
export const percentOff = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0
