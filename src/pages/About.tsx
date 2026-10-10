import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import founderImage from '../assets/about/shubham-khandelwal.png'
import { AboutClosing } from '../components/about/AboutClosing'
import { AboutHero } from '../components/about/AboutHero'
import { CompanyStory } from '../components/about/CompanyStory'
import { FounderSection } from '../components/about/FounderSection'
import { LightingPhilosophy } from '../components/about/LightingPhilosophy'
import { Principles } from '../components/about/Principles'
import { EnquirySection } from '../components/home/EnquirySection'
import { gsap } from '../lib/gsap'
import { usePageMeta } from '../lib/page-meta'
import './About.css'

const aboutStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': 'https://anjora.lighting/#organization',
      name: 'Anjora Lighting',
      url: 'https://anjora.lighting/',
      description: 'Independent architectural lighting design consultancy headquartered in Jaipur, India.',
      email: 'info@anjora.lighting',
      telephone: '+91 9929571272',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'B 15, Parivahan Marg, C Scheme',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        postalCode: '302001',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://anjora.lighting/about-us/#shubham-khandelwal',
      name: 'Shubham Khandelwal',
      jobTitle: 'Director',
      worksFor: { '@id': 'https://anjora.lighting/#organization' },
    },
  ],
}

export function About() {
  const rootRef = useRef<HTMLElement>(null)

  usePageMeta({
    title: 'About Anjora Lighting | Lighting Consultancy Jaipur',
    description: 'Meet Anjora Lighting, an independent architectural lighting design consultancy in Jaipur, and director Shubham Khandelwal.',
    canonical: 'https://anjora.lighting/about-us',
    image: new URL(founderImage, 'https://anjora.lighting').href,
    ogType: 'website',
    structuredData: aboutStructuredData,
  })

  useGSAP(
    () => {
      if (!rootRef.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-about-hero-item]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12 })
        .fromTo('[data-about-hero-line]', { yPercent: 112 }, { yPercent: 0, duration: 0.95, stagger: 0.11 }, 0.15)
        .fromTo('[data-about-hero-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.85 }, 0.72)

      gsap.utils.toArray<HTMLElement>('[data-story-reveal]').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 20 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })

      gsap.fromTo('[data-philosophy-word]', { autoAlpha: 0.2, x: 18 }, {
        autoAlpha: 1,
        x: 0,
        stagger: 0.16,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-philosophy__elements',
          start: 'top 78%',
          end: 'bottom 66%',
          scrub: 0.6,
        },
      })

      gsap.timeline({
        scrollTrigger: { trigger: '[data-about-image-reveal]', start: 'top 88%', once: true },
      })
        .fromTo('[data-about-image-reveal]', { clipPath: 'inset(100% 0 0 0)' }, {
          clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.inOut',
        })
        .fromTo('[data-about-image-reveal] img', { scale: 1.06 }, {
          scale: 1, duration: 1.25, ease: 'power3.out',
        }, 0)

      gsap.timeline({
        scrollTrigger: { trigger: '.about-founder', start: 'top 78%', once: true },
      })
        .fromTo('[data-founder-portrait]', { clipPath: 'inset(100% 0 0 0)' }, {
          clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.inOut',
        })
        .fromTo('[data-founder-portrait] img', { scale: 1.06 }, {
          scale: 1, duration: 1.2, ease: 'power3.out',
        }, 0)
        .fromTo('[data-founder-copy]', { autoAlpha: 0, y: 20 }, {
          autoAlpha: 1, y: 0, duration: 0.68, stagger: 0.14, ease: 'power3.out',
        }, 0.38)

      gsap.fromTo('[data-journey-item]', { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.about-education', start: 'top 86%', once: true },
      })

      gsap.fromTo('[data-career-line]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-career__timeline',
          start: 'top 80%',
          end: 'bottom 70%',
          scrub: 0.5,
        },
      })

      gsap.fromTo('[data-career-item]', { autoAlpha: 0, x: 14 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.65,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-career__timeline', start: 'top 82%', once: true },
      })

      gsap.fromTo('[data-principle]', { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.68,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-principles ol', start: 'top 84%', once: true },
      })

      gsap.timeline({
        scrollTrigger: { trigger: '.about-closing', start: 'top 74%', once: true },
      })
        .fromTo('[data-closing-copy]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('[data-closing-line]', { yPercent: 110 }, { yPercent: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' }, 0.1)
        .fromTo('[data-closing-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 0.55)

      if (window.matchMedia('(min-width: 900px)').matches) {
        gsap.fromTo('[data-about-image-reveal] img', { yPercent: -3 }, {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-about-image-reveal]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    },
    { scope: rootRef },
  )

  return (
    <main ref={rootRef} id="main-content" className="about-page">
      <AboutHero />
      <CompanyStory />
      <LightingPhilosophy />
      <FounderSection />
      <Principles />
      <AboutClosing />
      <EnquirySection source="About Us" />
    </main>
  )
}
