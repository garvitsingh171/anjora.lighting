import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { services } from '../../data/services'
import { gsap } from '../../lib/gsap'
import { EASE_IN_OUT, EASE_REVEAL } from '../../lib/motion'
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

          const updateActive = (progress: number) => {
            const activeIndex = Math.min(slides.length - 1, Math.round(progress * (slides.length - 1)))
            if (currentIndicator) currentIndicator.textContent = String(activeIndex + 1).padStart(2, '0')
            slides.forEach((slide, index) => {
              slide.inert = index !== activeIndex
              slide.setAttribute('aria-hidden', String(index !== activeIndex))
            })
          }
          updateActive(0)

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.services__pin',
              start: 'top 80px',
              end: () => `+=${Math.max(520, window.innerHeight * 0.72) * (slides.length - 1)}`,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                updateActive(self.progress)
                gsap.set(progressFill, { scaleY: self.progress })
              },
            },
          })

          slides.slice(1).forEach((nextSlide, nextIndex) => {
            const currentSlide = slides[nextIndex]
            if (!currentSlide) return
            const currentImage = currentSlide.querySelector('.service-slide__image')
            const currentCopy = currentSlide.querySelectorAll('.service-slide__body > *')
            const nextVisual = nextSlide.querySelector('.service-slide__visual')
            const nextImage = nextSlide.querySelector('.service-slide__image')
            const nextCopy = nextSlide.querySelectorAll('.service-slide__body > *')

            timeline
              .set(nextSlide, { visibility: 'visible', zIndex: 3 }, nextIndex)
              .fromTo(nextSlide, { opacity: 0 }, { opacity: 1, duration: 0.62 }, nextIndex)
              .to(currentImage, { yPercent: -8, scale: 1.035, duration: 0.68, ease: EASE_IN_OUT }, nextIndex)
              .to(currentCopy, { y: -18, opacity: 0, duration: 0.35, stagger: 0.02 }, nextIndex)
              .fromTo(
                nextVisual,
                { clipPath: 'inset(100% 0 0 0)' },
                { clipPath: 'inset(0% 0 0 0)', duration: 0.68, ease: EASE_IN_OUT },
                nextIndex,
              )
              .fromTo(nextImage, { yPercent: 6, scale: 1.06 }, {
                yPercent: 0,
                scale: 1,
                duration: 0.68,
                ease: EASE_REVEAL,
              }, nextIndex)
              .fromTo(nextCopy, { autoAlpha: 0, y: 18 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.46,
                stagger: 0.035,
                ease: EASE_REVEAL,
              }, nextIndex + 0.12)
              .set(currentSlide, { autoAlpha: 0, zIndex: 0 }, nextIndex + 0.72)
              .set(nextSlide, { zIndex: 2 }, nextIndex + 0.98)
              .to({}, { duration: 0.02 }, nextIndex + 0.98)
          })

          return () => {
            slides.forEach((slide) => {
              slide.inert = false
              slide.removeAttribute('aria-hidden')
            })
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
