import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import anjoraLogo from '../../assets/branding/anjora-logo.png'
import { ThemeToggle } from './ThemeToggle'
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
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const { pathname } = useLocation()
  const isProjectRoute = pathname === '/projects' || pathname.startsWith('/projects/')
  const isProjectDetail = pathname.startsWith('/projects/')
  const isBlogRoute = pathname === '/blog' || pathname.startsWith('/blog/')
  const isAboutRoute = pathname === '/about-us'
  const isHeroContext = pathname === '/' || isProjectDetail

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

  useEffect(() => {
    let frame = 0
    const updateScrollState = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48)
        const hero = document.querySelector<HTMLElement>(pathname === '/' ? '.hero-section' : '.project-detail__hero')
        const logo = document.querySelector<HTMLElement>('.brand-logo')
        setPastHero(Boolean(isHeroContext && hero && logo && hero.getBoundingClientRect().bottom <= logo.getBoundingClientRect().bottom))
      })
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [isHeroContext, pathname])

  return (
    <header
      className={`site-header${pathname === '/' ? '' : ' site-header--inner'}${isProjectRoute ? ' site-header--projects' : ''}${isBlogRoute ? ' site-header--blog' : ''}${isAboutRoute ? ' site-header--about' : ''}${isHeroContext ? ' site-header--hero-context' : ''}${scrolled ? ' site-header--scrolled' : ''}${pastHero ? ' site-header--past-hero' : ''}`}
      data-hero-ui
    >
      <Link className="brand-logo" to="/" aria-label="Anjora Lighting home">
        <img src={anjoraLogo} alt="Anjora Lighting" width="1600" height="570" />
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
        ))}
        <span className="desktop-nav__divider" aria-hidden="true" />
        <ThemeToggle className="theme-toggle--desktop" />
      </nav>

      <div className="mobile-header-controls">
        <ThemeToggle className="theme-toggle--mobile" />
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
      </div>

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
        <Link
          className="mobile-menu__enquiry"
          to="/#enquiry"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          Start a project <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  )
}
