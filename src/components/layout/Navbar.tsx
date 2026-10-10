import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import anjoraLogo from '../../assets/branding/anjora-logo.png'
import './Navbar.css'

const navItems = [
  { label: 'Projects', to: '/projects' },
  { label: 'Products', to: '/products' },
  { label: 'Research', to: '/research' },
  { label: 'Blog', to: '/blog' },
  { label: 'About Us', to: '/about-us' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isProjectRoute = pathname === '/projects' || pathname.startsWith('/projects/')
  const isBlogRoute = pathname === '/blog' || pathname.startsWith('/blog/')
  const isAboutRoute = pathname === '/about-us'

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header
      className={`site-header${pathname === '/' ? '' : ' site-header--inner'}${isProjectRoute ? ' site-header--projects' : ''}${isBlogRoute ? ' site-header--blog' : ''}${isAboutRoute ? ' site-header--about' : ''}`}
      data-hero-ui
    >
      <Link className="brand-logo" to="/" aria-label="Anjora Lighting home">
        <img src={anjoraLogo} alt="Anjora Lighting" width="1600" height="570" />
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
        ))}
      </nav>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
      </button>

      <div
        className="mobile-menu"
        id="mobile-navigation"
        data-open={open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <span>0{index + 1}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <a
          className="mobile-menu__enquiry"
          href="mailto:info@anjora.lighting?subject=Project%20Enquiry%20-%20Anjora%20Lighting"
          tabIndex={open ? 0 : -1}
        >
          Start a project <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  )
}
