import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import { BlogCard } from '../blog/BlogCard'
import { blogPosts } from '../../data/blogs'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, prefersReducedMotion } from '../../lib/motion'
import './InsightsPreview.css'

export function InsightsPreview() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = rootRef.current
      if (!section) return
      if (prefersReducedMotion()) return
      gsap.fromTo('[data-home-insight]', { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: EASE_REVEAL,
        scrollTrigger: { trigger: section, start: 'top 78%', once: true, fastScrollEnd: true },
      })
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="insights-preview" aria-labelledby="insights-preview-title">
      <div className="insights-preview__header container">
        <p className="eyebrow">Ideas from the studio</p>
        <div>
          <h2 id="insights-preview-title" className="display-title">Lighting insights</h2>
          <p>Practical knowledge for spaces that feel as considered as they look.</p>
        </div>
      </div>
      <div className="insights-preview__grid container">
        {blogPosts.slice(0, 4).map((post, index) => (
          <div key={post.slug} data-home-insight>
            <BlogCard post={post} size={index === 0 || index === 3 ? 'large' : 'small'} />
          </div>
        ))}
      </div>
      <div className="insights-preview__footer container">
        <Link className="text-link" to="/blog">View all insights</Link>
      </div>
    </section>
  )
}
