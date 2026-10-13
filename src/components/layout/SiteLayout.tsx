import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { RouteTransition } from './RouteTransition'

export function SiteLayout() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView()
      })
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

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
