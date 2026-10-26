import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { announcements } from '../../data/content'
import { dismissAnnouncements, useAnnouncementVisible } from '../../store/announce'

export function AnnouncementBar() {
  const visible = useAnnouncementVisible()
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || !visible || announcements.length < 2) return
    const t = window.setInterval(() => setI((n) => (n + 1) % announcements.length), 4500)
    return () => window.clearInterval(t)
  }, [paused, visible])

  if (!visible) return null
  return (
    <div
      className="relative flex h-9 items-center justify-center bg-kumkum px-12 text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden" aria-live={paused ? 'polite' : 'off'}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={i}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="truncate text-[11px] font-semibold uppercase tracking-[0.16em]"
          >
            {announcements[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        type="button"
        aria-label="Dismiss announcements"
        onClick={dismissAnnouncements}
        className="absolute right-0 top-0 grid size-11 h-9 place-items-center hover:bg-ivory/10"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
