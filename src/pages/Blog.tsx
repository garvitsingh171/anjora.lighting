import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { BlogGrid } from '../components/blog/BlogGrid'
import { BlogHero } from '../components/blog/BlogHero'
import { EnquirySection } from '../components/home/EnquirySection'
import { blogPosts, featuredBlogPost, formatBlogDate } from '../data/blogs'
import { gsap } from '../lib/gsap'
import { usePageMeta } from '../lib/page-meta'
import './Blog.css'

export function Blog() {
  const rootRef = useRef<HTMLElement>(null)
  const listingPosts = useMemo(() => blogPosts.slice(1), [])

  usePageMeta({
    title: 'Lighting Insights | Anjora Lighting',
    description: 'Technical lighting guidance, design ideas and architectural insight from Anjora Lighting.',
    canonical: 'https://anjora.lighting/blog',
  })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-blog-hero-title]', { yPercent: 110 }, { yPercent: 0, duration: 0.95 })
        .fromTo('[data-blog-hero-item]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.5')
        .fromTo('[data-blog-hero-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '-=0.45')

      gsap.timeline({
        scrollTrigger: { trigger: '[data-featured-story]', start: 'top 88%', once: true },
      })
        .fromTo('[data-featured-media]', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.inOut' })
        .fromTo('[data-featured-media] img', { scale: 1.06 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
        .fromTo('[data-featured-copy]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.45)
    },
    { scope: rootRef },
  )

  return (
    <main ref={rootRef} id="main-content" className="blog-page">
      <BlogHero count={blogPosts.length} />

      <section className="blog-index container" aria-label="Lighting journal">
        <p className="eyebrow">Latest insight</p>
        <article className="blog-feature" data-featured-story>
          <Link to={`/blog/${featuredBlogPost.slug}`}>
            <div className="blog-feature__media" data-featured-media>
              <img src={featuredBlogPost.featuredImage} alt={featuredBlogPost.imageAlt} width="1254" height="1254" />
            </div>
            <div className="blog-feature__content" data-featured-copy>
              <p className="blog-card__meta"><span>{featuredBlogPost.category}</span><span>{featuredBlogPost.readingTime}</span></p>
              <h2>{featuredBlogPost.title}</h2>
              <p>{featuredBlogPost.excerpt}</p>
              <div><span>{formatBlogDate(featuredBlogPost.publishedAt)}</span><b>Read article ↗</b></div>
            </div>
          </Link>
        </article>

        <div className="blog-index__heading">
          <p className="eyebrow">From the studio</p>
          <p>Technical knowledge for more considered spaces.</p>
        </div>
        <BlogGrid posts={listingPosts} />
      </section>

      <EnquirySection source="Blog" />
    </main>
  )
}
