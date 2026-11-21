import { useRef, type PointerEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { prefersReducedMotion } from '../../lib/motion'

type ChoiceProps = {
  to: string
  kind: 'consultancy' | 'products'
  image: string
  title: string
  description: string
  label: string
}

export function ExperienceChoice({ to, kind, image, title, description, label }: ChoiceProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const { contextSafe } = useGSAP({ scope: linkRef })
  return (
    <Link ref={linkRef} to={to} className={`experience-choice experience-choice--${kind}`}
      aria-labelledby={`choice-${kind}-title choice-${kind}-cta`}
      onPointerDown={contextSafe((event: PointerEvent<HTMLAnchorElement>) => {
        if (!prefersReducedMotion()) gsap.fromTo(event.currentTarget, { opacity: 1 }, { opacity: 0.88, duration: 0.1, yoyo: true, repeat: 1, clearProps: 'opacity' })
      })}>
      <div className="experience-choice__media"><img src={image} alt="" loading="lazy" width="900" height="700" /></div>
      <div className="experience-choice__content">
        <p className="eyebrow">{kind === 'consultancy' ? 'Spaces we design' : 'Pieces we create'}</p>
        <h3 id={`choice-${kind}-title`}>{title}</h3>
        <p className="experience-choice__description">{description}</p>
        <span className="experience-choice__cta" id={`choice-${kind}-cta`}>{label}<span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  )
}
