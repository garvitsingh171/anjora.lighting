import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import anjoraLogo from '../../assets/branding/anjora-logo.png'
import { teamContacts } from '../../data/contacts'
import { services } from '../../data/services'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, prefersReducedMotion } from '../../lib/motion'
import './Footer.css'

export function Footer() {
  const rootRef = useRef<HTMLElement>(null)
  const revealRef = useRef<gsap.core.Timeline | null>(null)
  useGSAP(() => {
    if (prefersReducedMotion()) return
    // Contact information is never hidden, even before the reveal or after a jump.
    revealRef.current = gsap.timeline({
      scrollTrigger: { trigger: rootRef.current, start: 'top 96%', once: true, fastScrollEnd: true,
        onLeave: self => self.animation?.progress(1) },
    })
      .fromTo('.site-footer__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: EASE_REVEAL })
      .fromTo('[data-footer-reveal]', { opacity: 0.7, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: EASE_REVEAL }, 0)
  }, { scope: rootRef })

  return (
    <footer ref={rootRef} className="site-footer" onFocusCapture={() => revealRef.current?.progress(1)}>
      <div className="container">
        <div className="site-footer__invitation" data-footer-reveal>
          <p>Lighting isn’t just illumination.<br /><span>It’s experience.</span></p>
          <Link className="site-footer__cta" to="/#enquiry">Start a project <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="site-footer__rule" aria-hidden="true" />
        <div className="site-footer__main">
          <div className="site-footer__brand" data-footer-reveal>
            <Link className="site-footer__logo" to="/" aria-label="Anjora Lighting home">
              <img src={anjoraLogo} alt="Anjora Lighting" width="1600" height="570" />
            </Link>
            <p>Independent architectural<br />lighting consultancy.</p>
            <span>Jaipur, India</span>
          </div>
          <nav aria-label="Footer navigation" data-footer-reveal>
            <h2>Explore</h2>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/products">Products</Link>
            <Link to="/research">Research & insights</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/about-us">About Us</Link>
          </nav>
          <nav aria-label="Our expertise" data-footer-reveal>
            <h2>Expertise</h2>
            {services.map(service => <Link key={service.id} to="/#services">{service.title}</Link>)}
          </nav>
          <address data-footer-reveal>
            <h2>Visit & connect</h2>
            <strong>Experience Centre</strong>
            <span>B 15, Parivahan Marg, C Scheme<br />Jaipur, Rajasthan 302001</span>
            <a href="tel:+919929571272">+91 99295 71272</a>
            <a href="tel:+917792834789">+91 77928 34789</a>
            <a href="mailto:info@anjora.lighting">info@anjora.lighting</a>
          </address>
        </div>
        <section className="site-footer__team" aria-labelledby="footer-team-title">
          <div data-footer-reveal><h2 id="footer-team-title">Talk to our team</h2><p>A direct conversation,<br />from the first idea.</p></div>
          {teamContacts.map(contact => (
            <address key={contact.email} className="site-footer__person" data-footer-reveal>
              <h3>{contact.name}</h3>
              <p>{contact.role}</p>
              <a href={`tel:${contact.telephone}`}>{contact.phone}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </address>
          ))}
        </section>
        <div className="site-footer__legal" data-footer-reveal>
          <span>© {new Date().getFullYear()} Anjora Lighting</span>
          <span>Architectural lighting consultancy · Jaipur, India</span>
          <a href="#main-content">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
