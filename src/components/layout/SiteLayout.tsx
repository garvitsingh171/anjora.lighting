import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { RouteTransition } from './RouteTransition'

export function SiteLayout() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0 })
  }, [pathname, search, hash])

  useEffect(() => {
    if (!hash) return
    // Allow all route ScrollTriggers to register before jumping past one-time reveals.
    const timer = window.setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
    }, 180)
    return () => window.clearTimeout(timer)
  }, [pathname, search, hash])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <RouteTransition>
        <Outlet />
        <Footer />
      </RouteTransition>
    </>
  )
}
