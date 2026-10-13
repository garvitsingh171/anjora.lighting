import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import heroImage from '../../assets/images/hero-exterior.jpg'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, EASE_UI, prefersReducedMotion } from '../../lib/motion'
import './Hero.css'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!heroRef.current) return
      if (prefersReducedMotion()) return

      const timeline = gsap.timeline({ defaults: { ease: EASE_REVEAL } })
      const header = document.querySelector('.site-header')
      timeline
        .fromTo('.hero__image', { scale: 1.07 }, { scale: 1, duration: 1.6 })
        .fromTo('.hero__shade', { opacity: 0.76 }, { opacity: 1, duration: 0.9 }, 0)
      if (header) {
        timeline.fromTo(header, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.16)
      }
      timeline
        .fromTo('.hero__eyebrow', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.45)
        .fromTo('.hero__line > span', { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, 0.52)
        .fromTo('.hero__footer > *', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.1 }, 1.08)
        .fromTo('.hero__scroll', { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE_UI }, 1.35)

      const media = gsap.matchMedia()
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.55,
          },
        })
          .to('.hero__media', { yPercent: 4, ease: 'none' }, 0)
          .to('.hero__content', { y: -30, ease: 'none' }, 0)
          .to('.hero__footer', { autoAlpha: 0.36, ease: 'none' }, 0)
          .to('.hero__scroll', { autoAlpha: 0, y: 10, ease: 'none' }, 0)

        const hero = heroRef.current
        const lightField = hero?.querySelector<HTMLElement>('.hero__light-field')
        if (!hero || !lightField) return

        const handlePointerMove = (event: PointerEvent) => {
          const bounds = hero.getBoundingClientRect()
          lightField.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
          lightField.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
        }
        const handlePointerLeave = () => {
          lightField.style.removeProperty('--pointer-x')
          lightField.style.removeProperty('--pointer-y')
        }

        hero.addEventListener('pointermove', handlePointerMove)
        hero.addEventListener('pointerleave', handlePointerLeave)
        return () => {
          hero.removeEventListener('pointermove', handlePointerMove)
          hero.removeEventListener('pointerleave', handlePointerLeave)
        }
      })

      return () => media.revert()
    },
    { scope: heroRef },
  )

  return (
    <section ref={heroRef} className="hero-section" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <img
          className="hero__image"
          src={heroImage}
          alt=""
          width="1600"
          height="800"
          fetchPriority="high"
        />
      </div>
      <div className="hero__shade" />
      <div className="hero__light-field" aria-hidden="true" />

      <div className="hero__content container">
        <p className="eyebrow hero__eyebrow">Architectural lighting consultancy</p>
        <h1 id="hero-title" className="display-title hero__title">
          <span className="hero__line"><span>Anjora: Where</span></span>
          <span className="hero__line"><span>Light Shapes</span></span>
          <span className="hero__line"><span>Space</span></span>
        </h1>

        <div className="hero__footer">
          <p>Consultancy · Design · Specification · Execution</p>
          <a
            className="hero__enquiry"
            href="#enquiry"
          >
            <span>Enquiry</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <a className="hero__scroll" href="#services" aria-label="Scroll to services">
        <span>Scroll</span>
        <svg viewBox="0 0 16 36" aria-hidden="true">
          <path d="M8 1v32M2 27l6 7 6-7" />
        </svg>
      </a>
    </section>
  )
}
