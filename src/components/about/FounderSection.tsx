import founderImage from '../../assets/about/shubham-khandelwal.png'

const education = [
  {
    title: 'Electronics & Communication Engineering',
    detail: 'Bachelor’s degree',
  },
  {
    title: 'VLSI',
    detail: 'Master of Technology · IIT Roorkee',
  },
  {
    title: 'Illumination Technology',
    detail: 'Master’s-level study · Oakland University, Netherlands',
  },
]

const career = [
  {
    year: '2018',
    role: 'Lighting Designer',
    company: 'Jaquar + Philips Lighting',
    detail: 'The beginning of a professional lighting-design practice shaped by creative and technical project work.',
  },
  {
    year: '2024',
    role: 'Director',
    company: 'Anjora Lighting',
    detail: 'Leading the practice through innovation, sustainability, aesthetic sensitivity and meticulous execution.',
  },
]

export function FounderSection() {
  return (
    <section className="about-founder container" aria-labelledby="founder-title">
      <div className="about-founder__visual">
        <div className="about-section-label" data-story-reveal>
          <span>03</span>
          <p className="eyebrow">Shining innovation</p>
        </div>
        <div className="about-founder__portrait" data-founder-portrait>
          <img
            src={founderImage}
            alt="Shubham Khandelwal, Director of Anjora Lighting"
            width="279"
            height="278"
          />
        </div>
        <div className="about-founder__portrait-meta">
          <span>Jaipur, India</span>
          <span>Director / Anjora Lighting</span>
        </div>
      </div>

      <article className="about-founder__story">
        <header data-founder-copy>
          <p className="eyebrow">Meet the director</p>
          <h2 id="founder-title" className="display-title">Shubham<br />Khandelwal</h2>
          <p className="about-founder__role">Director, Anjora Lighting</p>
        </header>

        <div className="about-founder__biography" data-founder-copy>
          <p>
            Shubham Khandelwal brings engineering understanding, lighting-design experience
            and aesthetic sensitivity to the practice.
          </p>
          <p>
            After studying Electronics and Communication Engineering and completing an M.Tech
            in VLSI at IIT Roorkee, his fascination with light led to further study in
            Illumination Technology. His professional lighting-design journey began in 2018
            with Jaquar and Philips Lighting.
          </p>
          <p>
            At Anjora, that technical grounding meets close attention to emotion and execution:
            a way of working that asks lighting to be precise, functional and capable of
            transforming how a space is experienced.
          </p>
          <a href="mailto:shubham@anjora.lighting">shubham@anjora.lighting <span aria-hidden="true">↗</span></a>
        </div>

        <section className="about-journey" aria-labelledby="education-title">
          <div className="about-journey__heading" data-story-reveal>
            <p className="eyebrow">A journey with purpose</p>
            <h3 id="education-title">Education</h3>
          </div>
          <ol className="about-education">
            {education.map((item, index) => (
              <li key={item.title} data-journey-item>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-career" aria-labelledby="career-title">
          <div className="about-journey__heading" data-story-reveal>
            <p className="eyebrow">Professional journey</p>
            <h3 id="career-title">From engineering to experience</h3>
          </div>
          <div className="about-career__timeline">
            <div className="about-career__line" data-career-line aria-hidden="true" />
            {career.map((milestone) => (
              <article key={milestone.year} data-career-item>
                <span>{milestone.year}</span>
                <div>
                  <h4>{milestone.role}</h4>
                  <p className="about-career__company">{milestone.company}</p>
                  <p>{milestone.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </article>
    </section>
  )
}
