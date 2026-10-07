import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid({ projects, motionKey }: { projects: Project[]; motionKey: string }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card) => {
        const media = card.querySelector('.project-card__media')
        const caption = card.querySelector('.project-card__caption')

        gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        })
          .fromTo(media, { clipPath: 'inset(0 0 100% 0)' }, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.9,
            ease: 'power3.inOut',
          })
          .fromTo(caption, { autoAlpha: 0, y: 12 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
          }, '-=0.3')
      })
    },
    { scope: gridRef, dependencies: [motionKey] },
  )

  return (
    <div ref={gridRef} className="project-grid" aria-live="polite">
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))
      ) : (
        <p className="project-grid__empty">No projects are available in this category.</p>
      )}
    </div>
  )
}
