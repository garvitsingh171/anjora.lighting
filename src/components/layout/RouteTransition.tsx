import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { EASE_IN_OUT, EASE_REVEAL, EASE_UI, prefersReducedMotion } from '../../lib/motion'
import './RouteTransition.css'

export function RouteTransition({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const transitionPendingRef = useRef(false)
  const previousLocationKeyRef = useRef<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleInternalNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) return

      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target || anchor.hasAttribute('download') || anchor.dataset.noTransition !== undefined) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin) return

      const currentPath = `${window.location.pathname}${window.location.search}`
      const destinationPath = `${destination.pathname}${destination.search}`
      if (destinationPath === currentPath && destination.hash) return
      if (destinationPath === currentPath && destination.hash === window.location.hash) return

      event.preventDefault()
      if (transitionPendingRef.current) return

      const to = `${destination.pathname}${destination.search}${destination.hash}`
      if (prefersReducedMotion()) {
        navigate(to)
        return
      }

      const panel = panelRef.current
      const line = lineRef.current
      if (!panel || !line) {
        navigate(to)
        return
      }

      transitionPendingRef.current = true
      timelineRef.current?.kill()
      const currentMain = document.querySelector('main')

      gsap.set(panel, { autoAlpha: 1, yPercent: 100 })
      gsap.set(line, { scaleX: 0 })
      timelineRef.current = gsap.timeline()
        .to(currentMain, { autoAlpha: 0.72, y: -8, duration: 0.12, ease: EASE_UI }, 0)
        .to(panel, { yPercent: 0, duration: 0.16, ease: EASE_IN_OUT }, 0)
        .to(line, { scaleX: 1, duration: 0.13, ease: EASE_UI }, 0.02)
        .call(() => navigate(to))
    }

    document.addEventListener('click', handleInternalNavigation, true)
    return () => document.removeEventListener('click', handleInternalNavigation, true)
  }, [navigate])

  useLayoutEffect(() => {
    if (previousLocationKeyRef.current === null) {
      previousLocationKeyRef.current = location.key
      return
    }

    previousLocationKeyRef.current = location.key
    if (!transitionPendingRef.current) return

    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current
      const line = lineRef.current
      const nextMain = document.querySelector('main')
      if (!panel || !line) {
        transitionPendingRef.current = false
        return
      }

      gsap.set(nextMain, { autoAlpha: 0, y: 12 })
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { autoAlpha: 0, yPercent: 100 })
          gsap.set(line, { scaleX: 0 })
          transitionPendingRef.current = false
          ScrollTrigger.refresh()
        },
      })
        .to(panel, { yPercent: -100, duration: 0.16, ease: EASE_IN_OUT }, 0.01)
        .to(nextMain, { autoAlpha: 1, y: 0, duration: 0.2, ease: EASE_REVEAL }, 0.03)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location.key])

  useEffect(() => () => {
    timelineRef.current?.kill()
  }, [])

  return (
    <>
      {children}
      <div className="route-transition" ref={panelRef} aria-hidden="true">
        <span className="route-transition__label">Anjora Lighting</span>
        <span className="route-transition__line" ref={lineRef} />
      </div>
    </>
  )
}
