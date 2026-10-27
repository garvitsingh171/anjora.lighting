import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, prefersReducedMotion } from '../../lib/motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import anjoraLogo from '../../assets/branding/anjora-logo.png'
import { projectCategories, projectCategoryPath, projects } from '../../data/projects'
import { ProjectsMegaMenu } from './ProjectsMegaMenu'
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
  const location = useLocation()
  // Any navigation (including history and filters) closes disclosures and releases scroll lock.
  return <NavbarContent key={location.key} />
}

function NavbarContent() {
  const [open, setOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef(0)
  const suppressFocus = useRef(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [overFooter, setOverFooter] = useState(false)
  const { pathname } = useLocation()
  const isProjectRoute = pathname === '/projects' || pathname.startsWith('/projects/')
  const isProjectDetail = pathname.startsWith('/projects/')
  const isBlogRoute = pathname === '/blog' || pathname.startsWith('/blog/')
  const isAboutRoute = pathname === '/about-us'
  const detail = projects.find(project => pathname === `/projects/${project.slug}`)
  const isHeroContext = pathname === '/' || (isProjectDetail && detail?.cover.orientation !== 'portrait')

  const cancelClose = () => window.clearTimeout(closeTimer.current)
  const openProjects = () => { cancelClose(); setProjectsOpen(true) }
  const closeProjects = (restoreFocus = false) => {
    cancelClose()
    setProjectsOpen(false)
    if (restoreFocus) {
      suppressFocus.current = true
      triggerRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      suppressFocus.current = false
    }
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => {
      if (menuRef.current?.contains(document.activeElement) || triggerRef.current?.contains(document.activeElement)) return
      setProjectsOpen(false)
    }, 180)
  }
  const handleMenuBlur = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null
    if (!triggerRef.current?.contains(next) && !menuRef.current?.contains(next)) closeProjects()
  }

  useGSAP(() => {
    if (!open || prefersReducedMotion()) return
    gsap.fromTo('.mobile-menu__enquiry, nav > a, .mobile-projects-toggle', { opacity: 0, y: 10 }, {
      opacity: 1, y: 0, duration: 0.3, stagger: 0.025, ease: EASE_REVEAL,
    })
  }, { scope: mobileMenuRef, dependencies: [open], revertOnUpdate: true })

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (projectsOpen) {
        setProjectsOpen(false)
        triggerRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
      if (open) { setOpen(false); mobileToggleRef.current?.focus() }
    }
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) setProjectsOpen(false)
    }
    const closeOnResize = () => { setOpen(false); setProjectsOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    const breakpoint = window.matchMedia('(min-width: 901px)')
    breakpoint.addEventListener('change', closeOnResize)
    return () => {
      window.clearTimeout(closeTimer.current)
      window.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
      breakpoint.removeEventListener('change', closeOnResize)
    }
  }, [projectsOpen, open])

  useEffect(() => {
    let frame = 0
    const updateScrollState = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48)
        const hero = document.querySelector<HTMLElement>(pathname === '/' ? '.hero-section' : '.project-detail__hero')
        const logo = document.querySelector<HTMLElement>('.brand-logo')
        const footer = document.querySelector<HTMLElement>('.site-footer')
        setOverFooter(Boolean(footer && logo && footer.getBoundingClientRect().top <= logo.getBoundingClientRect().bottom))
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
      className={`site-header${projectsOpen ? ' site-header--menu-open' : ''}${pathname === '/' ? '' : ' site-header--inner'}${isProjectRoute ? ' site-header--projects' : ''}${isBlogRoute ? ' site-header--blog' : ''}${isAboutRoute ? ' site-header--about' : ''}${isHeroContext ? ' site-header--hero-context' : ''}${scrolled ? ' site-header--scrolled' : ''}${pastHero ? ' site-header--past-hero' : ''}${overFooter ? ' site-header--footer-context' : ''}`}
      data-hero-ui
    >
      <Link className="brand-logo" to="/" aria-label="Anjora Lighting home">
        <img src={anjoraLogo} alt="Anjora Lighting" width="1600" height="570" />
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <div ref={triggerRef} className="projects-nav-trigger" onMouseEnter={openProjects} onMouseLeave={scheduleClose} onBlur={handleMenuBlur}
          onKeyDown={event => {
            if (event.key === 'Tab' && !event.shiftKey && event.target instanceof HTMLButtonElement && projectsOpen) {
              event.preventDefault()
              menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
            }
          }}>
          <NavLink to="/projects" onFocus={() => { if (!suppressFocus.current) openProjects() }}
            onKeyDown={event => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                openProjects()
                requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus())
              }
            }}>Projects</NavLink>
          <button type="button" aria-label="Browse project categories" aria-expanded={projectsOpen} aria-controls="projects-mega-menu"
            onClick={() => projectsOpen ? closeProjects() : openProjects()}>⌄</button>
        </div>
        {navItems.slice(1).map((item) => (
          <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
        ))}
        <span className="desktop-nav__divider" aria-hidden="true" />
        <ThemeToggle className="theme-toggle--desktop" />
      </nav>

      <ProjectsMegaMenu open={projectsOpen} menuRef={menuRef} onEnter={cancelClose} onLeave={scheduleClose}
        onBlur={handleMenuBlur} onClose={() => closeProjects(true)} />

      <div className="mobile-header-controls">
        <ThemeToggle className="theme-toggle--mobile" />
        <button
          ref={mobileToggleRef}
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
        ref={mobileMenuRef}
        className="mobile-menu"
        onBlur={event => {
          if (event.relatedTarget instanceof Element && !event.relatedTarget.closest('.mobile-menu, .mobile-header-controls')) setOpen(false)
        }}
        id="mobile-navigation"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile navigation">
          <button className="mobile-projects-toggle" type="button" aria-expanded={mobileProjectsOpen} aria-controls="mobile-project-categories"
            onClick={() => setMobileProjectsOpen(current => !current)}><span aria-hidden="true">01</span>Projects <b aria-hidden="true">{mobileProjectsOpen ? '−' : '+'}</b></button>
          <div id="mobile-project-categories" className="mobile-project-categories" hidden={!mobileProjectsOpen}>
            {(['All', ...projectCategories] as const).map(category => (
              <Link key={category} to={projectCategoryPath(category)}>{category === 'All' ? 'All Projects' : category}</Link>
            ))}
          </div>
          {navItems.slice(1).map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">0{index + 2}</span>
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
