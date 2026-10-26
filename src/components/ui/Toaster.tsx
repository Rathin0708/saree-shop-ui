import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToasts } from '../../hooks/useStores'
import { dismissToast } from '../../store/stores'

export function Toaster() {
  const toasts = useToasts()
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[150] flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:items-end"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 border border-ivory/10 bg-kumkum-deep px-4 py-2 text-sm text-ivory"
          >
            <Check size={16} aria-hidden="true" className="shrink-0 text-zari" />
            <span className="flex-1 py-1">{t.message}</span>
            {t.to && t.actionLabel && (
              <Link to={t.to} onClick={() => dismissToast(t.id)} className="inline-flex min-h-11 items-center text-[12px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
                {t.actionLabel}
              </Link>
            )}
            {t.onAction && t.actionLabel && (
              <button
                type="button"
                onClick={() => {
                  t.onAction?.()
                  dismissToast(t.id)
                }}
                className="min-h-11 text-[12px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
              >
                {t.actionLabel}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
