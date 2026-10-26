import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { IconButton } from './Button'

export type Side = 'center' | 'right' | 'left' | 'bottom' | 'full'
interface Props {
  open: boolean
  onClose: () => void
  label: string
  side?: Side
  children: ReactNode
  className?: string
  hideClose?: boolean
  initialFocus?: string
}

const ease = [0.65, 0, 0.35, 1] as const
const variants = {
  center: { initial: { opacity: 0, y: 24, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 } },
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
  full: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
}
const placement: Record<Side, string> = {
  center: 'm-auto max-h-[92dvh] w-[min(1100px,94vw)] overflow-y-auto bg-ivory',
  right: 'ml-auto h-dvh w-[min(480px,100vw)] bg-ivory',
  left: 'mr-auto h-dvh w-[min(440px,92vw)] bg-ivory',
  bottom: 'mt-auto max-h-[92dvh] w-full overflow-y-auto rounded-t-[14px] bg-ivory',
  full: 'h-dvh w-full overflow-y-auto bg-ivory',
}

function Panel({ onClose, label, side = 'center', children, className = '', hideClose, initialFocus }: Omit<Props, 'open'>) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const drag = useDragControls()
  useLockBodyScroll(true)
  useFocusTrap(ref, true, onClose, initialFocus)
  const v = variants[side]
  const transition = reduce ? { duration: 0 } : { duration: 0.42, ease }
  return (
    <div className="fixed inset-0 z-[100] flex" role="presentation">
      <motion.div
        className="absolute inset-0 bg-ink/55"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.3 }}
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`relative flex flex-col outline-none ${placement[side]} ${className}`}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={transition}
        drag={side === 'bottom' && !reduce ? 'y' : false}
        dragListener={false}
        dragControls={drag}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => {
          if (i.offset.y > 110 || i.velocity.y > 600) onClose()
        }}
      >
        {side === 'bottom' && (
          <div className="flex shrink-0 cursor-grab touch-none justify-center py-3" onPointerDown={(e) => drag.start(e)} aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-line" />
          </div>
        )}
        {!hideClose && (
          <IconButton label="Close" onClick={onClose} className="absolute right-2 top-2 z-10 bg-ivory/80">
            <X size={20} />
          </IconButton>
        )}
        {children}
      </motion.div>
    </div>
  )
}

export function Overlay({ open, ...rest }: Props) {
  return createPortal(<AnimatePresence>{open && <Panel key="panel" {...rest} />}</AnimatePresence>, document.body)
}
