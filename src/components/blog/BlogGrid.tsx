import { useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import type { BlogPost } from '../../data/blogs'
import { createBlogGroups } from '../../lib/blog-layout'
import { gsap } from '../../lib/gsap'
import { BlogCard } from './BlogCard'
import type { BlogCardSize } from './BlogCard'

function cardSize(variant: 'large-left' | 'large-right' | 'wide', index: number): BlogCardSize {
  if (variant === 'wide') return 'wide'
  if (variant === 'large-left') return index === 0 ? 'large' : 'small'
  return index === 1 ? 'large' : 'small'
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const groups = useMemo(() => createBlogGroups(posts), [posts])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.utils.toArray<HTMLElement>('[data-blog-group]').forEach((group) => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-blog-card]', group)
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        })

        cards.forEach((card, index) => {
          const media = card.querySelector('[data-blog-media]')
          const image = card.querySelector('img')
          const copy = card.querySelector('[data-blog-copy]')
          const start = index * 0.1
          timeline
            .fromTo(media, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.95, ease: 'power3.inOut' }, start)
            .fromTo(image, { scale: 1.05 }, { scale: 1, duration: 1.15, ease: 'power3.out' }, start)
            .fromTo(copy, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, start + 0.35)
        })
      })
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="blog-grid">
      {groups.map((group) => (
        <div
          key={group.posts.map((post) => post.slug).join('-')}
          className={`blog-group blog-group--${group.variant}`}
          data-blog-group
        >
          {group.posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} size={cardSize(group.variant, index)} />
          ))}
        </div>
      ))}
    </div>
  )
}
