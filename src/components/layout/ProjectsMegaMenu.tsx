import { useEffect, useRef, useState, type FocusEvent, type RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import { projectCategories, projectCategoryPath, projects, type ProjectCategory } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, EASE_UI, prefersReducedMotion } from '../../lib/motion'
import './ProjectsMegaMenu.css'

type Category = 'All' | ProjectCategory
const categories: Category[] = ['All', ...projectCategories]
const previews = categories.map(category => {
  const matching = category === 'All' ? projects : projects.filter(project => project.category === category)
  return { category, count: matching.length, project: matching.find(project => project.cover.orientation === 'landscape') ?? matching[0]! }
})

interface Props {
  open: boolean
  menuRef: RefObject<HTMLDivElement | null>
  onEnter: () => void
  onLeave: () => void
  onBlur: (event: FocusEvent) => void
  onClose: () => void
}

export function ProjectsMegaMenu({ open, menuRef, onEnter, onLeave, onBlur, onClose }: Props) {
  const [preview, setPreview] = useState<Category>('All')
  const firstOpen = useRef(true)

  useGSAP(() => {
    const root = menuRef.current
    if (!root) return
    if (!open) {
      if (!firstOpen.current) gsap.to(root, { autoAlpha: 0, y: -8, duration: prefersReducedMotion() ? 0 : 0.18, ease: EASE_UI })
      return
    }
    firstOpen.current = false
    const duration = prefersReducedMotion() ? 0 : 0.4
    gsap.timeline()
      .fromTo(root, { autoAlpha: 0, y: -12, clipPath: 'inset(0 0 12% 0)' }, {
        autoAlpha: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration, ease: EASE_REVEAL,
      })
      .fromTo('[data-menu-label]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: duration * 0.7, stagger: duration ? 0.03 : 0 }, 0.06)
      .fromTo('.projects-mega__preview', { scale: 1.025 }, { scale: 1, duration: duration ? 0.65 : 0, ease: EASE_REVEAL }, 0)
  }, { scope: menuRef, dependencies: [open], revertOnUpdate: true })

  const { contextSafe } = useGSAP({ scope: menuRef })
  useEffect(() => {
    if (!open) return
    const root = menuRef.current
    const target = root?.querySelector<HTMLElement>(`[data-preview="${preview}"]`)
    const image = target?.querySelector('img')
    if (!root || !target || !image) return
    let transition: gsap.core.Timeline | undefined
    // Preserve the previous photograph until the next one has loaded. Interrupted
    // crossfades keep their current values; late loads cannot replace a newer choice.
    const reveal = contextSafe(() => {
      if (!image.naturalWidth) return
      const duration = prefersReducedMotion() ? 0 : 0.35
      transition = gsap.timeline()
        .to(root.querySelectorAll('[data-preview]'), { opacity: 0, duration, overwrite: true }, 0)
        .to(target, { opacity: 1, duration, overwrite: true, ease: EASE_UI }, 0)
    })
    if (image.complete) reveal()
    else image.addEventListener('load', reveal, { once: true })
    return () => {
      image.removeEventListener('load', reveal)
      transition?.kill()
    }
  }, [preview, open, menuRef, contextSafe])

  return (
    <div ref={menuRef} id="projects-mega-menu" className="projects-mega" aria-hidden={!open} inert={!open}
      onMouseEnter={onEnter} onMouseLeave={onLeave} onBlur={onBlur}
      onKeyDown={event => {
        if (event.key !== 'Tab') return
        const controls = menuRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
        if (!controls) return
        if (event.shiftKey && event.target === controls[0]) {
          event.preventDefault()
          document.querySelector<HTMLButtonElement>('[aria-controls="projects-mega-menu"]')?.focus()
        } else if (!event.shiftKey && event.target === controls[controls.length - 1]) {
          event.preventDefault()
          document.querySelector<HTMLAnchorElement>('.desktop-nav a[href="/products"]')?.focus()
        }
      }}>
      <div className="projects-mega__preview" aria-hidden="true">
        {previews.map(({ category, project }, index) => (
          <figure key={category} data-preview={category} style={{ opacity: index === 0 ? 1 : 0 }}>
            <img src={project.cover.src} alt={project.cover.alt} loading="lazy" onError={event => { event.currentTarget.style.visibility = 'hidden' }} width={project.cover.width} height={project.cover.height} style={{ objectPosition: project.cover.objectPosition }} />
            <figcaption><span>From our archive</span><strong>{project.title}</strong><span>{project.category}{project.location ? ` · ${project.location}` : ''}</span></figcaption>
          </figure>
        ))}
      </div>
      <div className="projects-mega__explore">
        <div className="projects-mega__heading">
          <p className="eyebrow" data-menu-label>Browse our projects</p>
          <button type="button" onClick={onClose} aria-label="Close projects menu">×</button>
        </div>
        <nav aria-label="Project categories">
          {previews.map(({ category, count }) => (
            <Link key={category} to={projectCategoryPath(category)} data-menu-label data-category={category}
              onMouseEnter={() => setPreview(category)} onFocus={() => setPreview(category)}>
              <span>{category === 'All' ? 'All Projects' : category}<sup>{String(count).padStart(2, '0')}</sup></span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <p className="projects-mega__note">Spaces shaped by light. Discover the individual stories.</p>
      </div>
    </div>
  )
}
