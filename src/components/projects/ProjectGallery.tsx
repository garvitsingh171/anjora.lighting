import type { ProjectImage } from '../../data/projects'

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  if (images.length === 0) return null

  return (
    <section className="project-gallery container" aria-label={`${title} project gallery`}>
      {images.map((image, index) => (
        <figure key={image.src} className="project-gallery__item" data-gallery-item data-gallery-size={index % 5}>
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
        </figure>
      ))}
    </section>
  )
}
