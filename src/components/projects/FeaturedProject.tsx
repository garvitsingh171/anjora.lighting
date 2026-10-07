import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'
import { gsap } from '../../lib/gsap'

export function FeaturedProject({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo('[data-featured-image]', { yPercent: -5 }, {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="featured-project" aria-label={`Featured project: ${project.title}`}>
      <Link to={`/projects/${project.slug}`}>
        <div className="featured-project__media">
          <img data-featured-image src={project.cover.src} alt={project.cover.alt} />
          <div className="featured-project__shade" />
          <div className="featured-project__content container">
            <p className="eyebrow">Featured project · {project.category}</p>
            <h2 className="display-title">{project.title}</h2>
            <span>Explore project <b aria-hidden="true">↗</b></span>
          </div>
        </div>
      </Link>
    </section>
  )
}
