import { useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { EASE_IN_OUT, EASE_REVEAL, EASE_UI, MOTION_FAST, MOTION_SLOW, prefersReducedMotion } from '../../lib/motion'
import { createEditorialGroups } from '../../lib/project-layout'
import { ProjectGroup } from './ProjectGroup'

export function ProjectGrid({ projects, motionKey }: { projects: Project[]; motionKey: string }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const groups = useMemo(() => createEditorialGroups(projects), [projects])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.fromTo(gridRef.current, { autoAlpha: 0.45, scale: 0.995 }, {
        autoAlpha: 1,
        scale: 1,
        duration: MOTION_FAST + 0.08,
        ease: EASE_UI,
      })

      gsap.utils.toArray<HTMLElement>('[data-project-group]').forEach((group, groupIndex) => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]', group)
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: group, start: 'top 88%', once: true, fastScrollEnd: true },
        })

        cards.forEach((card, index) => {
          const media = card.querySelector('.project-card__media')
          const image = card.querySelector('img')
          const caption = card.querySelector('.project-card__caption')
          const action = card.querySelector('.project-card__action')
          const start = index * 0.1

          timeline
            .fromTo(media, { clipPath: groupIndex % 2 === 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' }, {
              clipPath: 'inset(0% 0 0 0)',
              duration: MOTION_SLOW,
              ease: EASE_IN_OUT,
            }, start)
            .fromTo(image, { scale: 1.06 }, {
              scale: 1,
              duration: MOTION_SLOW + 0.15,
              ease: EASE_REVEAL,
            }, start)
            .fromTo([caption, action], { autoAlpha: 0, y: 14 }, {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: EASE_UI,
            }, start + 0.42)
        })
      })

      if (window.matchMedia('(min-width: 900px)').matches) {
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
