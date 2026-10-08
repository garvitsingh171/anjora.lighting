import { Hero } from '../components/home/Hero'
import { ServicesSection } from '../components/home/ServicesSection'
import { CuratedWorks } from '../components/home/CuratedWorks'
import { ConsultancyProcess } from '../components/home/ConsultancyProcess'
import { ProductPreview } from '../components/home/ProductPreview'
import { EnquirySection } from '../components/home/EnquirySection'
import { InsightsPreview } from '../components/home/InsightsPreview'

export function Home() {
  return (
    <main id="main-content" className="overflow-x-clip">
      <Hero />
      <ServicesSection />
      <CuratedWorks />
      <ConsultancyProcess />
      <ProductPreview />
      <InsightsPreview />
      <EnquirySection />
    </main>
  )
}
