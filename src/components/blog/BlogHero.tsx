export function BlogHero({ count }: { count: number }) {
  return (
    <header className="blog-hero">
      <div className="blog-hero__inner container">
        <p className="eyebrow" data-blog-hero-item>Insights · {String(count).padStart(2, '0')} articles</p>
        <div className="blog-hero__headline">
          <div className="blog-hero__title-mask"><h1 className="display-title" data-blog-hero-title>Journal</h1></div>
          <p data-blog-hero-item>Expert insights, lighting ideas and design guidance for modern spaces.</p>
        </div>
        <div className="blog-hero__rule" data-blog-hero-rule />
      </div>
    </header>
  )
}
