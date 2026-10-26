import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../config/brand'
import { EMAIL_RE } from '../lib/validation'
import { AccordionItem } from '../components/ui/Accordion'
import { Button, LinkButton } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Img } from '../components/ui/Img'
import { Reveal } from '../components/ui/Reveal'
import { WovenDivider } from '../components/ui/WovenDivider'
import { dayParts, faqs } from '../data/content'
import { img } from '../data/images'
import { usePageMeta } from '../hooks/usePageMeta'

function Page({ title, lead, children, wide = false }: { title: string; lead?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="wrap py-10 md:py-20">
      <header className="mb-10 max-w-4xl md:mb-16">
        <h1 className="t-display">{title}</h1>
        {lead && <p className="t-lead mt-6 max-w-[60ch] text-muted">{lead}</p>}
        <WovenDivider className="mt-8 max-w-48" />
      </header>
      <div className={`${wide ? '' : 'max-w-[68ch]'} space-y-5 text-[16px] leading-[1.75]`}>{children}</div>
    </div>
  )
}
const H = ({ children, id }: { children: ReactNode; id?: string }) => <h2 id={id} className="t-title pt-6">{children}</h2>

export function OurStory() {
  usePageMeta('Our Story', 'About the NEYTHAL concept storefront.')
  return (
    <Page title="Our Story" lead={`${brand.name} is a concept saree house, built to show how a textile-first store can feel. This page is placeholder copy: replace it with your own history.`}>
      <p>We start from the cloth. Each saree page leads with the drape, then the border, the pallu and the weave, because that is how people actually judge a saree.</p>
      <p>
        The name comes from <span lang={brand.accent.lang} className="font-script text-xl">{brand.accent.text}</span>, a Tamil word for {brand.accent.meaning}.
      </p>
      <H>What this demo is, and is not</H>
      <p>This is a front-end demonstration. Products, prices and reviews are sample content; checkout and accounts are not active. Photographs are public-domain or openly licensed images from Wikimedia Commons, credited in <a className="underline" href="/img/CREDITS.txt">the credits file</a>.</p>
      <LinkButton to="/craft" variant="outline" className="mt-4">Read the craft guide</LinkButton>
    </Page>
  )
}

export function Craft() {
  usePageMeta('The Craft', 'A general guide to saree weaves, zari and drape.')
  return (
    <Page wide title="The Craft" lead="A short, general guide to the weaving traditions behind the sarees in this store. It describes saree traditions in general, not any specific workshop.">
      <div className="grid gap-12 md:grid-cols-3">
        {dayParts.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.08}>
            <div className="aspect-[4/5] overflow-hidden bg-parchment"><Img image={[img(129, 'Red silk saree with gold paisley border', 'center 70%'), img(105, 'Amethyst brocade with gold medallions', 'center 30%'), img(46, 'Indigo ikat saree with gold-dotted border', 'center 30%')][i]} sizes="(min-width:768px) 30vw, 100vw" className="size-full" /></div>
            <h2 className="mt-4 text-3xl">{d.title}</h2>
            <p className="mt-2 max-w-[44ch] text-muted">{d.copy}</p>
          </Reveal>
        ))}
      </div>
      <div className="max-w-[68ch] space-y-5 pt-8">
        <H>Anatomy of a saree</H>
        <p>A saree is typically 5.5 to 6 metres of unstitched cloth: the <strong>body</strong> (field), two long <strong>borders</strong>, and the <strong>pallu</strong>, the decorated end that falls over the shoulder. A <strong>blouse piece</strong> is sometimes woven alongside.</p>
        <H>Zari</H>
        <p>Zari is metallic thread used to weave motifs into cloth. Traditionally it wraps fine silver in gold; modern zari ranges from real metal to metallic-coated polyester. Product pages state the zari type for each saree.</p>
        <H>Reading the weave</H>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Korvai / temple border</strong>: a contrasting border interlocked with the body.</li>
          <li><strong>Kadhwa</strong>: motifs woven individually, often leaving a clean reverse.</li>
          <li><strong>Ikat</strong>: threads are resist-dyed before weaving, so patterns blur softly.</li>
          <li><strong>Mulmul</strong>: a very fine, soft cotton.</li>
        </ul>
        <Link to="/care-guide" className="inline-block underline underline-offset-4">Read the care guide</Link>
      </div>
    </Page>
  )
}

export function Faq() {
  usePageMeta('FAQ', 'Answers to common questions about sarees, shipping and returns.')
  return (
    <Page title="Frequently asked" lead="Questions about choosing, caring for and ordering sarees.">
      <div className="-mt-4">{faqs.map((f) => <AccordionItem key={f.q} title={f.q}>{f.a}</AccordionItem>)}</div>
      <p className="pt-6">Still unsure? <Link to="/contact" className="underline underline-offset-4">Write to us</Link>.</p>
    </Page>
  )
}

