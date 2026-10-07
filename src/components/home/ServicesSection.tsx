import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { services } from '../../data/services'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { ServiceSlide } from './ServiceSlide'
import './ServicesSection.css'

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const slides = gsap.utils.toArray<HTMLElement>('[data-service-slide]')
      const media = gsap.matchMedia()

      media.add(
        {
          desktop: '(min-width: 900px)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { desktop, motion } = context.conditions ?? {}
          if (!desktop || !motion || slides.length < 2) return

          gsap.set(slides.slice(1), { yPercent: 100, autoAlpha: 0 })

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.services__pin',
              start: 'top top',
              end: () => `+=${window.innerHeight * (slides.length - 1)}`,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          slides.slice(1).forEach((nextSlide, nextIndex) => {
            const currentSlide = slides[nextIndex]
            if (!currentSlide) return

            timeline
              .to(currentSlide, { yPercent: -100, autoAlpha: 0, duration: 1 }, nextIndex)
              .to(nextSlide, { yPercent: 0, autoAlpha: 1, duration: 1 }, nextIndex)
              .fromTo(
                nextSlide.querySelector('.service-slide__image'),
                { scale: 1.06 },
                { scale: 1, duration: 1 },
                nextIndex,
              )
          })

          const refresh = () => ScrollTrigger.refresh()
          window.addEventListener('load', refresh, { once: true })
          return () => window.removeEventListener('load', refresh)
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
          <div className="services__rule" />
          <span>01—04</span>
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
