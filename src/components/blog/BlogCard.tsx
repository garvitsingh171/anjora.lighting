import { Link } from 'react-router-dom'
import type { BlogPost } from '../../data/blogs'
import { formatBlogDate } from '../../data/blogs'

export type BlogCardSize = 'large' | 'small' | 'wide' | 'related'

export function BlogCard({ post, size, priority = false }: { post: BlogPost; size: BlogCardSize; priority?: boolean }) {
  return (
    <article className="blog-card" data-blog-card data-size={size}>
      <Link to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        <div className="blog-card__media" data-blog-media>
          <img
            src={post.featuredImage}
            alt={post.imageAlt}
            width="1254"
            height="1254"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{ objectPosition: post.objectPosition ?? 'center' }}
          />
          <div className="blog-card__shade" />
          <span className="blog-card__index" aria-hidden="true">{formatBlogDate(post.publishedAt)}</span>
        </div>

        <div className="blog-card__content" data-blog-copy>
          <p className="blog-card__meta"><span>{post.category}</span><span>{post.readingTime}</span></p>
          <h2>{post.title}</h2>
          {size !== 'related' && <p className="blog-card__excerpt">{post.excerpt}</p>}
          <span className="blog-card__action">Read article <b aria-hidden="true">↗</b></span>
        </div>
      </Link>
    </article>
  )
}
