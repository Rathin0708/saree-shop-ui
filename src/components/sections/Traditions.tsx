import { dayParts } from '../../data/content'
import { img } from '../../data/images'
import { Img } from '../ui/Img'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from './SectionHead'

const photos = [img(134, 'Brown and gold ikat-patterned saree length'), img(91, 'Wine-red and gold patterned saree length with a crimson border'), img(46, 'Indigo ikat saree with teal and red diamond motifs', 'center 30%')]

/** General heritage of weaving centres. Not a claim about any specific workshop or person. */
export function Traditions() {
  return (
    <section aria-labelledby="trad-title" className="section bg-parchment">
      <div className="wrap">
        <SectionHead num="10" label="The weaving traditions" id="trad-title" title="Three towns, three ways of making cloth" linkTo="/craft" linkLabel="Read the craft guide" />
        <p className="mb-12 max-w-[60ch] text-sm text-muted">A general introduction to saree-weaving regions. It is not a profile of any particular artisan or workshop.</p>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {dayParts.map((d, i) => (
            <li key={d.slug}>
              <Reveal delay={i * 0.1} className="md:px-8 md:first:pl-0 md:last:pr-0">
                <p className="t-price font-display text-[7rem] leading-none text-zari/70">{i + 1}</p>
                <div className="my-4 aspect-[5/3] overflow-hidden"><Img image={photos[i]} sizes="(min-width:768px) 30vw, 100vw" className="size-full" /></div>
                <h3 className="text-4xl">{d.title}</h3>
                <p className="mt-3 text-muted">{d.copy}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
