import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { BlogCard } from '../components/blog/BlogCard'
import { EnquirySection } from '../components/home/EnquirySection'
import { blogPosts } from '../data/blogs'
import { gsap } from '../lib/gsap'
import { EASE_REVEAL, prefersReducedMotion } from '../lib/motion'
import { usePageMeta } from '../lib/page-meta'
import './Blog.css'
import './Research.css'

const topics = [
  { title: 'The qualities of light', description: 'Colour, direction and layers: a starting point for a considered lighting scheme.', folders: ['color-temperature', 'beam-angle', 'layered-lighting'] },
  { title: 'Systems & control', description: 'Understand the systems behind adaptable, responsive lighting.', folders: ['dali-lighting', 'dmx-lighting', 'led-voltage-drop'] },
  { title: 'Planning for the real world', description: 'Practical reading for the decisions that shape a project.', folders: ['lighting-checklist', 'outdoor-ip-rating', 'facade-lighting'] },
]

export function Research() {
  const rootRef = useRef<HTMLElement>(null)
  usePageMeta({ title: 'Research & Lighting Insights | Anjora Lighting', description: 'Explore Anjora’s published guides to colour, optics, lighting controls and project planning.', canonical: 'https://anjora.lighting/research', ogType: 'website' })
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('.research-hero > *', { y: 14, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: EASE_REVEAL })
    gsap.utils.toArray<HTMLElement>('.research-topic').forEach(topic => {
      gsap.fromTo(topic.querySelectorAll('.blog-card'), { y: 16 }, { y: 0, duration: 0.6, stagger: 0.05, ease: EASE_REVEAL,
        scrollTrigger: { trigger: topic, start: 'top 85%', once: true, fastScrollEnd: true } })
    })
  }, { scope: rootRef })
  return (
    <main ref={rootRef} id="main-content" className="research-page">
      <header className="research-hero container">
        <p className="eyebrow">Research & insights</p>
        <h1 className="display-title">A closer look<br />at light.</h1>
        <p>Practical guides from Anjora’s journal, bringing together lighting principles, technical systems and the decisions behind a well-lit space.</p>
        <Link className="text-link" to="/blog">Explore the full journal</Link>
      </header>
      <div className="container">
        {topics.map((topic, index) => (
          <section key={topic.title} className="research-topic" aria-labelledby={`research-topic-${index}`}>
            <header><span className="eyebrow">0{index + 1} / Reading room</span><h2 id={`research-topic-${index}`} className="display-title">{topic.title}</h2><p>{topic.description}</p></header>
            <div className="research-topic__grid">{topic.folders.flatMap(folder => {
              const post = blogPosts.find(candidate => candidate.assetFolder === folder)
              return post ? [<BlogCard key={post.slug} post={post} size="related" />] : []
            })}</div>
          </section>
        ))}
      </div>
      <EnquirySection source="Research & Insights" />
    </main>
  )
}
