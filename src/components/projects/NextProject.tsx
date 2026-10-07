import { Link } from 'react-router-dom'
import type { Project } from '../../data/projects'

export function NextProject({ project }: { project: Project }) {
  return (
    <section className="next-project" aria-labelledby="next-project-title">
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
