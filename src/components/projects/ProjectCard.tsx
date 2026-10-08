import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'

export type ProjectTileSize = 'large' | 'compact' | 'full' | 'balanced'

interface ProjectCardProps {
  project: Project
  size: ProjectTileSize
  priority?: boolean
  parallax?: boolean
}

export function ProjectCard({ project, size, priority = false, parallax = false }: ProjectCardProps) {
  return (
    <article
      className="project-card"
      data-project-card
      data-tile-size={size}
      data-orientation={project.cover.orientation ?? 'landscape'}
      data-project-parallax={parallax || undefined}
    >
      <Link className="project-card__link" to={`/projects/${project.slug}`} aria-label={`View ${project.title} project`}>
        <div className="project-card__media">
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{ objectPosition: project.cover.objectPosition ?? 'center' }}
          />
          <div className="project-card__overlay" />
          <div className="project-card__caption">
            <h2>{project.title}</h2>
            <p>
              <span>{project.category}</span>
              {project.location && <span>{project.location}</span>}
            </p>
          </div>
          <span className="project-card__action" aria-hidden="true">View project <b>↗</b></span>
        </div>
      </Link>
    </article>
  )
}
