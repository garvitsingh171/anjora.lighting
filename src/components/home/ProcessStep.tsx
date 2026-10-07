import type { ProcessStage } from '../../data/process'

interface ProcessStepProps {
  stage: ProcessStage
  expanded: boolean
  onActivate: () => void
}

export function ProcessStep({ stage, expanded, onActivate }: ProcessStepProps) {
  const contentId = `process-${stage.number}`

  return (
    <li className="process-step" data-expanded={expanded}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={onActivate}
        onMouseEnter={onActivate}
        onFocus={onActivate}
      >
        <span className="process-step__number">{stage.number}</span>
        <span className="process-step__main">
          <span className="process-step__title">{stage.title}</span>
          <span
            id={contentId}
            className="process-step__reveal"
            aria-hidden={!expanded}
          >
            <span>{stage.description}</span>
          </span>
        </span>
        <span className="process-step__mark" aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
    </li>
  )
}
