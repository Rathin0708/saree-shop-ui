import { useEffect, useState } from 'react'

/** Reports scroll direction and whether the page has left the top, using one passive listener batched by rAF. */
export function useScrollDirection(threshold = 8) {
  const [state, setState] = useState({ hidden: false, scrolled: false })
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const dy = y - last
      setState((s) => {
        const scrolled = y > 24
        const hidden = y < 120 ? false : Math.abs(dy) < threshold ? s.hidden : dy > 0
        return s.scrolled === scrolled && s.hidden === hidden ? s : { scrolled, hidden }
      })
      if (Math.abs(dy) >= threshold) last = y
      ticking = false
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return state
}
