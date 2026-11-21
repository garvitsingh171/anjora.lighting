import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import architecture from '../../assets/projects/kingsman/cover.jpg'
import { featuredProducts } from '../../data/products'
import { gsap } from '../../lib/gsap'
import { ExperienceChoice } from './ExperienceChoice'
import './ExperienceChooser.css'

export function ExperienceChooser() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 94%', once: true, onLeave: self => self.animation?.progress(1) } })
        .from('.experience-chooser__heading', { y: 12, opacity: 0.6, duration: 0.35 })
        .from('.experience-choice__media', { clipPath: 'inset(0 0 12% 0)', duration: 0.5, stagger: 0.08 }, 0.1)
        .from('.experience-choice h3', { y: 10, opacity: 0.65, duration: 0.35, stagger: 0.06 }, 0.25)
        .from('.experience-choice__cta > span', { x: -5, y: 5, duration: 0.3, stagger: 0.06 }, 0.4)
    })
    return () => media.revert()
  }, { scope: root })
  return (
    <section ref={root} id="explore" className="experience-chooser container" aria-labelledby="explore-title">
      <header className="experience-chooser__heading">
        <div><p className="eyebrow">Explore Anjora</p><h2 id="explore-title" className="display-title">What brings you here?</h2></div>
        <p>Two ways to experience light — through spaces we design and pieces we create.</p>
      </header>
      <div className="experience-chooser__grid">
        <ExperienceChoice to="/consultancy" kind="consultancy" image={architecture} title="Lighting consultancy"
          description="Planning a space? Explore our lighting design, specification, execution and project expertise." label="Explore consultancy" />
        <ExperienceChoice to="/products" kind="products" image={featuredProducts[1]!.cover.src} title="Lighting products"
          description="Discover bespoke lighting inspired by Rajasthan’s architecture, heritage and craftsmanship." label="Explore collection" />
      </div>
    </section>
  )
}
