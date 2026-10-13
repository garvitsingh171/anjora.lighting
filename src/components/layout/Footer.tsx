import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import anjoraLogo from '../../assets/branding/anjora-logo.png'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, MOTION_BASE, prefersReducedMotion } from '../../lib/motion'
import './Footer.css'

export function Footer() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('[data-footer-reveal]', { autoAlpha: 0, y: 16 }, {
      autoAlpha: 1,
      y: 0,
      duration: MOTION_BASE,
      stagger: 0.09,
      ease: EASE_REVEAL,
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 92%',
        once: true,
        fastScrollEnd: true,
      },
    })
  }, { scope: rootRef })

  return (
    <footer ref={rootRef} className="site-footer">
      <div className="site-footer__main container">
        <div className="site-footer__brand" data-footer-reveal>
          <Link className="site-footer__logo" to="/" aria-label="Anjora Lighting home">
            <img src={anjoraLogo} alt="Anjora Lighting" width="1600" height="570" />
          </Link>
          <p>Lighting isn’t just illumination—it’s experience.</p>
        </div>

        <address data-footer-reveal>
          <p>Experience Centre</p>
          <span>B 15, Parivahan Marg, C Scheme<br />Jaipur, Rajasthan 302001</span>
          <a href="tel:+919929571272">+91 99295 71272</a>
          <a href="mailto:info@anjora.lighting">info@anjora.lighting</a>
        </address>

        <nav aria-label="Footer navigation" data-footer-reveal>
          <Link to="/projects">Projects</Link>
          <Link to="/products">Products</Link>
          <Link to="/research">Research</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about-us">About Us</Link>
        </nav>
      </div>

      <div className="site-footer__legal container" data-footer-reveal>
        <span>© {new Date().getFullYear()} Anjora Lighting</span>
        <span>Architectural lighting consultancy · Jaipur, India</span>
      </div>
    </footer>
  )
}
