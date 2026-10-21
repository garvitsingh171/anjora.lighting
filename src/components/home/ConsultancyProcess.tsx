import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { processStages } from '../../data/process'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { ProcessStep } from './ProcessStep'
import './ConsultancyProcess.css'

export function ConsultancyProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const media = gsap.matchMedia()
    media.add('(min-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
      const steps = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-process-step]'))
      let activeFrame = 0
      const activate = (index: number) => {
        window.cancelAnimationFrame(activeFrame)
        activeFrame = window.requestAnimationFrame(() => setActiveStep(index))
      }
      gsap.fromTo('[data-process-progress]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.consultancy-process__steps-wrap',
          start: 'top 72%',
          end: 'bottom 58%',
          scrub: 0.45,
          fastScrollEnd: true,
        },
      })

      const triggers = steps.map((step, index) => ScrollTrigger.create({
        trigger: step,
        start: 'top 64%',
        end: 'bottom 48%',
        onEnter: () => activate(index),
        onEnterBack: () => activate(index),
      }))

      return () => {
        window.cancelAnimationFrame(activeFrame)
        triggers.forEach((trigger) => trigger.kill())
      }
    })
    return () => media.revert()
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="consultancy-process" aria-labelledby="process-title">
      <div className="container consultancy-process__grid">
        <div className="consultancy-process__heading">
          <p className="eyebrow">From intent to illumination</p>
          <h2 id="process-title" className="display-title">Our lighting consultancy process</h2>
          <p>
            One continuous design conversation—from the first reading of a space to the final scene on site.
          </p>
        </div>

        <div className="consultancy-process__steps-wrap">
          <span className="consultancy-process__track" aria-hidden="true">
            <span data-process-progress />
          </span>
          <ol className="consultancy-process__steps">
            {processStages.map((stage, index) => (
              <ProcessStep
                key={stage.number}
                stage={stage}
                expanded={activeStep === index}
                onActivate={() => setActiveStep(index)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
