export function ProjectsHero({ count }: { count: number }) {
  return (
    <header className="projects-hero" data-projects-hero>
      <div className="container projects-hero__inner">
        <p className="eyebrow" data-hero-item>Selected work · {String(count).padStart(2, '0')} projects</p>
        <div className="projects-hero__headline">
          <h1 className="display-title" aria-label="Projects. Light in practice.">
            <span data-hero-line>Projects.</span>
            <span data-hero-line>Light in practice.</span>
          </h1>
          <p data-hero-item>
            A collection of Anjora’s lighting work across hospitality, heritage,
            commercial, workplace, facade and specialist environments.
          </p>
        </div>
        <div className="projects-hero__rule" data-hero-rule />
      </div>
    </header>
  )
}
