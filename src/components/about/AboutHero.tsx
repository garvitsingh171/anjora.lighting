export function AboutHero() {
  return (
    <header className="about-hero" aria-labelledby="about-title">
      <div className="about-hero__inner container">
        <p className="eyebrow" data-about-hero-item>About Anjora</p>

        <div className="about-hero__composition">
          <h1 id="about-title" className="display-title" aria-label="Transforming ambience, one beam at a time.">
            <span className="about-hero__line"><span data-about-hero-line>Transforming</span></span>
            <span className="about-hero__line"><span data-about-hero-line>ambience,</span></span>
            <span className="about-hero__line"><span data-about-hero-line>one beam at a time.</span></span>
          </h1>

          <div className="about-hero__aside" data-about-hero-item>
            <span aria-hidden="true">01</span>
            <p>Crafting light to elevate environments.</p>
          </div>
        </div>

        <div className="about-hero__rule" data-about-hero-rule />
      </div>
    </header>
  )
}
