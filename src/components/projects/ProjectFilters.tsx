import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import type { ProjectCategory } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { EASE_UI, MOTION_FAST, prefersReducedMotion } from '../../lib/motion'

export type ProjectFilter = 'All' | ProjectCategory

interface ProjectFiltersProps {
  active: ProjectFilter
  categories: readonly ProjectCategory[]
  onChange: (category: ProjectFilter) => void
}

export function ProjectFilters({ active, categories, onChange }: ProjectFiltersProps) {
  const filters: ProjectFilter[] = ['All', ...categories]
  const rootRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const initializedRef = useRef(false)

  const positionIndicator = (animate: boolean) => {
    const root = rootRef.current
    const indicator = indicatorRef.current
    const activeButton = root?.querySelector<HTMLButtonElement>("button[aria-pressed='true']")
    if (!root || !indicator || !activeButton) return

    const properties = { x: activeButton.offsetLeft, width: activeButton.offsetWidth }
    if (animate && initializedRef.current && !prefersReducedMotion()) {
      gsap.to(indicator, { ...properties, duration: MOTION_FAST, ease: EASE_UI })
    } else {
      gsap.set(indicator, properties)
    }
    initializedRef.current = true
  }

  useGSAP(() => positionIndicator(true), { dependencies: [active], scope: rootRef })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new ResizeObserver(() => positionIndicator(false))
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="project-filters" aria-label="Filter projects by category">
      <span ref={indicatorRef} className="project-filters__indicator" aria-hidden="true" />
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={filter === active ? 'is-active' : undefined}
          aria-pressed={filter === active}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
