const principles = [
  {
    title: 'Artistry',
    text: 'Light is composed to evoke emotion and bring contemporary elegance to a space.',
  },
  {
    title: 'Innovation',
    text: 'Global practices and lighting technology are adapted to the realities of Indian projects.',
  },
  {
    title: 'Functionality',
    text: 'A compelling visual experience is supported by technical rigour, detail and execution.',
  },
]

export function Principles() {
  return (
    <section className="about-principles container" aria-labelledby="principles-title">
      <div className="about-principles__heading" data-story-reveal>
        <div className="about-section-label">
          <span>04</span>
          <p className="eyebrow">What guides our work</p>
        </div>
        <h2 id="principles-title" className="display-title">Designed to be felt.<br />Detailed to perform.</h2>
      </div>

      <ol>
        {principles.map((principle, index) => (
          <li key={principle.title} data-principle>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
