import { BestSellers } from '../components/sections/BestSellers'
import { BridalStory } from '../components/sections/BridalStory'
import { Everyday } from '../components/sections/Everyday'
import { FabricRail } from '../components/sections/FabricRail'
import { FaqPreview } from '../components/sections/FaqPreview'
import { Festive } from '../components/sections/Festive'
import { Gallery } from '../components/sections/Gallery'
import { Hero } from '../components/sections/Hero'
import { NewArrivals } from '../components/sections/NewArrivals'
import { Newsletter } from '../components/sections/Newsletter'
import { OccasionIndex } from '../components/sections/OccasionIndex'
import { Promo } from '../components/sections/Promo'
import { Testimonials } from '../components/sections/Testimonials'
import { Traditions } from '../components/sections/Traditions'
import { WeaveAnatomy } from '../components/sections/WeaveAnatomy'
import { usePageMeta } from '../hooks/usePageMeta'

export default function HomePage() {
  usePageMeta('', 'NEYTHAL is a demo saree house storefront: Kanjivaram, Banarasi, soft silk, cotton and designer sarees, shown in editorial detail.')
  return (
    <>
      <Hero />
      <FabricRail />
      <NewArrivals />
      <BridalStory />
      <OccasionIndex />
      <WeaveAnatomy />
      <BestSellers />
      <Festive />
      <Everyday />
      <Traditions />
      <Promo />
      <Testimonials />
      <Gallery />
      <FaqPreview />
      <Newsletter />
    </>
  )
}
