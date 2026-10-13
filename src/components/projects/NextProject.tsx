import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { EASE_IN_OUT, EASE_REVEAL, MOTION_SLOW, prefersReducedMotion } from '../../lib/motion'

export function NextProject({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.timeline({
      scrollTrigger: { trigger: rootRef.current, start: 'top 82%', once: true, fastScrollEnd: true },
    })
      .fromTo(rootRef.current, { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.92,
        ease: EASE_IN_OUT,
      })
      .fromTo('.next-project > a > img', { scale: 1.06 }, {
        scale: 1,
        duration: MOTION_SLOW,
        ease: EASE_REVEAL,
      }, 0)
      .fromTo('.next-project__content > *', { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.08,
        ease: EASE_REVEAL,
      }, 0.38)
  }, { scope: rootRef, dependencies: [project.slug] })

  return (
    <section ref={rootRef} className="next-project" aria-labelledby="next-project-title">
      <Link to={`/projects/${project.slug}`}>
        <img src={project.cover.src} alt="" loading="lazy" />
        <div className="next-project__shade" />
        <div className="next-project__content container">
          <p className="eyebrow">Next project · {project.category}</p>
          <h2 id="next-project-title" className="display-title">{project.title}</h2>
          <span>Continue <b aria-hidden="true">→</b></span>
        </div>
      </Link>
    </section>
  )
}