export function Contact() {
  usePageMeta('Contact', 'Write to the NEYTHAL demo studio.')
  const [v, setV] = useState({ name: '', email: '', message: '' })
  const [err, setErr] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (v.name.trim().length < 2) er.name = 'Enter your name.'
    if (!EMAIL_RE.test(v.email)) er.email = 'Enter a valid email address.'
    if (v.message.trim().length < 10) er.message = 'Write at least a short sentence (10 characters).'
    setErr(er)
    setSent(Object.keys(er).length === 0)
  }
  return (
    <Page wide title="Contact" lead="Questions about a weave, a blouse or an order? Details below are placeholders.">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <address className="space-y-1 not-italic text-muted">
          <p>{brand.contact.address}</p><p>{brand.contact.hours}</p>
          <p><a className="underline" href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a></p><p>{brand.contact.phone}</p>
        </address>
        {sent ? (
          <p role="status" className="border border-peacock/40 bg-parchment p-6">Thank you, {v.name}. This is a demo form, so your message was not sent anywhere.</p>
        ) : (
          <form onSubmit={submit} noValidate className="max-w-xl space-y-5">
            <Field label="Name" autoComplete="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} error={err.name} />
            <Field label="Email" type="email" autoComplete="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={err.email} />
            <div>
              <label htmlFor="msg" className="t-label mb-2 block text-muted">Message</label>
              <textarea id="msg" rows={5} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} aria-invalid={!!err.message} aria-describedby={err.message ? 'msg-e' : undefined} className={`w-full border bg-parchment p-4 ${err.message ? 'border-danger' : 'border-line'}`} />
              {err.message && <p id="msg-e" className="mt-1.5 text-xs font-medium text-danger">Error: {err.message}</p>}
            </div>
            <Button type="submit">Send message</Button>
          </form>
        )}
      </div>
    </Page>
  )
}

export function Shipping() {
  usePageMeta('Shipping', 'Demo shipping policy.')
  return (
    <Page title="Shipping" lead="Demo policy text. Replace with your carrier terms.">
      <p>Orders above ₹{brand.freeShippingThreshold.toLocaleString(brand.locale)} ship free; below that, a flat ₹{brand.shippingFlat} applies.</p>
      <p>The delivery estimator on each product page gives a deterministic demo estimate from the PIN code. It is not a carrier promise, and no shipments are created in this demo.</p>
    </Page>
  )
}
export function Returns() {
  usePageMeta('Returns', 'Demo returns policy.')
  return (
    <Page title="Returns" lead="Demo policy text. Replace with your own terms.">
      <p>Unused sarees with tags and packaging intact can be returned within {brand.returnWindowDays} days of delivery.</p>
      <p>Customised items such as stitched blouses and fall and pico finishing are not returnable.</p>
    </Page>
  )
}
export function CareGuide() {
  usePageMeta('Care Guide', 'How to care for silk, cotton and embroidered sarees.')
  return (
    <Page title="Care Guide" lead="Good habits that keep a saree wearable for decades.">
      <H>Silk</H><p>Dry clean only. Store folded in a muslin cloth and refold along different lines every few months. Keep away from direct sunlight, perfume and damp.</p>
      <H>Cotton and mulmul</H><p>Gentle hand wash in cold water, dry in shade and iron slightly damp. Wash dark colours separately the first few times.</p>
      <H>Embroidered and embellished</H><p>Dry clean only. Store flat or rolled with tissue between layers, never hung.</p>
      <H id="blouse">Size and blouse guide</H>
      <p>Where included, the blouse piece length is listed in each product’s specifications. For a stitched blouse, add the demo stitching option on the product page; measurements are collected after ordering in a real store. In this demo, no measurement is collected.</p>
    </Page>
  )
}
export function Privacy() {
  usePageMeta('Privacy', 'Demo privacy notice.')
  return (
    <Page title="Privacy" lead="Demo notice. Replace with your policy.">
      <p>This demo stores your cart, wishlist, recently viewed items, newsletter sign-ups and demo orders in your browser’s local storage only. Nothing is transmitted to a server.</p>
      <p>You can clear this data at any time through your browser’s site settings.</p>
    </Page>
  )
}
export function Terms() {
  usePageMeta('Terms', 'Demo terms of use.')
  return (
    <Page title="Terms" lead="Demo terms. Replace with your own.">
      <p>This storefront is a demonstration. No purchase can be completed, no payment is processed, and no goods are supplied.</p>
      <p>Sample reviews and product data are illustrative. Photographs are credited in <a href="/img/CREDITS.txt" className="underline">the credits file</a>.</p>
    </Page>
  )
}
