import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'

interface ProjectTileProps { project: Project }

export function ProjectTile({ project }: ProjectTileProps) {
  return (
    <article className={`project-tile project-tile--${project.slug}`} data-project-tile>
      <Link to={`/projects/${project.slug}`} aria-label={`View ${project.title} project`}>
        <div className="project-tile__media">
          <img
            src={project.image}
            alt={project.imageAlt}
            width="1200"
            height="800"
            loading="lazy"
          />
          <div className="project-tile__overlay" />
          <div className="project-tile__caption">
            <div>
              <p>{project.title}</p>
              <h3>{project.category}</h3>
            </div>
            <span className="project-tile__location">{project.location ?? 'Selected work'}</span>
            <span className="project-tile__view">View project <b aria-hidden="true">↗</b></span>
          </div>
        </div>
      </Link>
    </article>
  )
}
