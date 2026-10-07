import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import { Link, useParams } from 'react-router-dom'
import { EnquirySection } from '../components/home/EnquirySection'
import { NextProject } from '../components/projects/NextProject'
import { ProjectGallery } from '../components/projects/ProjectGallery'
import { getNextProject, projects } from '../data/projects'
import { gsap } from '../lib/gsap'
import './Projects.css'

export function ProjectDetail() {
  const { slug = '' } = useParams()
  const rootRef = useRef<HTMLElement>(null)
  const project = projects.find((candidate) => candidate.slug === slug)

  useEffect(() => {
    document.title = project
      ? `${project.title} | Anjora Lighting Projects`
      : 'Project not found | Anjora Lighting'
  }, [project])

  useGSAP(
    () => {
      if (!project || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-detail-meta]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 })
        .fromTo('[data-detail-title]', { yPercent: 115 }, { yPercent: 0, duration: 1 }, '-=0.4')

      gsap.fromTo('[data-detail-image]', { yPercent: -4, scale: 1.03 }, {
        yPercent: 4,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-detail-hero]',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-gallery-item]').forEach((item) => {
        gsap.fromTo(item, { autoAlpha: 0, y: 42 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        })
      })
    },
    { scope: rootRef, dependencies: [slug] },
  )

  if (!project) {
    return (
      <main ref={rootRef} id="main-content" className="project-not-found container">
        <p className="eyebrow">404 · Project not found</p>
        <h1 className="display-title">The light is elsewhere.</h1>
        <p>This project does not exist in Anjora’s verified archive.</p>
        <Link className="text-link" to="/projects">Return to projects</Link>
      </main>
    )
  }

  const nextProject = getNextProject(project.slug)
  const hasDetails = Boolean(project.description?.length || project.facts?.length)
  const heroStyle = { '--project-hero': `url("${project.cover.src}")` } as CSSProperties

  return (
    <main ref={rootRef} id="main-content" className="project-detail">
      <header className="project-detail__hero" data-detail-hero style={heroStyle}>
        <div className="project-detail__hero-backdrop" />
        <img data-detail-image src={project.cover.src} alt={project.cover.alt} />
        <div className="project-detail__hero-shade" />

        <div className="project-detail__hero-content container">
          <div className="project-detail__breadcrumb" data-detail-meta>
            <Link to="/projects">Projects</Link>
            <span aria-hidden="true">/</span>
            <span>{project.category}</span>
          </div>
          <div className="project-detail__title-mask">
            <h1 className="display-title" data-detail-title>{project.title}</h1>
          </div>
          <dl className="project-detail__meta" data-detail-meta>
            <div><dt>Category</dt><dd>{project.category}</dd></div>
            {project.location && <div><dt>Location</dt><dd>{project.location}</dd></div>}
            {project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}
          </dl>
        </div>
      </header>

      {hasDetails && (
        <section className="project-detail__story container" aria-label="Project details">
          <p className="eyebrow">Project notes</p>
          <div className="project-detail__copy">
            {project.description?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {project.facts && (
            <dl className="project-detail__facts">
              {project.facts.map((fact) => (
                <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
              ))}
            </dl>
          )}
        </section>
      )}

      <ProjectGallery images={project.gallery} title={project.title} />
      <NextProject project={nextProject} />
      <EnquirySection source="Project Detail" projectName={project.title} />
    </main>
  )
}
