import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'

const cardSizes = ['wide', 'portrait', 'regular', 'regular', 'wide', 'portrait'] as const

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card" data-project-card data-size={cardSizes[index % cardSizes.length]}>
      <Link to={`/projects/${project.slug}`} aria-label={`View ${project.title} project`}>
        <div className="project-card__media">
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <span className="project-card__action" aria-hidden="true">View ↗</span>
        </div>
        <div className="project-card__caption">
          <div>
            <h2>{project.title}</h2>
            <p>{project.category}</p>
          </div>
          {project.location && <p>{project.location}</p>}
        </div>
      </Link>
    </article>
  )
}
