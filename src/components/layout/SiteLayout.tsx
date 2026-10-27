import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../../lib/gsap'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { RouteTransition } from './RouteTransition'

function RouteScrollManager() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    let disposed = false
    let timer = 0
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
      }
    })
    const onImageLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement && !event.target.hasAttribute('height')) refresh()
    }
    document.addEventListener('load', onImageLoad, true)
    refresh()
    return () => {
      disposed = true
      window.clearTimeout(timer)
      document.removeEventListener('load', onImageLoad, true)
    }
  }, [pathname, search, hash])
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
