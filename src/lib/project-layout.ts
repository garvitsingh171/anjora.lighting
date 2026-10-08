import type { Project } from '../data/projects'

export type ProjectGroupVariant = 'large-left' | 'large-right' | 'full-width' | 'balanced'

export interface EditorialProjectGroup {
  projects: Project[]
  variant: ProjectGroupVariant
}

const groupPattern = ['pair', 'full', 'pair'] as const

function pairVariant(projects: Project[], pairIndex: number): ProjectGroupVariant {
  const [first, second] = projects
  const firstIsPortrait = first?.cover.orientation === 'portrait'
  const secondIsPortrait = second?.cover.orientation === 'portrait'

  if (firstIsPortrait && secondIsPortrait) return 'balanced'
  if (firstIsPortrait) return 'large-right'
  if (secondIsPortrait) return 'large-left'
  return pairIndex % 2 === 0 ? 'large-right' : 'large-left'
}

function takeFullWidthProject(queue: Project[]) {
  if (queue[0]?.cover.orientation !== 'portrait') return queue.shift()

  const landscapeOffset = queue
    .slice(1, 3)
    .findIndex((project) => project.cover.orientation !== 'portrait')

  if (landscapeOffset >= 0) return queue.splice(landscapeOffset + 1, 1)[0]
  return queue.shift()
}

export function createEditorialGroups(projects: Project[]): EditorialProjectGroup[] {
  const queue = [...projects]
  const groups: EditorialProjectGroup[] = []
  let patternIndex = 0
  let pairIndex = 0

  while (queue.length > 0) {
    const step = groupPattern[patternIndex % groupPattern.length]

    if (queue.length === 1) {
      groups.push({ projects: [queue.shift()!], variant: 'full-width' })
    } else if (queue.length === 2 || step === 'pair') {
      const pair = queue.splice(0, 2)
      groups.push({ projects: pair, variant: pairVariant(pair, pairIndex) })
      pairIndex += 1
    } else {
      const project = takeFullWidthProject(queue)
      if (project) groups.push({ projects: [project], variant: 'full-width' })
    }

    patternIndex += 1
  }

  return groups
}
