import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import './Projects.css'

export function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((candidate) => candidate.slug === slug)

  if (!project) {
    return (
      <main id="main-content" className="container project-not-found">
        <p className="eyebrow">Project not found</p>
        <h1 className="display-title">No matching project</h1>
        <Link className="text-link" to="/projects">View selected projects</Link>
      </main>
    )
  }

  return (
    <main id="main-content" className="project-detail">
      <header className="project-detail__header container">
        <div>
          <p className="eyebrow">{project.category}{project.year ? ` · ${project.year}` : ''}</p>
          <h1 className="display-title">{project.title}</h1>
        </div>
        <p>{project.summary}</p>
      </header>
      <figure className="project-detail__figure">
        <img src={project.image} alt={project.imageAlt} width="1600" height="1000" />
        <figcaption className="container">
          <span>{project.location ?? 'Selected work'}</span>
          <span>Architectural lighting consultancy</span>
        </figcaption>
      </figure>
      <section className="project-detail__scope container">
        <p className="eyebrow">Project scope</p>
        <div>
          <h2 className="display-title">Light shaped around experience.</h2>
          <p>{project.summary} Detailed project information and the complete photography set can be added when approved by the client.</p>
          <a className="text-link" href="mailto:info@anjora.lighting?subject=Project%20Consultancy%20Enquiry">Discuss a project</a>
        </div>
      </section>
    </main>
  )
}
