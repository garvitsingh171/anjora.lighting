import { useEffect, useRef, useState, type FocusEvent, type RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, EASE_UI, prefersReducedMotion } from '../../lib/motion'
import './ProjectsMegaMenu.css'

export interface MegaMenuEntry {
  label: string
  category: string
  href: string
  count: number
  image: { src: string; alt: string; width: number; height: number; objectPosition?: string }
  title: string
  caption: string
}
export interface MegaMenuProps {
  open: boolean
  menuRef: RefObject<HTMLDivElement | null>
  onEnter: () => void
  onLeave: () => void
  onBlur: (event: FocusEvent) => void
  onClose: () => void
}
interface Props extends MegaMenuProps {
  kind: 'projects' | 'products'
  heading: string
  entries: MegaMenuEntry[]
  nextLink: string
  note: string
}

/** Both navigation disclosures share animation, preview and keyboard behaviour. */
export function CatalogueMegaMenu({ open, menuRef, onEnter, onLeave, onBlur, onClose, kind, heading, entries, nextLink, note }: Props) {
  const [preview, setPreview] = useState(entries[0]!.category)
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
      .fromTo(root, { autoAlpha: 0, y: -12, clipPath: 'inset(0 0 12% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration, ease: EASE_REVEAL })
      .fromTo('[data-menu-label]', { opacity: 0.5, y: 8 }, { opacity: 1, y: 0, duration: duration * 0.7, stagger: duration ? 0.03 : 0 }, 0)
      .fromTo('.projects-mega__preview', { scale: 1.025 }, { scale: 1, duration: duration ? 0.65 : 0, ease: EASE_REVEAL }, 0)
  }, { scope: menuRef, dependencies: [open], revertOnUpdate: true })

  const { contextSafe } = useGSAP({ scope: menuRef })
  useEffect(() => {
    if (!open) return
    const root = menuRef.current
    const target = Array.from(root?.querySelectorAll<HTMLElement>('[data-preview]') ?? []).find(element => element.dataset.preview === preview)
    const image = target?.querySelector('img')
    if (!root || !target || !image) return
    let transition: gsap.core.Timeline | undefined
    const reveal = contextSafe(() => {
      if (!image.naturalWidth) return
      const duration = prefersReducedMotion() ? 0 : 0.3
      transition = gsap.timeline()
        .to(root.querySelectorAll('[data-preview]'), { opacity: 0, duration, overwrite: true }, 0)
        .to(target, { opacity: 1, duration, overwrite: true, ease: EASE_UI }, 0)
        .fromTo(target.querySelector('figcaption'), { y: 6 }, { y: 0, duration, ease: EASE_UI }, 0)
        .fromTo(image, { scale: 1.02 }, { scale: 1, duration, ease: EASE_UI }, 0)
    })
    if (image.complete) reveal()
    else image.addEventListener('load', reveal, { once: true })
    return () => { image.removeEventListener('load', reveal); transition?.kill() }
  }, [preview, open, menuRef, contextSafe])

  return (
    <div ref={menuRef} id={`${kind}-mega-menu`} className={`projects-mega ${kind}-mega`} aria-hidden={!open} inert={!open}
      onMouseEnter={onEnter} onMouseLeave={onLeave} onBlur={onBlur}
      onKeyDown={event => {
        if (event.key !== 'Tab') return
        const controls = menuRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
        if (!controls) return
        if (event.shiftKey && event.target === controls[0]) {
          event.preventDefault()
          document.querySelector<HTMLButtonElement>(`[aria-controls="${kind}-mega-menu"]`)?.focus()
        } else if (!event.shiftKey && event.target === controls[controls.length - 1]) {
          event.preventDefault()
          document.querySelector<HTMLAnchorElement>(`.desktop-nav a[href="${nextLink}"]`)?.focus()
        }
      }}>
      <div className="projects-mega__preview" aria-hidden="true">
        {entries.map((entry, index) => <figure key={entry.category} data-preview={entry.category} style={{ opacity: index === 0 ? 1 : 0 }}>
          <img src={entry.image.src} alt={entry.image.alt} loading="lazy" width={entry.image.width} height={entry.image.height} style={{ objectPosition: entry.image.objectPosition }} />
          <figcaption><span>{kind === 'products' ? 'Rajasthan Collection' : 'From our archive'}</span><strong>{entry.title}</strong><span>{entry.caption}</span></figcaption>
        </figure>)}
      </div>
      <div className="projects-mega__explore">
        <div className="projects-mega__heading"><p className="eyebrow" data-menu-label>{heading}</p><button type="button" onClick={onClose} aria-label={`Close ${kind} menu`}>×</button></div>
        <nav aria-label={kind === 'products' ? 'Product discovery' : 'Project categories'}>
          {entries.map(entry => <Link key={entry.category} to={entry.href} data-menu-label data-category={entry.category}
            onMouseEnter={() => setPreview(entry.category)} onFocus={() => setPreview(entry.category)}>
            <span>{entry.label}<sup>{String(entry.count).padStart(2, '0')}</sup></span><span aria-hidden="true">↗</span>
          </Link>)}
        </nav>
        <p className="projects-mega__note">{note}</p>
      </div>
    </div>
  )
}
