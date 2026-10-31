import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap'
import { EASE_REVEAL, prefersReducedMotion } from './motion'

/** Content stays readable before triggers and during interrupted route transitions. */
export function useCatalogueMotion(key: string) {
  const rootRef = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo('[data-catalogue-heading]', { y: 20, opacity: 0.55 }, {
      y: 0, opacity: 1, duration: 0.65, stagger: 0.07, ease: EASE_REVEAL,
    })
    gsap.utils.toArray<HTMLElement>('[data-catalogue-reveal], .product-card').forEach((element, index) => {
      const reveal = gsap.timeline({ scrollTrigger: { trigger: element, start: 'top 96%', once: true, fastScrollEnd: true, onLeave: self => self.animation?.progress(1) } })
      reveal.fromTo(element, { y: 18, opacity: 0.65 }, {
        y: 0, opacity: 1, duration: 0.55, delay: index % 3 * 0.04, ease: EASE_REVEAL,
      })
      const image = element.querySelector('.product-card__visual, img')
      if (image) reveal.fromTo(image, { clipPath: 'inset(0 0 7% 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.65, ease: EASE_REVEAL }, 0)
    })
    const rules = gsap.utils.toArray<HTMLElement>('[data-catalogue-rule]')
    if (rules.length) gsap.fromTo(rules, { scaleX: 0.4 }, { scaleX: 1, duration: 0.8, ease: EASE_REVEAL })
  }, { scope: rootRef, dependencies: [key], revertOnUpdate: true })
  return rootRef
}
