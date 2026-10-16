import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import heroImage from '../../assets/projects/city-palace/cover.jpg'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, prefersReducedMotion } from '../../lib/motion'
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
        .fromTo('.hero__image', { scale: 1.045 }, { scale: 1, duration: 1.5 })
        .fromTo('.hero__shade', { opacity: 0.85 }, { opacity: 1, duration: 0.9 }, 0)
      if (header) {
        timeline.fromTo(header, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.16)
      }
      timeline
        .fromTo('.hero__eyebrow', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.25)
        .fromTo('.hero__line > span', { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.09 }, 0.36)
        .fromTo('.hero__support', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.58 }, 0.75)
        .fromTo('.hero__enquiry', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.9)

      const media = gsap.matchMedia()
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.hero__image', {
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
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
          height="1067"
          fetchPriority="high"
        />
      </div>
      <div className="hero__shade" />
      <div className="hero__content container">
        <div className="hero__body">
          <p className="eyebrow hero__eyebrow">Architectural lighting consultancy</p>
          <h1 id="hero-title" className="display-title hero__title">
            <span className="hero__line"><span>Anjora: Where</span></span>
            <span className="hero__line"><span>Light Shapes</span></span>
            <span className="hero__line"><span>Space</span></span>
          </h1>
          <p className="hero__support">
            We plan, specify and deliver light for architecture—working with designers and project teams from first concept through commissioning.
          </p>
          <a
            className="hero__enquiry"
            href="#enquiry"
          >
            <span>Enquiry</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
