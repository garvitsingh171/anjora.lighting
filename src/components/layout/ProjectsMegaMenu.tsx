import { projectCategories, projectCategoryPath, projects } from '../../data/projects'
import { CatalogueMegaMenu, type MegaMenuEntry, type MegaMenuProps } from './CatalogueMegaMenu'

const entries: MegaMenuEntry[] = (['All', ...projectCategories] as const).map(category => {
  const matching = category === 'All' ? projects : projects.filter(project => project.category === category)
  const project = matching.find(project => project.cover.orientation === 'landscape') ?? matching[0]!
  return { category, label: category === 'All' ? 'All Projects' : category, count: matching.length,
    href: projectCategoryPath(category), image: project.cover, title: project.title,
    caption: `${project.category}${project.location ? ` · ${project.location}` : ''}` }
})
export function ProjectsMegaMenu(props: MegaMenuProps) {
  return <CatalogueMegaMenu {...props} kind="projects" heading="Browse our projects" entries={entries} nextLink="/products" note="Spaces shaped by light. Discover the individual stories." />
}
