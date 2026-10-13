import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { EASE_UI } from '../../lib/motion'
import { useTheme } from '../../theme/useTheme'
import './ThemeToggle.css'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, isTransitioning } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const initialRender = useRef(true)
  const isDark = theme === 'dark'
  const label = `Switch to ${isDark ? 'light' : 'dark'} theme`

  useGSAP(() => {
    const button = buttonRef.current
    if (!button) return

    const sun = button.querySelector('.theme-toggle__sun')
    const moon = button.querySelector('.theme-toggle__moon')
    const targets = {
      sun: { autoAlpha: isDark ? 1 : 0, rotation: isDark ? 0 : 40, scale: isDark ? 1 : 0.65 },
      moon: { autoAlpha: isDark ? 0 : 1, rotation: isDark ? -40 : 0, scale: isDark ? 0.65 : 1 },
    }

    if (initialRender.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(sun, targets.sun)
      gsap.set(moon, targets.moon)
      initialRender.current = false
      return
    }

    gsap.to(sun, { ...targets.sun, duration: 0.28, ease: EASE_UI })
    gsap.to(moon, { ...targets.moon, duration: 0.28, ease: EASE_UI })
  }, { dependencies: [isDark], scope: buttonRef })

  const handleToggle = () => {
    const bounds = buttonRef.current?.getBoundingClientRect()
    toggleTheme(bounds ? {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    } : undefined)
  }

  return (
    <button
      ref={buttonRef}
      className={`theme-toggle ${className}`.trim()}
      type="button"
      aria-label={label}
      disabled={isTransitioning}
      onClick={handleToggle}
    >
      <span className="theme-toggle__icons" aria-hidden="true">
        <svg className="theme-toggle__icon theme-toggle__sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </svg>
        <svg className="theme-toggle__icon theme-toggle__moon" viewBox="0 0 24 24">
          <path d="M20.4 15.25A8.5 8.5 0 0 1 8.75 3.6 8.5 8.5 0 1 0 20.4 15.25Z" />
        </svg>
      </span>
      <span className="theme-toggle__tooltip" role="tooltip">{label}</span>
    </button>
  )
}
