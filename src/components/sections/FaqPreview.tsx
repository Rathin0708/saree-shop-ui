import { Link } from 'react-router-dom'
import { faqs } from '../../data/content'
import { AccordionItem } from '../ui/Accordion'
import { SectionHead } from './SectionHead'

export function FaqPreview() {
  return (
    <section aria-labelledby="faq-title" className="section">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHead num="14" label="Questions" id="faq-title" title="Before you choose" />
          <Link to="/faq" className="inline-flex min-h-11 items-center text-[12px] font-semibold uppercase tracking-[0.16em] underline underline-offset-8">All questions</Link>
        </div>
        <div>{faqs.slice(0, 5).map((f, i) => <AccordionItem key={f.q} title={f.q} defaultOpen={i === 0}>{f.a}</AccordionItem>)}</div>
      </div>
    </section>
  )
}
