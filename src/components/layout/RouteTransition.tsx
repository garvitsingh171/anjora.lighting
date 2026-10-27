import { useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { EASE_UI, prefersReducedMotion } from '../../lib/motion'
import './RouteTransition.css'

export function RouteTransition({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useGSAP(() => {
    if (prefersReducedMotion()) return
    // Decorative feedback only. React Router owns navigation; main is always visible.
    // Reverting an interrupted transition cannot strand a page or swallow a click.
    gsap.timeline()
      .fromTo(panelRef.current, { autoAlpha: 1, scaleX: 0 }, {
        autoAlpha: 1, scaleX: 1, duration: 0.3, ease: EASE_UI,
      })
      .to(panelRef.current, { autoAlpha: 0, duration: 0.12 })
  }, { scope: panelRef, dependencies: [pathname], revertOnUpdate: true })

  return <>{children}<div className="route-transition" ref={panelRef} aria-hidden="true" /></>
}
