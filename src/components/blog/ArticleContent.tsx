import type { BlogPost, BlogSection } from '../../data/blogs'

function isTechnicalNote(section: BlogSection) {
  return section.type === 'paragraph' && /^(Recommended:|Formula:|Example:|Best for:|Ideal for:)/i.test(section.content)
}

export function ArticleContent({ post }: { post: BlogPost }) {
  return (
    <div className="article-body" data-article-body>
      {post.sections.map((section, index) => {
        const key = `${section.type}-${index}`
        if (section.type === 'heading') {
          return section.level === 2
            ? <h2 key={key}>{section.content}</h2>
            : <h3 key={key}>{section.content}</h3>
        }
        if (section.type === 'list') {
          const Tag = section.ordered ? 'ol' : 'ul'
          return <Tag key={key}>{section.items.map((item) => <li key={item}>{item}</li>)}</Tag>
        }
        if (section.type === 'quote') return <blockquote key={key}>{section.content}</blockquote>
        if (section.type === 'image') {
          return <figure key={key} data-article-image><img src={section.src} alt={section.alt} loading="lazy" /></figure>
        }
        return <p key={key} className={isTechnicalNote(section) ? 'article-body__technical' : undefined}>{section.content}</p>
      })}
    </div>
  )
}
