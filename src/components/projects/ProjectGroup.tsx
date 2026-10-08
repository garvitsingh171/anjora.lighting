import type { EditorialProjectGroup, ProjectGroupVariant } from '../../lib/project-layout'
import { ProjectCard } from './ProjectCard'
import type { ProjectTileSize } from './ProjectCard'

function tileSize(variant: ProjectGroupVariant, index: number): ProjectTileSize {
  if (variant === 'full-width') return 'full'
  if (variant === 'balanced') return 'balanced'
  if (variant === 'large-left') return index === 0 ? 'large' : 'compact'
  return index === 1 ? 'large' : 'compact'
}

export function ProjectGroup({ group, index }: { group: EditorialProjectGroup; index: number }) {
  return (
    <div className={`project-group project-group--${group.variant}`} data-project-group>
      {group.projects.map((project, projectIndex) => (
        <ProjectCard
          key={project.slug}
          project={project}
          size={tileSize(group.variant, projectIndex)}
          priority={index === 0}
          parallax={group.variant === 'full-width'}
        />
      ))}
    </div>
  )
}
