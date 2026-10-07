import type { ProjectCategory } from '../../data/projects'

export type ProjectFilter = 'All' | ProjectCategory

interface ProjectFiltersProps {
  active: ProjectFilter
  categories: readonly ProjectCategory[]
  onChange: (category: ProjectFilter) => void
}

export function ProjectFilters({ active, categories, onChange }: ProjectFiltersProps) {
  const filters: ProjectFilter[] = ['All', ...categories]

  return (
    <div className="project-filters" aria-label="Filter projects by category">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={filter === active ? 'is-active' : undefined}
          aria-pressed={filter === active}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
