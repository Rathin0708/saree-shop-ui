import { ArrowDown } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { brand } from '../../config/brand'
import { imgSrc, imgSrcSet } from '../../data/images'
import { LinkButton } from '../ui/Button'
import { Img } from '../ui/Img'

const ease = [0.22, 1, 0.36, 1] as const
const portrait = { n: 59, alt: 'Model draped in a violet Banarasi silk saree with a gold zari pallu', pos: 'center 18%' }
const macro = { n: 56, alt: 'Close-up of violet brocade woven with gold floral and peacock motifs' }

const lines = ['Woven', 'heirlooms,', 'worn today']

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yPortrait = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60])
  const yMacro = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70])

  const unfurl = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 } }
    : { initial: { clipPath: 'inset(0 0 0 100%)' }, animate: { clipPath: 'inset(0 0 0 0%)' }, transition: { duration: 1.2, ease } }

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden pt-[112px] md:pt-[170px] lg:pt-[176px]">
      <div className="wrap grid items-center gap-8 pb-16 lg:min-h-[calc(100svh-176px)] lg:grid-cols-12 lg:gap-6 lg:pb-20">
        <div className="relative z-10 lg:col-span-5">
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="t-label mb-6 flex items-center gap-3 text-kumkum">
            <span className="t-price">01</span><span aria-hidden="true" className="h-px w-8 bg-current" /> The Festive Edit
          </motion.p>
          <h1 id="hero-title" className="t-display-xl text-ink">
            <span className="sr-only">Woven heirlooms, worn today</span>
            {lines.map((l, i) => (
              <span key={l} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
                <motion.span className={`block ${i === 1 ? 'italic-display text-kumkum' : ''}`} initial={reduce ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease }}>
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.7, ease }}>
            <p className="t-lead mt-8 max-w-[44ch] text-muted">
              Kanjivaram temple borders, Banarasi brocade and handloom cottons, shown the way a saree is judged: drape, border, pallu, weave.
            </p>
            <p className="mt-5 flex items-baseline gap-3">
              <span lang={brand.accent.lang} className="font-script text-3xl text-kumkum">{brand.accent.text}</span>
              <span className="t-label text-muted">“{brand.accent.meaning}” in Tamil</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/sarees">Explore sarees</LinkButton>
              <LinkButton to="/collections/new-arrivals" variant="outline">Shop new arrivals</LinkButton>
            </div>
          </motion.div>
        </div>

        <div className="relative lg:col-span-7">
          <motion.div {...unfurl} className="relative ml-auto aspect-[4/5] w-full max-w-[640px] overflow-hidden bg-parchment lg:aspect-auto lg:h-[max(560px,calc(100svh-190px))] lg:max-w-none">
            <motion.div style={{ y: yPortrait }} className="absolute -inset-y-[8%] inset-x-0">
              <picture>
                <source media="(max-width: 767px)" type="image/webp" srcSet="/img/hero-m-480.webp 480w, /img/hero-m-800.webp 800w" sizes="100vw" />
                <img
                  src={imgSrc(portrait, 800)} srcSet={imgSrcSet(portrait)} sizes="(min-width:1024px) 58vw, 100vw" width={1280} height={1920}
                  alt={portrait.alt} fetchPriority="high" decoding="async" className="size-full object-cover" style={{ objectPosition: portrait.pos }}
                />
              </picture>
            </motion.div>
          </motion.div>
          <motion.figure style={{ y: yMacro }} className="absolute -bottom-6 left-2 z-10 w-[42%] max-w-[300px] sm:left-0 lg:-left-[6%] lg:bottom-[4%]">
            <motion.div initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 0.9, ease }} className="border-[6px] border-ivory bg-ivory">
              <Img image={macro} sizes="300px" className="aspect-[4/5] w-full" />
            </motion.div>
            <figcaption className="t-label mt-2 text-[10px] text-muted">Pallu detail, brocade in gold zari</figcaption>
          </motion.figure>
        </div>
      </div>
      <a href="#fabrics" aria-label="Scroll to shop by fabric" className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-muted hover:text-kumkum lg:flex">
        <span className="t-label text-[10px]">Scroll</span>
        <ArrowDown size={16} aria-hidden="true" className="animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  )
}
