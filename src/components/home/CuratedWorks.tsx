import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { homeProjects } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { ProjectTile } from './ProjectTile'
import './CuratedWorks.css'

export function CuratedWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.utils.toArray<HTMLElement>('[data-project-tile]').forEach((tile) => {
        const media = tile.querySelector('.project-tile__media')
        const image = tile.querySelector('img')
        const caption = tile.querySelector('.project-tile__caption')

        gsap.timeline({
          scrollTrigger: { trigger: tile, start: 'top 88%', once: true },
        })
          .fromTo(media, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'power3.inOut' })
          .fromTo(image, { scale: 1.06 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
          .fromTo(caption, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.5)
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="curated-works" aria-labelledby="works-title">
      <div className="curated-works__header container">
        <p className="eyebrow">Selected project spectrum</p>
        <div>
          <h2 id="works-title" className="display-title">Curated works</h2>
          <p>
            Whatever the building was made for, we design the light that lets it be seen at its best.
          </p>
        </div>
      </div>

      <div className="curated-works__grid container">
        <div className="curated-works__row curated-works__row--top">
          {homeProjects.slice(0, 2).map((project) => <ProjectTile key={project.slug} project={project} />)}
        </div>
        <div className="curated-works__row curated-works__row--middle">
          {homeProjects.slice(2, 3).map((project) => <ProjectTile key={project.slug} project={project} />)}
        </div>
        <div className="curated-works__row curated-works__row--bottom">
          {homeProjects.slice(3, 5).map((project) => <ProjectTile key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  )
}
