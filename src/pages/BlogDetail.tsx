import { useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { ArticleContent } from '../components/blog/ArticleContent'
import { BlogCard } from '../components/blog/BlogCard'
import { EnquirySection } from '../components/home/EnquirySection'
import { formatBlogDate, getBlogPost, getRelatedBlogPosts } from '../data/blogs'
import { gsap } from '../lib/gsap'
import { usePageMeta } from '../lib/page-meta'
import './Blog.css'

export function BlogDetail() {
  const { slug = '' } = useParams()
  const rootRef = useRef<HTMLElement>(null)
  const post = getBlogPost(slug)
  const related = useMemo(() => post ? getRelatedBlogPosts(post.slug) : [], [post])
  const canonical = post ? `https://anjora.lighting/blog/${post.slug}` : 'https://anjora.lighting/blog'
  const socialImage = post ? new URL(post.featuredImage, 'https://anjora.lighting').href : undefined

  usePageMeta({
    title: post ? `${post.title} | Anjora Lighting` : 'Article not found | Anjora Lighting',
    description: post?.excerpt ?? 'Explore lighting insights from Anjora Lighting.',
    canonical,
    image: socialImage,
    structuredData: post ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: post.author },
      image: socialImage,
      publisher: { '@type': 'Organization', name: 'Anjora Lighting' },
      mainEntityOfPage: canonical,
    } : undefined,
  })

  useGSAP(
    () => {
      if (!post || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-article-meta]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55 })
        .fromTo('[data-article-title]', { yPercent: 110 }, { yPercent: 0, duration: 1 }, '-=0.35')
        .fromTo('[data-article-hero-media]', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.05, ease: 'power3.inOut' }, '-=0.55')
        .fromTo('[data-article-hero-media] img', { scale: 1.06 }, { scale: 1, duration: 1.25 }, '-=1.05')

      gsap.to('[data-reading-progress]', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-article-body]',
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-article-image]').forEach((figure) => {
        gsap.fromTo(figure, { clipPath: 'inset(100% 0 0 0)' }, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: figure, start: 'top 88%', once: true },
        })
      })
    },
    { scope: rootRef, dependencies: [slug] },
  )

  if (!post) {
    return (
      <main ref={rootRef} id="main-content" className="blog-not-found container">
        <p className="eyebrow">404 · Article not found</p>
        <h1 className="display-title">The page has gone dark.</h1>
        <p>This article does not exist in Anjora’s verified journal.</p>
        <Link className="text-link" to="/blog">Back to journal</Link>
      </main>
    )
  }

  return (
    <main ref={rootRef} id="main-content" className="blog-detail">
      <div className="reading-progress" data-reading-progress />
      <header className="article-hero container">
        <div className="article-hero__breadcrumb" data-article-meta>
          <Link to="/blog">Journal</Link><span aria-hidden="true">/</span><span>{post.category}</span>
        </div>
        <div className="article-hero__title-mask">
          <h1 className="display-title" data-article-title>{post.title}</h1>
        </div>
        <div className="article-hero__meta" data-article-meta>
          <span>By {post.author}</span><span>{formatBlogDate(post.publishedAt)}</span><span>{post.readingTime}</span>
        </div>
        <div className="article-hero__media" data-article-hero-media>
          <img src={post.featuredImage} alt={post.imageAlt} width="1254" height="1254" loading="eager" />
        </div>
      </header>

      <article className="article-layout container">
        <aside className="article-rail" aria-label="Article details">
          <p className="eyebrow">Published</p>
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span>{post.readingTime}</span>
          <a href={post.legacyUrl}>Original publication ↗</a>
        </aside>
        <ArticleContent post={post} />
      </article>

      <section className="related-articles container" aria-labelledby="related-title">
        <p className="eyebrow">Continue reading</p>
        <h2 id="related-title" className="display-title">More from the journal</h2>
        <div className="related-articles__grid">
          {related.map((relatedPost) => <BlogCard key={relatedPost.slug} post={relatedPost} size="related" />)}
        </div>
      </section>

      <EnquirySection source="Blog Article" projectName={post.title} />
    </main>
  )
}
