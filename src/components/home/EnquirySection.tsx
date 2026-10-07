import { useState } from 'react'
import type { FormEvent } from 'react'
import { getProjectEnquiryUrl } from '../../lib/enquiry'
import './EnquirySection.css'

const projectTypes = [
  'Residential',
  'Hospitality',
  'Commercial',
  'Office',
  'Heritage',
  'Institutional',
  'Other',
]

export function EnquirySection() {
  const [emailOpened, setEmailOpened] = useState(false)

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const url = getProjectEnquiryUrl({
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      projectType: String(form.get('projectType') ?? 'Other'),
      message: String(form.get('message') ?? '').trim(),
    })

    setEmailOpened(true)
    window.location.href = url
  }

  return (
    <section id="enquiry" className="enquiry-section" aria-labelledby="enquiry-title">
      <div className="container enquiry-section__grid">
        <div className="enquiry-section__intro">
          <p className="eyebrow">Start a conversation</p>
          <h2 id="enquiry-title" className="display-title">Have a project in mind?</h2>
          <p>Let’s explore how thoughtful lighting can shape the way your space is seen and experienced.</p>
        </div>

        <form className="enquiry-form" onSubmit={submitEnquiry}>
          <label>
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Phone</span>
            <input name="phone" type="tel" autoComplete="tel" placeholder="Phone number" />
          </label>
          <label>
            <span>Project type</span>
            <select name="projectType" defaultValue="Residential">
              {projectTypes.map((projectType) => <option key={projectType}>{projectType}</option>)}
            </select>
          </label>
          <label className="enquiry-form__message">
            <span>Tell us about your project</span>
            <textarea name="message" rows={3} placeholder="Location, scope, timeline and what you would like the lighting to achieve" required />
          </label>
          <div className="enquiry-form__submit">
            <p aria-live="polite">
              {emailOpened ? 'Your email application has been opened with the enquiry details.' : 'Submitting opens your email application.'}
            </p>
            <button type="submit">Send enquiry <span aria-hidden="true">↗</span></button>
          </div>
        </form>
      </div>
    </section>
  )
}
