import { useEffect } from 'react'

/** Ref-counted so stacked overlays never unlock the page early. */
let locks = 0
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    if (locks++ === 0) {
      const sw = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.paddingRight = sw ? `${sw}px` : ''
    }
    return () => {
      if (--locks === 0) {
        document.documentElement.style.overflow = ''
        document.documentElement.style.paddingRight = ''
      }
    }
  }, [active])
}
