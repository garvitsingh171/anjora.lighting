const projectScope = [
  'Luxury residences',
  'Educational institutions',
  'Malls',
  'High-rise buildings',
  'Townships',
  'Villa developments',
  'Clubhouses',
  'Outdoor landscapes',
  'Building façades',
  'Commercial interiors',
]

export function CompanyStory() {
  return (
    <section className="about-company container" aria-labelledby="company-title">
      <div className="about-section-label" data-story-reveal>
        <span>01</span>
        <p className="eyebrow">Our company</p>
      </div>

      <div className="about-company__narrative">
        <h2 id="company-title" data-story-reveal>
          An independent lighting design consultancy based in Jaipur, working across India.
        </h2>

        <div className="about-company__copy" data-story-reveal>
          <p>
            Anjora Lighting brings together innovative designers and experienced lighting
            professionals for projects across India’s major metropolitan areas.
          </p>
          <p>
            Global lighting-design and sustainability practices are adapted to the realities
            of Indian projects. Every scheme is carried into detailed execution with close
            attention to how light feels, performs and reinforces the designed environment.
          </p>
        </div>
      </div>

      <div className="about-scope" data-story-reveal aria-label="Anjora Lighting project scope">
        <p className="eyebrow">Project spectrum</p>
        <ul>
          {projectScope.map((item, index) => (
            <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
