import { useEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { EnquirySection } from '../components/home/EnquirySection'
import { ProjectFilters } from '../components/projects/ProjectFilters'
import type { ProjectFilter } from '../components/projects/ProjectFilters'
import { ProjectGrid } from '../components/projects/ProjectGrid'
import { ProjectsHero } from '../components/projects/ProjectsHero'
import { projectCategories, projects } from '../data/projects'
import { gsap } from '../lib/gsap'
import './Projects.css'

export function Projects() {
  const rootRef = useRef<HTMLElement>(null)
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All')

  useEffect(() => {
    document.title = 'Projects | Anjora Lighting'
  }, [])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-hero-line]', { yPercent: 110 }, { yPercent: 0, duration: 0.95, stagger: 0.12 })
        .fromTo('[data-hero-item]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 }, '-=0.45')
        .fromTo('[data-hero-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '-=0.55')
    },
    { scope: rootRef },
  )

  const visibleProjects = useMemo(
    () => activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter),
    [activeFilter],
  )

  return (
    <main ref={rootRef} id="main-content" className="projects-page">
      <ProjectsHero count={projects.length} />

      <section className="project-index container" aria-label="Project archive">
        <div className="project-index__controls">
          <p>{String(visibleProjects.length).padStart(2, '0')} projects</p>
          <ProjectFilters
            active={activeFilter}
            categories={projectCategories}
            onChange={setActiveFilter}
          />
        </div>

        <ProjectGrid projects={visibleProjects} motionKey={activeFilter} />
      </section>

      <EnquirySection />
    </main>
  )
}
