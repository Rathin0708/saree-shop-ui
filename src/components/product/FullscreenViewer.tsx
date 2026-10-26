import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent as RPE } from 'react'
import { imgSrc } from '../../data/images'
import type { ImageRef } from '../../data/types'
import { Overlay } from '../ui/Overlay'

interface Item { image: ImageRef; label: string }
interface Props { open: boolean; items: Item[]; index: number; onIndex: (i: number) => void; onClose: () => void }

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

function Stage({ items, index, onIndex }: Omit<Props, 'open' | 'onClose'>) {
  const [t, setT] = useState({ s: 1, x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ d: number; s: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const item = items[index]

  const reset = useCallback(() => setT({ s: 1, x: 0, y: 0 }), [])
  const go = useCallback((d: number) => { reset(); onIndex((index + d + items.length) % items.length) }, [index, items.length, onIndex, reset])
  const zoom = (d: number) => setT((v) => { const s = clamp(v.s + d, 1, 4); return s === 1 ? { s, x: 0, y: 0 } : { ...v, s } })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === '+' || e.key === '=') zoom(0.5)
      else if (e.key === '-') zoom(-0.5)
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, reset])

  const down = (e: RPE) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); setDragging(true) }
  const move = (e: RPE) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    if (pts.length === 2) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      if (!pinch.current) pinch.current = { d, s: t.s }
      else setT((v) => ({ ...v, s: clamp((pinch.current!.s * d) / pinch.current!.d, 1, 4) }))
    } else if (t.s > 1) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      setT((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
    }
  }
  const up = (e: RPE) => { pointers.current.delete(e.pointerId); pinch.current = null; setDragging(pointers.current.size > 0) }

  return (
    <div className="relative flex h-dvh flex-col text-ivory">
      <p className="sr-only" aria-live="polite">{item.label}, image {index + 1} of {items.length}</p>
      <div
        className="relative flex-1 touch-none select-none overflow-hidden"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onWheel={(e) => zoom(e.deltaY < 0 ? 0.25 : -0.25)}
        onDoubleClick={() => (t.s > 1 ? reset() : setT({ s: 2.5, x: 0, y: 0 }))}
        style={{ cursor: t.s > 1 ? 'grab' : 'zoom-in' }}
      >
        <img src={imgSrc(item.image, 1200)} alt={item.image.alt} draggable={false} className="absolute inset-0 size-full object-contain" style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`, transition: dragging ? 'none' : 'transform 0.25s var(--ease-reveal)' }} />
      </div>
      <div className="flex shrink-0 items-center justify-center gap-1 bg-ink/90 p-2">
        <button type="button" aria-label="Previous image" onClick={() => go(-1)} disabled={items.length < 2} className="grid size-11 place-items-center hover:bg-ivory/10 disabled:opacity-30"><ChevronLeft size={20} /></button>
        <button type="button" aria-label="Zoom out" onClick={() => zoom(-0.5)} className="grid size-11 place-items-center hover:bg-ivory/10"><Minus size={18} /></button>
        <output className="t-price w-14 text-center text-sm">{Math.round(t.s * 100)}%</output>
        <button type="button" aria-label="Zoom in" onClick={() => zoom(0.5)} className="grid size-11 place-items-center hover:bg-ivory/10"><Plus size={18} /></button>
        <button type="button" aria-label="Reset zoom" onClick={reset} className="grid size-11 place-items-center hover:bg-ivory/10"><RotateCcw size={16} /></button>
        <button type="button" aria-label="Next image" onClick={() => go(1)} disabled={items.length < 2} className="grid size-11 place-items-center hover:bg-ivory/10 disabled:opacity-30"><ChevronRight size={20} /></button>
        <span className="ml-3 hidden text-xs text-ivory/70 sm:inline">{item.label} · {index + 1}/{items.length} · Drag to pan, scroll or pinch to zoom, arrows to browse</span>
      </div>
    </div>
  )
}

export function FullscreenViewer({ open, items, index, onIndex, onClose }: Props) {
  return (
    <Overlay open={open} onClose={onClose} label="Zoom viewer" side="full" className="bg-ink!" initialFocus="[aria-label='Zoom in']">
      <Stage key={items[0]?.image.n} items={items} index={index} onIndex={onIndex} />
    </Overlay>
  )
}
