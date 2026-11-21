import { Hero } from '../components/home/Hero'
import { ServicesSection } from '../components/home/ServicesSection'
import { CuratedWorks } from '../components/home/CuratedWorks'
import { ConsultancyProcess } from '../components/home/ConsultancyProcess'
import { InsightsPreview } from '../components/home/InsightsPreview'
import { EnquirySection } from '../components/home/EnquirySection'
import { PracticeIntro } from '../components/experience/PracticeIntro'
import { ExperienceCrossLink } from '../components/experience/ExperienceCrossLink'
import { usePageMeta } from '../lib/page-meta'

export function Consultancy() {
  usePageMeta({ title: 'Architectural Lighting Consultancy | Anjora Lighting', description: 'Explore Anjora’s lighting design, specification, execution and commissioning expertise. Start a project with our Jaipur practice.', canonical: 'https://anjora.lighting/consultancy', ogType: 'website' })
  return <main id="main-content">
    <Hero experience="consultancy" />
    <ServicesSection />
    <CuratedWorks />
    <ConsultancyProcess />
    <InsightsPreview />
    <PracticeIntro />
    <EnquirySection />
    <ExperienceCrossLink to="products" />
  </main>
}
