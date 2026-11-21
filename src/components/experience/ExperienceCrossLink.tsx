import { Link } from 'react-router-dom'
import './ExperienceChooser.css'

export function ExperienceCrossLink({ to }: { to: 'products' | 'consultancy' }) {
  return <aside className="experience-crosslink container" aria-label="Explore more of Anjora">
    <div><p className="eyebrow">The other side of Anjora</p><p>{to === 'products' ? 'A space, a story. A piece of its own.' : 'Have a space in mind?'}</p></div>
    <Link className="text-link" to={`/${to}`}>{to === 'products' ? 'Explore lighting products' : 'Explore our consultancy'}</Link>
  </aside>
}
