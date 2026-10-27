import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import type { Project, ProjectCategory } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, prefersReducedMotion } from '../../lib/motion'

export function NextProject({ project, currentCategory }: { project: Project; currentCategory: ProjectCategory }) {
  const rootRef = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('.next-project__media img', { scale: 1.035 }, {
      scale: 1, duration: 0.7, ease: EASE_REVEAL,
      scrollTrigger: { trigger: rootRef.current, start: 'top 90%', once: true, fastScrollEnd: true },
    })
  }, { scope: rootRef, dependencies: [project.slug], revertOnUpdate: true })

  return (
    <aside ref={rootRef} className="next-project container" aria-labelledby="next-project-label">
      <p id="next-project-label" className="eyebrow">Explore another project</p>
      <Link to={`/projects/${project.slug}`} aria-label={`View ${project.title} project`}>
        <div className="next-project__media"><img src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} loading="lazy" /></div>
        <div className="next-project__content">
          <p>{project.category}{project.location ? ` · ${project.location}` : ''}</p>
          <h2 className="display-title">{project.title}</h2>
          <span className="next-project__context">{project.category === currentCategory ? 'More from this category' : 'From another category'}</span>
        </div>
        <span className="next-project__action">View project <b aria-hidden="true">↗</b></span>
      </Link>
    </aside>
  )
}
