export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Deterministic demo estimate from the PIN code: no real carrier data. */
export function estimateDays(pin: string) {
  const sum = [...pin].reduce((n, d) => n + Number(d), 0)
  const lo = 3 + (sum % 4)
  return [lo, lo + 3] as const
}
