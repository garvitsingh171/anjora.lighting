import { useState } from 'react'
import { processStages } from '../../data/process'
import { ProcessStep } from './ProcessStep'
import './ConsultancyProcess.css'

export function ConsultancyProcess() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <section className="consultancy-process" aria-labelledby="process-title">
      <div className="container consultancy-process__grid">
        <div className="consultancy-process__heading">
          <p className="eyebrow">From intent to illumination</p>
          <h2 id="process-title" className="display-title">Our lighting consultancy process</h2>
          <p>
            One continuous design conversation—from the first reading of a space to the final scene on site.
          </p>
        </div>

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
    </section>
  )
}
