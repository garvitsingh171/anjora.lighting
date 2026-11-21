import { Navigate, useLocation } from 'react-router-dom'
import { InstagramReel } from '../components/home/InstagramReel'
import { Hero } from '../components/home/Hero'
import { ProductPreview } from '../components/home/ProductPreview'
import { EnquirySection } from '../components/home/EnquirySection'
import { ExperienceChooser } from '../components/experience/ExperienceChooser'
import { usePageMeta } from '../lib/page-meta'

export function Home() {
  const { hash } = useLocation()
  usePageMeta({ title: 'Anjora Lighting | Consultancy & Bespoke Lighting', description: 'Architectural lighting consultancy and bespoke lighting products. Explore the spaces we design and the Rajasthan Collection we create.', canonical: 'https://anjora.lighting/', ogType: 'website' })
  // Preserve existing bookmarks to expertise while giving it a focused home.
  if (hash === '#services') return <Navigate to="/consultancy#services" replace />
  return <main id="main-content">
    <Hero />
    <ExperienceChooser />
    <ProductPreview />
    <InstagramReel />
    <EnquirySection />
  </main>
}
