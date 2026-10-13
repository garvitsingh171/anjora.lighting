import { useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import type { BlogPost } from '../../data/blogs'
import { createBlogGroups } from '../../lib/blog-layout'
import { gsap } from '../../lib/gsap'
import { EASE_IN_OUT, EASE_REVEAL, EASE_UI, prefersReducedMotion } from '../../lib/motion'
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
      if (prefersReducedMotion()) return

      gsap.utils.toArray<HTMLElement>('[data-blog-group]').forEach((group) => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-blog-card]', group)
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: group, start: 'top 88%', once: true, fastScrollEnd: true },
        })

        cards.forEach((card, index) => {
          const media = card.querySelector('[data-blog-media]')
          const image = card.querySelector('img')
          const copy = card.querySelector('[data-blog-copy]')
          const start = index * 0.1
          timeline
            .fromTo(media, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.95, ease: EASE_IN_OUT }, start)
            .fromTo(image, { scale: 1.05 }, { scale: 1, duration: 1.15, ease: EASE_REVEAL }, start)
            .fromTo(copy, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI }, start + 0.35)
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
