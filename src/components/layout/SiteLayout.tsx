import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { ScrollTrigger } from '../../lib/gsap'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { RouteTransition } from './RouteTransition'

function RouteScrollManager() {
  const { pathname, search, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef(new Map<string, number>())
  const restoring = useRef(false)
  const settledPath = useRef<string | null>(null)

  useEffect(() => {
    const original = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = original }
  }, [])

  useEffect(() => {
    const remember = () => { if (!restoring.current) positions.current.set(key, window.scrollY) }
    window.addEventListener('scroll', remember, { passive: true })
    return () => window.removeEventListener('scroll', remember)
  }, [key])

  useLayoutEffect(() => {
    restoring.current = true
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    let disposed = false
    let timer = 0
    let frame = 0
    const restoreY = navigationType === 'POP' ? positions.current.get(key) : undefined
    const refresh = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (!disposed) ScrollTrigger.refresh()
      }, 100)
    }
    // Fonts and unreserved image geometry are meaningful measurement changes.
    void document.fonts.ready.then(() => {
      if (disposed) return
      ScrollTrigger.refresh()
      if (hash) {
        let id = hash.slice(1)
        try { id = decodeURIComponent(id) } catch { /* Malformed hashes are harmless. */ }
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
      } else if (restoreY !== undefined) {
        window.scrollTo({ top: restoreY, behavior: 'instant' })
      } else if (settledPath.current !== pathname) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
      settledPath.current = pathname
      frame = window.requestAnimationFrame(() => { restoring.current = false })
    })
    const onImageLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement && !event.target.hasAttribute('height')) refresh()
    }
    document.addEventListener('load', onImageLoad, true)
    refresh()
    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      document.removeEventListener('load', onImageLoad, true)
    }
  }, [pathname, search, hash, key, navigationType])
  return null
}

export function SiteLayout() {
  return (
    <>
      {/* Sibling layout effects run before Outlet effects. Reset before new pins measure. */}
      <RouteScrollManager />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <RouteTransition>
        <Outlet />
        <Footer />
      </RouteTransition>
    </>
  )
}
