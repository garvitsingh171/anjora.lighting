import { ProjectTile } from '../components/home/ProjectTile'
import { projects } from '../data/projects'
import './Projects.css'

export function Projects() {
  return (
    <main id="main-content" className="projects-page">
      <header className="projects-page__hero container">
        <p className="eyebrow">Lighting across typologies</p>
        <div>
          <h1 className="display-title">Selected projects</h1>
          <p>Residential, hospitality, workplace, club, institutional and heritage lighting—each resolved from the architecture outward.</p>
        </div>
      </header>
      <section className="projects-page__grid container" aria-label="Selected projects">
        {projects.map((project) => <ProjectTile key={project.slug} project={project} />)}
      </section>
    </main>
  )
}
