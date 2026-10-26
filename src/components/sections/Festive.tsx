import { img } from '../../data/images'
import { LinkButton } from '../ui/Button'
import { Img } from '../ui/Img'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from './SectionHead'

/** Peacock-green collage: one portrait, two macro crops, one pull quote. The only arched mask besides the fabric rail. */
export function Festive() {
  return (
    <section aria-labelledby="fest-title" className="on-peacock section bg-peacock text-ivory">
      <div className="wrap">
        <SectionHead num="08" label="The festive collection" id="fest-title" tone="dark" title={<>Colour is the oldest <span className="italic-display">festival</span></>} />
        <div className="grid gap-4 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-5">
            <div className="aspect-[3/4] overflow-hidden rounded-t-[999px] bg-ivory/10">
              <Img image={img(124, 'Peacock blue and lime Paithani-style saree held open to show the pallu', 'center 25%')} sizes="(min-width:768px) 40vw, 100vw" className="size-full" />
            </div>
          </Reveal>
          <div className="grid gap-4 md:col-span-7 md:grid-rows-[auto_1fr] md:gap-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <Reveal delay={0.1}>
                <figure><div className="aspect-[4/5] overflow-hidden"><Img image={img(79, 'Blue and rust-orange silk saree with a temple-style border')} sizes="(min-width:768px) 20vw, 50vw" className="size-full" /></div>
                  <figcaption className="t-label mt-2 text-[10px] text-ivory/70">Border detail, temple motif</figcaption></figure>
              </Reveal>
              <Reveal delay={0.2} className="mt-10">
                <figure><div className="aspect-[4/5] overflow-hidden"><Img image={img(132, 'Marigold silk woven with floral Paithani-style motifs')} sizes="(min-width:768px) 20vw, 50vw" className="size-full" /></div>
                  <figcaption className="t-label mt-2 text-[10px] text-ivory/70">Pallu motifs in marigold</figcaption></figure>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="flex flex-col justify-end border-t border-ivory/30 pt-6">
              <blockquote className="font-display text-[clamp(1.8rem,3.2vw,3rem)] italic leading-[1.1]">“Wear the day you are celebrating.”</blockquote>
              <p className="mt-4 max-w-[46ch] text-ivory/80">From peacock blue to marigold, the festive edit is built for rooms full of light, lamps and people who notice a border.</p>
              <div className="mt-6"><LinkButton to="/occasion/festive" variant="light">Shop festive</LinkButton></div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
