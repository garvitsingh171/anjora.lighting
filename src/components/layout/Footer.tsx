import { Link } from 'react-router-dom'
import anjoraLogo from '../../assets/branding/anjora-logo.png'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main container">
        <div className="site-footer__brand">
          <Link className="site-footer__logo" to="/" aria-label="Anjora Lighting home">
            <img src={anjoraLogo} alt="Anjora Lighting" width="1600" height="570" />
          </Link>
          <p>Lighting isn’t just illumination—it’s experience.</p>
        </div>

        <address>
          <p>Experience Centre</p>
          <span>B 15, Parivahan Marg, C Scheme<br />Jaipur, Rajasthan 302001</span>
          <a href="tel:+919929571272">+91 99295 71272</a>
          <a href="mailto:info@anjora.lighting">info@anjora.lighting</a>
        </address>

        <nav aria-label="Footer navigation">
          <Link to="/projects">Projects</Link>
          <Link to="/products">Products</Link>
          <Link to="/research">Research</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about-us">About Us</Link>
        </nav>
      </div>

      <div className="site-footer__legal container">
        <span>© {new Date().getFullYear()} Anjora Lighting</span>
        <span>Architectural lighting consultancy · Jaipur, India</span>
      </div>
    </footer>
  )
}
