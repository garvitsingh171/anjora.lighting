import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { services } from '../../data/services'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { EASE_IN_OUT, EASE_REVEAL, EASE_UI } from '../../lib/motion'
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
          const firstSlide = slides[0]
          if (!firstSlide) return

          gsap.set(slides, { zIndex: 0 })
          gsap.set(firstSlide, { zIndex: 2, autoAlpha: 1 })
          gsap.set(slides.slice(1), { autoAlpha: 0 })
          gsap.set(progressFill, { scaleY: 0, transformOrigin: 'top center' })

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
              fastScrollEnd: true,
              onUpdate: (self) => {
                const activeIndex = Math.min(
                  slides.length - 1,
                  Math.floor(self.progress * (slides.length - 1) + 0.75),
                )
                if (currentIndicator) currentIndicator.textContent = String(activeIndex + 1).padStart(2, '0')
                gsap.set(progressFill, { scaleY: self.progress })
              },
            },
          })

          slides.slice(1).forEach((nextSlide, nextIndex) => {
            const currentSlide = slides[nextIndex]
            if (!currentSlide) return
            const currentImage = currentSlide.querySelector('.service-slide__image')
            const currentBody = currentSlide.querySelector('.service-slide__body')
            const nextVisual = nextSlide.querySelector('.service-slide__visual')
            const nextImage = nextSlide.querySelector('.service-slide__image')
            const nextCopy = nextSlide.querySelectorAll('.service-slide__body > *')

            timeline
              .to(currentImage, { yPercent: -5, scale: 1.03, autoAlpha: 0.38, duration: 0.72, ease: EASE_IN_OUT }, nextIndex)
              .to(currentBody, { y: -18, autoAlpha: 0, duration: 0.28, ease: EASE_UI }, nextIndex)
              .set(nextSlide, { autoAlpha: 1, zIndex: 2 }, nextIndex + 0.1)
              .fromTo(
                nextVisual,
                { clipPath: 'inset(100% 0 0 0)' },
                { clipPath: 'inset(0% 0 0 0)', duration: 0.76, ease: EASE_IN_OUT },
                nextIndex + 0.1,
              )
              .fromTo(nextImage, { yPercent: 6, scale: 1.06 }, {
                yPercent: 0,
                scale: 1,
                duration: 0.9,
                ease: EASE_REVEAL,
              }, nextIndex + 0.1)
              .fromTo(nextCopy, { autoAlpha: 0, y: 18 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.48,
                stagger: 0.05,
                ease: EASE_REVEAL,
              }, nextIndex + 0.14)
              .set(currentSlide, { autoAlpha: 0, zIndex: 0 }, nextIndex + 0.96)
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
