import type { Service } from '../../data/services'

interface ServiceSlideProps {
  service: Service
  index: number
}

export function ServiceSlide({ service, index }: ServiceSlideProps) {
  return (
    <article
      className="service-slide"
      data-service-slide
    >
      <div className="service-slide__visual">
        <img
          className="service-slide__image"
          src={service.image}
          alt={service.imageAlt}
          width="600"
          height="400"
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </div>
      <div className="service-slide__body">
        <p className="service-slide__number">Service {service.number}</p>
        <h3>{service.title}</h3>
        <p className="service-slide__description">{service.description}</p>
        <ul aria-label={`${service.title} capabilities`}>
          {service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
        </ul>
      </div>
    </article>
  )
}
