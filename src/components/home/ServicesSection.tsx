import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { services } from '../../data/services'
import { gsap } from '../../lib/gsap'
import { getServiceFrame } from '../../lib/service-progress'
import { ServiceSlide } from './ServiceSlide'
import './ServicesSection.css'

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const slides = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-service-slide]'))
      const currentIndicator = section.querySelector<HTMLElement>('[data-service-current]')
      const progressFill = section.querySelector<HTMLElement>('[data-service-progress]')
      const media = gsap.matchMedia()

      media.add(
        {
          desktop: '(min-width: 900px)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { desktop, motion } = context.conditions ?? {}
          if (!desktop || !motion || slides.length < 2) return
          const pin = section.querySelector<HTMLElement>('.services__pin')
          if (!pin) return

          // One playhead owns presentation, accessibility and the counter. No slide
          // tweens can capture stale visibility when seeking, reversing or refreshing.
          const bodies = slides.map(slide => slide.querySelector<HTMLElement>('.service-slide__body'))
          const playhead = { value: 0 }
          section.dataset.enhanced = 'true'
          const render = () => {
            const frame = getServiceFrame(playhead.value, slides.length)
            slides.forEach((slide, index) => {
              const opacity = frame.opacities[index]!
              slide.style.opacity = String(opacity)
              slide.style.visibility = opacity > 0 ? 'visible' : 'hidden'
              slide.style.zIndex = index === frame.active ? '2' : '1'
              // Crossfade photographs while keeping only one readable text layer.
              if (bodies[index]) bodies[index]!.style.visibility = index === frame.active ? 'visible' : 'hidden'
              slide.inert = index !== frame.active
              slide.setAttribute('aria-hidden', String(index !== frame.active))
            })
            if (currentIndicator) currentIndicator.textContent = String(frame.active + 1).padStart(2, '0')
            if (progressFill) progressFill.style.transform = `scaleY(${playhead.value / (slides.length - 1)})`
          }
          render()

          gsap.to(playhead, {
            value: slides.length - 1,
            duration: slides.length - 1,
            ease: 'none',
            onUpdate: render,
            scrollTrigger: {
              id: 'home-services',
              trigger: pin,
              start: 'top 96px',
              end: () => `+=${Math.max(520, window.innerHeight * 0.72) * (slides.length - 1)}`,
              pin: true,
              scrub: 0.3,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                self.animation?.progress(self.progress)
                render()
              },
            },
          })

          return () => {
            delete section.dataset.enhanced
            slides.forEach((slide) => {
              slide.inert = false
              slide.removeAttribute('aria-hidden')
              for (const property of ['opacity', 'visibility', 'z-index']) slide.style.removeProperty(property)
            })
            bodies.forEach(body => body?.style.removeProperty('visibility'))
            progressFill?.style.removeProperty('transform')
            if (currentIndicator) currentIndicator.textContent = '01'
          }
        },
      )

      return () => media.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="services" className="services-section" aria-labelledby="services-title">
      <div className="services__intro container">
        <div className="services__intro-grid">
          <div className="services__intro-heading">
            <p className="eyebrow">Our expertise</p>
            <h2 id="services-title" className="display-title">Here’s what we offer</h2>
          </div>
          <div className="services__intro-copy">
            <p className="services__intro-kicker">Crafting light to elevate environments</p>
            <p>
              Anjora is an architectural lighting consultancy focused on shaping how spaces are experienced through light.
            </p>
            <p>
              We work from concept and strategy through detailed planning, fixture specification, execution and commissioning.
            </p>
          </div>
        </div>
      </div>

      <div className="services__pin container">
        <div className="services__rail" aria-hidden="true">
          <span>Our expertise</span>
          <div className="services__rule"><span data-service-progress /></div>
          <span className="services__progress"><b data-service-current>01</b> / {String(services.length).padStart(2, '0')}</span>
        </div>
        <div className="services__stage">
          {services.map((service, index) => (
            <ServiceSlide key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
