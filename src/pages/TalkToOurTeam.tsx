import { Link } from 'react-router-dom'
import { teamContacts } from '../data/contacts'
import { useCatalogueMotion } from '../lib/catalogue-motion'
import { usePageMeta } from '../lib/page-meta'
import './TalkToOurTeam.css'

export function TalkToOurTeam() {
  const rootRef = useCatalogueMotion('team')
  usePageMeta({ title: 'Talk to Our Team | Anjora Lighting', description: 'Speak with Kirti Nankani for project enquiries or Shraddha Soni for lighting design and consultancy.', canonical: 'https://anjora.lighting/talk-to-our-team', ogType: 'website' })
  return (
    <main ref={rootRef} id="main-content" className="team-page">
      <header className="team-page__intro container">
        <p className="eyebrow" data-catalogue-heading>Talk to Our Team</p>
        <h1 className="display-title" data-catalogue-heading>Let’s bring your<br />lighting vision to life.</h1>
        <p data-catalogue-heading>From your first project enquiry to a considered lighting scheme, connect with the person who can help.</p>
      </header>
      <section className="team-page__contacts container" aria-label="Specialist contacts">
        {teamContacts.map((contact, index) => <article key={contact.email} className="team-contact" data-catalogue-reveal>
          <div className="team-contact__rule" data-catalogue-rule />
          <div className="team-contact__label"><span className="eyebrow">{index === 0 ? 'Project Enquiries' : 'Lighting Design & Consultancy'}</span><span aria-hidden="true">0{index + 1}</span></div>
          <h2>{contact.name}</h2><p>{contact.role}</p>
          <address><a href={`tel:${contact.telephone}`}><span><small>Call</small>{contact.phone}</span><span aria-hidden="true">↗</span></a><a href={`mailto:${contact.email}`}><span><small>Email</small>{contact.email}</span><span aria-hidden="true">↗</span></a></address>
        </article>)}
      </section>
      <aside className="team-page__closing container"><p>Prefer to share your brief in writing?</p><Link className="text-link" to="/#enquiry">Send a project enquiry ↗</Link></aside>
    </main>
  )
}
