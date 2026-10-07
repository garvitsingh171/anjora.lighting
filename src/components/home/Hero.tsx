import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import heroImage from '../../assets/images/hero-exterior.jpg'
import { gsap } from '../../lib/gsap'
import './Hero.css'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const header = document.querySelector('.site-header')
      timeline
        .fromTo('.hero__image', { scale: 1.07 }, { scale: 1, duration: 1.9 })
      if (header) {
        timeline.fromTo(header, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.2)
      }
      timeline
        .fromTo('.hero__eyebrow', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.45)
        .fromTo('.hero__line > span', { yPercent: 112 }, { yPercent: 0, duration: 1, stagger: 0.12 }, 0.55)
        .fromTo('.hero__footer', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.2)
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
