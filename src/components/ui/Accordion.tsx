import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

export function AccordionItem({ title, children, defaultOpen = false, tone = 'light' }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; tone?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={`border-b ${tone === 'dark' ? 'border-ivory/20' : 'border-line'}`}>
      <h3 className="font-sans text-base font-medium leading-snug tracking-normal">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={open}
          aria-controls={`${id}-p`}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left"
        >
          <span className="font-display text-xl md:text-2xl">{title}</span>
          <Plus size={20} aria-hidden="true" className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-45' : ''}`} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-p`}
            role="region"
            aria-labelledby={`${id}-b`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-[68ch] pb-6 text-[15px] leading-relaxed opacity-85">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
