import { useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { createEditorialGroups } from '../../lib/project-layout'
import { ProjectGroup } from './ProjectGroup'

export function ProjectGrid({ projects, motionKey }: { projects: Project[]; motionKey: string }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const groups = useMemo(() => createEditorialGroups(projects), [projects])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.utils.toArray<HTMLElement>('[data-project-group]').forEach((group) => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]', group)
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        })

        cards.forEach((card, index) => {
          const media = card.querySelector('.project-card__media')
          const image = card.querySelector('img')
          const caption = card.querySelector('.project-card__caption')
          const action = card.querySelector('.project-card__action')
          const start = index * 0.1

          timeline
            .fromTo(media, { clipPath: 'inset(100% 0 0 0)' }, {
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.05,
              ease: 'power3.inOut',
            }, start)
            .fromTo(image, { scale: 1.06 }, {
              scale: 1,
              duration: 1.2,
              ease: 'power3.out',
            }, start)
            .fromTo([caption, action], { autoAlpha: 0, y: 14 }, {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
            }, start + 0.42)
        })
      })

      if (window.matchMedia('(min-width: 768px)').matches) {
        gsap.utils.toArray<HTMLElement>('[data-project-parallax] img').forEach((image) => {
          gsap.fromTo(image, { yPercent: -2 }, {
            yPercent: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: image.closest('[data-project-card]'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        })
      }
    },
    { scope: gridRef, dependencies: [motionKey] },
  )

  return (
    <div ref={gridRef} className="project-grid" aria-live="polite">
      {groups.length > 0 ? (
        groups.map((group, index) => (
          <ProjectGroup
            key={group.projects.map((project) => project.slug).join('-')}
            group={group}
            index={index}
          />
        ))
      ) : (
        <p className="project-grid__empty">No projects are available in this category.</p>
      )}
    </div>
  )
}
