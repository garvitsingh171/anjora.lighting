import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { EASE_IN_OUT, EASE_UI, MOTION_FAST } from '../lib/motion'
import { ThemeContext, type ThemeChangeOrigin } from './theme-context'
import {
  applyTheme,
  getInitialTheme,
  getStoredTheme,
  storeTheme,
  THEME_BACKGROUND,
  type Theme,
} from './theme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<gsap.core.Timeline | null>(null)
  const transitionLockedRef = useRef(false)

  const commitTheme = useCallback((nextTheme: Theme, persist = true) => {
    applyTheme(nextTheme)
    setThemeState(nextTheme)
    if (persist) storeTheme(nextTheme)
  }, [])

  const setTheme = useCallback((nextTheme: Theme, origin?: ThemeChangeOrigin) => {
    if (nextTheme === theme || transitionLockedRef.current) return

    const overlay = overlayRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!overlay || reduceMotion) {
      commitTheme(nextTheme)
      ScrollTrigger.refresh()
      return
    }

    const x = origin?.x ?? window.innerWidth / 2
    const y = origin?.y ?? 0
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    transitionLockedRef.current = true
    setIsTransitioning(true)
    transitionRef.current?.kill()
    gsap.set(overlay, {
      autoAlpha: 1,
      backgroundColor: THEME_BACKGROUND[nextTheme],
      clipPath: `circle(0px at ${x}px ${y}px)`,
    })

    transitionRef.current = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0, clearProps: 'clipPath,backgroundColor' })
        transitionLockedRef.current = false
        setIsTransitioning(false)
        ScrollTrigger.refresh()
      },
    })
      .to(overlay, {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        duration: 0.34,
        ease: EASE_IN_OUT,
      })
      .call(() => commitTheme(nextTheme))
      .to(overlay, { autoAlpha: 0, duration: MOTION_FAST, ease: EASE_UI })
  }, [commitTheme, theme])

  const toggleTheme = useCallback((origin?: ThemeChangeOrigin) => {
    setTheme(theme === 'dark' ? 'light' : 'dark', origin)
  }, [setTheme, theme])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme()) return
      commitTheme(event.matches ? 'light' : 'dark', false)
      ScrollTrigger.refresh()
    }

    media.addEventListener('change', handleSystemThemeChange)
    return () => media.removeEventListener('change', handleSystemThemeChange)
  }, [commitTheme])

  useEffect(() => () => {
    transitionRef.current?.kill()
  }, [])

  const value = useMemo(() => ({
    theme,
    isTransitioning,
    setTheme,
    toggleTheme,
  }), [isTransitioning, setTheme, theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <div className="theme-transition-overlay" ref={overlayRef} aria-hidden="true" />
    </ThemeContext.Provider>
  )
}
