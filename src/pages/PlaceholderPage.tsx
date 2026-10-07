import { Link } from 'react-router-dom'
import './EditorialPage.css'

interface PlaceholderPageProps { title: string }

const pageContent: Record<string, { eyebrow: string; intro: string; notes: string[] }> = {
  Research: {
    eyebrow: 'Research & technical thinking',
    intro: 'The evidence behind better light: visual comfort, controls, energy, optics and the way people experience space.',
    notes: ['Lighting audits and existing-condition studies', 'Application research and fixture evaluation', 'Control strategy and energy-conscious planning'],
  },
  Journal: {
    eyebrow: 'Ideas from the studio',
    intro: 'Practical guidance and observations for architects, designers and clients making lighting decisions.',
    notes: ['How to plan light before interior work starts', 'Outdoor lighting and environmental protection', 'Lighting scenes for responsive homes and hospitality'],
  },
  'About Anjora': {
    eyebrow: 'Independent consultancy · Jaipur',
    intro: 'Anjora shapes how architecture is read, navigated and felt through light—from early strategy to the final focused scene.',
    notes: ['Consultancy-led and architecture-first', 'Residential, hospitality, workplace and heritage expertise', 'Design, specification, sourcing and execution under one view'],
  },
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const content = pageContent[title] ?? {
    eyebrow: 'Anjora Lighting',
    intro: 'Architectural lighting consultancy shaped around the needs of each project.',
    notes: [],
  }

  return (
    <main id="main-content" className="editorial-page">
      <header className="editorial-page__header container">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 className="display-title">{title}</h1>
        <p>{content.intro}</p>
      </header>
      <section className="editorial-page__body container">
        <p className="eyebrow">Areas of focus</p>
        <ol>
          {content.notes.map((note, index) => (
            <li key={note}><span>0{index + 1}</span><p>{note}</p></li>
          ))}
        </ol>
        <div>
          <a className="text-link" href="mailto:info@anjora.lighting?subject=Anjora%20Lighting%20Enquiry">Speak with the studio</a>
          <Link className="text-link" to="/">Return home</Link>
        </div>
      </section>
    </main>
  )
}
