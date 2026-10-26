import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Traps Tab inside the container, focuses the first control (or the container) and closes on Escape. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onClose?: () => void, initial?: string) {
  useEffect(() => {
    const el = ref.current
    if (!active || !el) return
    const items = () => [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement)
    const first = initial ? el.querySelector<HTMLElement>(initial) : null
    ;(first ?? items()[0] ?? el).focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const list = items()
      if (!list.length) return e.preventDefault()
      const a = list[0]
      const z = list[list.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [ref, active, onClose, initial])
}
