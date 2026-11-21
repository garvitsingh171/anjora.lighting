import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, prefersReducedMotion } from '../../lib/motion'
import anjoraLogo from '../../assets/branding/anjora-logo.png'
import { projectCategories, projectCategoryPath, projects } from '../../data/projects'
import { productCategories, productCategoryPath } from '../../data/products'
import { ProjectsMegaMenu } from './ProjectsMegaMenu'
import { ProductsMegaMenu } from './ProductsMegaMenu'
import { ThemeToggle } from './ThemeToggle'
import './Navbar.css'

const navItems = [{ label: 'Consultancy', to: '/consultancy' }, { label: 'Research', to: '/research' }, { label: 'Blog', to: '/blog' }, { label: 'About Us', to: '/about-us' }]
type Menu = 'projects' | 'products'
const menuKinds: Menu[] = ['projects', 'products']

export function Navbar() {
  const location = useLocation()
  return <NavbarContent key={location.key} />
}

function NavbarContent() {
  const headerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null)
  const [mobileSection, setMobileSection] = useState<Menu | null>(null)
  const projectsTrigger = useRef<HTMLDivElement>(null)
  const productsTrigger = useRef<HTMLDivElement>(null)
  const projectsMenu = useRef<HTMLDivElement>(null)
  const productsMenu = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef(0)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [overFooter, setOverFooter] = useState(false)
  const { pathname } = useLocation()
  const detail = projects.find(project => pathname === `/projects/${project.slug}`)
  const isHeroContext = pathname === '/' || pathname === '/consultancy' || (pathname.startsWith('/projects/') && detail?.cover.orientation !== 'portrait')
  const triggerFor = (kind: Menu) => kind === 'projects' ? projectsTrigger : productsTrigger
  const menuFor = (kind: Menu) => kind === 'projects' ? projectsMenu : productsMenu
  const cancelClose = () => window.clearTimeout(closeTimer.current)
  const openMenu = (kind: Menu) => { cancelClose(); setActiveMenu(kind) }
  const closeMenu = (kind: Menu, restoreFocus = false) => {
    cancelClose()
    setActiveMenu(current => current === kind ? null : current)
    if (restoreFocus) triggerFor(kind).current?.querySelector<HTMLButtonElement>('button')?.focus()
  }
  const scheduleClose = (kind: Menu) => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => {
      if (menuFor(kind).current?.contains(document.activeElement) || triggerFor(kind).current?.contains(document.activeElement)) return
      setActiveMenu(current => current === kind ? null : current)
    }, 220)
  }
  const handleBlur = (kind: Menu, event: FocusEvent) => {
    const next = event.relatedTarget as Node | null
    if (!triggerFor(kind).current?.contains(next) && !menuFor(kind).current?.contains(next)) closeMenu(kind)
  }
  useGSAP(() => {
    if (!open || prefersReducedMotion()) return
    gsap.fromTo('.mobile-menu__enquiry, nav > a, .mobile-projects-toggle', { opacity: 0.5, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.025, ease: EASE_REVEAL })
  }, { scope: mobileMenuRef, dependencies: [open], revertOnUpdate: true })
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const measure = () => document.documentElement.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      window.clearTimeout(closeTimer.current)
      if (activeMenu) {
        setActiveMenu(null)
        const trigger = activeMenu === 'projects' ? projectsTrigger : productsTrigger
        trigger.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
      if (open) { setOpen(false); mobileToggleRef.current?.focus() }
    }
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (![projectsMenu, productsMenu, projectsTrigger, productsTrigger].some(ref => ref.current?.contains(target))) {
        window.clearTimeout(closeTimer.current)
        setActiveMenu(null)
      }
    }
    const closeOnResize = () => { setOpen(false); setActiveMenu(null) }
    window.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    const breakpoint = window.matchMedia('(min-width: 1041px)')
    breakpoint.addEventListener('change', closeOnResize)
    return () => {
      window.clearTimeout(closeTimer.current)
      window.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
      breakpoint.removeEventListener('change', closeOnResize)
    }
  }, [activeMenu, open])
  useEffect(() => {
    let frame = 0
    const updateScrollState = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48)
        const hero = document.querySelector<HTMLElement>((pathname === '/' || pathname === '/consultancy') ? '.hero-section' : '.project-detail__hero')
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
    <header ref={headerRef} className={`site-header${activeMenu ? ' site-header--menu-open' : ''}${pathname === '/' ? '' : ' site-header--inner'}${isHeroContext ? ' site-header--hero-context' : ''}${scrolled ? ' site-header--scrolled' : ''}${pastHero ? ' site-header--past-hero' : ''}${overFooter ? ' site-header--footer-context' : ''}`} data-hero-ui>
      <Link className="brand-logo" to="/" aria-label="Anjora Lighting home"><img src={anjoraLogo} alt="Anjora Lighting" width="1600" height="570" /></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {menuKinds.map(kind => <div key={kind} ref={triggerFor(kind)} className={`mega-nav-trigger ${kind}-nav-trigger`} data-menu-open={activeMenu === kind}
          onMouseEnter={() => openMenu(kind)} onMouseLeave={() => scheduleClose(kind)} onBlur={event => handleBlur(kind, event)}
          onKeyDown={event => {
            if ((event.key === 'Tab' && !event.shiftKey && event.target instanceof HTMLButtonElement && activeMenu === kind) || event.key === 'ArrowDown') {
              event.preventDefault(); openMenu(kind)
              const selector = event.key === 'ArrowDown' ? 'a' : 'button'
              requestAnimationFrame(() => menuFor(kind).current?.querySelector<HTMLElement>(selector)?.focus())
            }
          }}>
          <NavLink to={`/${kind}`} onFocus={() => openMenu(kind)}>{kind === 'projects' ? 'Projects' : 'Products'}</NavLink>
          <button type="button" aria-label={`Browse ${kind === 'projects' ? 'project categories' : 'product collection'}`} aria-expanded={activeMenu === kind} aria-controls={`${kind}-mega-menu`}
            onClick={() => activeMenu === kind ? closeMenu(kind) : openMenu(kind)}>⌄</button>
        </div>)}
        {navItems.map(item => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}
        <span className="desktop-nav__divider" aria-hidden="true" /><ThemeToggle className="theme-toggle--desktop" />
      </nav>
      <ProjectsMegaMenu open={activeMenu === 'projects'} menuRef={projectsMenu} onEnter={cancelClose} onLeave={() => scheduleClose('projects')} onBlur={event => handleBlur('projects', event)} onClose={() => closeMenu('projects', true)} />
      <ProductsMegaMenu open={activeMenu === 'products'} menuRef={productsMenu} onEnter={cancelClose} onLeave={() => scheduleClose('products')} onBlur={event => handleBlur('products', event)} onClose={() => closeMenu('products', true)} />
      <div className="mobile-header-controls">
        <ThemeToggle className="theme-toggle--mobile" />
        <button ref={mobileToggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(current => !current)}><span /><span /></button>
      </div>
      <div ref={mobileMenuRef} className="mobile-menu" id="mobile-navigation" data-open={open} aria-hidden={!open} inert={!open}
        onBlur={event => { if (event.relatedTarget instanceof Element && !event.relatedTarget.closest('.mobile-menu, .mobile-header-controls')) setOpen(false) }}>
        <nav aria-label="Mobile navigation">
          {menuKinds.map((kind, index) => <div key={kind}>
            <button className="mobile-projects-toggle" type="button" aria-expanded={mobileSection === kind} aria-controls={`mobile-${kind === 'projects' ? 'project' : 'product'}-categories`} onClick={() => setMobileSection(current => current === kind ? null : kind)}><span aria-hidden="true">0{index + 1}</span>{kind === 'projects' ? 'Projects' : 'Products'}<b aria-hidden="true">{mobileSection === kind ? '−' : '+'}</b></button>
            <div id={`mobile-${kind === 'projects' ? 'project' : 'product'}-categories`} className="mobile-project-categories" hidden={mobileSection !== kind}>
              {kind === 'projects' ? (['All', ...projectCategories] as const).map(category => <Link key={category} to={projectCategoryPath(category)}>{category === 'All' ? 'All Projects' : category}</Link>) : ['All', ...productCategories].map(category => <Link key={category} to={productCategoryPath(category)}>{category === 'All' ? 'All Products' : category}</Link>)}
            </div>
          </div>)}
          {navItems.map((item, index) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}><span aria-hidden="true">0{index + 3}</span>{item.label}</NavLink>)}
        </nav>
        <Link className="mobile-menu__enquiry" to="/#enquiry" onClick={() => setOpen(false)}>Start a project <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  )
}
