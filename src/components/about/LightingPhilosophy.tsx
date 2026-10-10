import philosophyImage from '../../assets/projects/ohana/gallery-04.webp'

const elements = [
  { name: 'Form', detail: 'The geometry of the designed environment.' },
  { name: 'Scale', detail: 'The proportion through which space is perceived.' },
  { name: 'Material', detail: 'Surface, texture and colour brought into view.' },
  { name: 'Light', detail: 'A controllable design tool that turns vision into experience.' },
]

export function LightingPhilosophy() {
  return (
    <>
      <section className="about-philosophy" aria-labelledby="philosophy-title">
        <div className="about-philosophy__grid container">
          <div className="about-philosophy__sticky">
            <div className="about-section-label" data-story-reveal>
              <span>02</span>
              <p className="eyebrow">How we think</p>
            </div>
            <h2 id="philosophy-title" className="display-title" data-story-reveal>
              Light belongs in the same conversation as form, scale and material.
            </h2>
            <p data-story-reveal>
              Anjora approaches light as a powerful, precise and controllable part of spatial
              design—capable of reinforcing architecture and shaping how an environment is felt.
            </p>
          </div>

          <ol className="about-philosophy__elements">
            {elements.map((element, index) => (
              <li key={element.name} data-philosophy-word>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{element.name}</h3>
                  <p>{element.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <figure className="about-interlude container">
        <div className="about-interlude__media" data-about-image-reveal>
          <img
            src={philosophyImage}
            alt="Anjora lighting detail revealing material, colour and form"
            width="960"
            height="960"
            loading="lazy"
          />
          <div className="about-interlude__shade" />
          <figcaption>
            <span>Light / material / experience</span>
            <p>Through light, a designed space becomes an immersive experience.</p>
          </figcaption>
        </div>
      </figure>
    </>
  )
}
