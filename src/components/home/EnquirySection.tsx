import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { EASE_REVEAL, EASE_UI, prefersReducedMotion } from '../../lib/motion'
import { submitWeb3FormsEnquiry } from '../../lib/web3forms'
import { getProductBySlug, type Product } from '../../data/products'
import atmosphere from '../../assets/projects/rosado/gallery-07.jpg'
import './EnquirySection.css'

const projectTypes = [
  'Residential',
  'Hospitality',
  'Commercial',
  'Office',
  'Heritage',
  'Institutional',
  'Retail',
  'Landscape',
  'Other',
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const requestTimeout = 12_000

export type EnquiryFormData = {
  name: string
  email: string
  phone: string
  projectType: string
  message: string
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'
type FormErrors = Partial<Record<keyof EnquiryFormData, string>>

interface EnquirySectionProps {
  source?: string
  projectName?: string
}

const initialFormData: EnquiryFormData = {
  name: '',
  email: '',
  phone: '',
  projectType: 'Residential',
  message: '',
}

function validateForm(formData: EnquiryFormData): FormErrors {
  const errors: FormErrors = {}
  const name = formData.name.trim()
  const email = formData.email.trim()
  const message = formData.message.trim()

  if (!name) errors.name = 'Please enter your name.'
  if (!email) errors.email = 'Please enter your email address.'
  else if (!emailPattern.test(email)) errors.email = 'Please enter a valid email address.'
  if (!message) errors.message = 'Please tell us a little about your project.'
  else if (message.length < 10) errors.message = 'Please enter at least 10 characters.'

  return errors
}

export function EnquirySection(props: EnquirySectionProps) {
  const location = useLocation()
  const selectedProduct = getProductBySlug(new URLSearchParams(location.search).get('product') ?? undefined)
  return <EnquirySectionContent key={`${selectedProduct?.slug ?? 'general'}:${props.projectName ?? ''}`} selectedProduct={selectedProduct} {...props} />
}

function EnquirySectionContent({ source, projectName, selectedProduct }: EnquirySectionProps & { selectedProduct?: Product }) {
  const sectionRef = useRef<HTMLElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const fieldId = useId()
  const submissionRef = useRef<AbortController | null>(null)
  const revealRef = useRef<gsap.core.Timeline | null>(null)
  useEffect(() => () => submissionRef.current?.abort(), [])
  const [formData, setFormData] = useState<EnquiryFormData>(() => ({
    ...initialFormData,
    message: selectedProduct
      ? `I would like to enquire about ${selectedProduct.name} (${selectedProduct.id}), ${selectedProduct.category}. Please share the available specification options for my project.`
      : '',
  }))
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [botcheck, setBotcheck] = useState(false)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    revealRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        once: true,
        fastScrollEnd: true,
        onEnter: (self) => {
          const bounds = sectionRef.current?.getBoundingClientRect()
          if (bounds && bounds.bottom < 0) self.animation?.progress(1)
        },
        onLeave: (self) => self.animation?.progress(1),
      },
    })
      .fromTo('.enquiry-section__atmosphere', { scale: 1.035 }, { scale: 1, duration: 0.8, ease: EASE_REVEAL }, 0)
      .fromTo('.enquiry-section__panel', { y: 20 }, { y: 0, duration: 0.6, ease: EASE_REVEAL }, 0)
      .fromTo('[data-enquiry-heading]', { yPercent: 105 }, { yPercent: 0, duration: 0.65, ease: EASE_REVEAL }, 0)
      .fromTo('.enquiry-section__intro > p', { opacity: 0.4, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 }, 0.05)
      .fromTo('.enquiry-section__line', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: EASE_REVEAL }, 0.1)
      .fromTo('.enquiry-form__field', { opacity: 0.5, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.035, ease: EASE_REVEAL }, 0.12)
  }, { scope: sectionRef })

  useGSAP(
    () => {
      if (status !== 'success' || !successRef.current) return
      if (prefersReducedMotion()) return
      gsap.fromTo(successRef.current, { autoAlpha: 0, y: 10 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: EASE_UI,
      })
    },
    { scope: sectionRef, dependencies: [status] },
  )

  const updateField = (field: keyof EnquiryFormData) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'success' || status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submissionRef.current || status === 'submitting' || status === 'success') return
    if (botcheck) return

    const validationErrors = validateForm(formData)
    setErrors(validationErrors)

    const firstInvalidField = (['name', 'email', 'message'] as const)
      .find((field) => validationErrors[field])
    if (firstInvalidField) {
      window.requestAnimationFrame(() => {
        document.getElementById(`${fieldId}-${firstInvalidField}`)?.focus()
      })
      return
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()
    if (!accessKey) {
      if (import.meta.env.DEV) console.error('Missing VITE_WEB3FORMS_ACCESS_KEY')
      setStatus('error')
      setErrorMessage('Enquiry service is temporarily unavailable. Please try again later.')
      return
    }

    const controller = new AbortController()
    submissionRef.current = controller
    const timeoutId = window.setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), requestTimeout)

    setStatus('submitting')
    setErrorMessage('')

    try {
      await submitWeb3FormsEnquiry({
        access_key: accessKey,
        subject: selectedProduct ? `Product Enquiry: ${selectedProduct.name} (${selectedProduct.id}) | Anjora Lighting` : 'New Website Enquiry | Anjora Lighting',
        from_name: 'Anjora Lighting Website',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        project_type: formData.projectType.trim(),
        message: formData.message.trim(),
        page_url: window.location.href,
        botcheck,
        ...(source || selectedProduct ? { source: selectedProduct ? 'Product Enquiry' : source } : {}),
        ...(projectName ? { interested_project: projectName } : {}),
      }, controller.signal)

      setFormData(initialFormData)
      setBotcheck(false)
      setErrors({})
      setStatus('success')
    } catch (error) {
      if (controller.signal.aborted && controller.signal.reason?.name === 'AbortError') return
      if (import.meta.env.DEV) console.error('Web3Forms enquiry submission failed:', error)
      setStatus('error')
      setErrorMessage("We couldn't send your enquiry right now. Please try again.")
    } finally {
      window.clearTimeout(timeoutId)
      submissionRef.current = null
    }
  }

  const feedback = status === 'success'
    ? (
        <div ref={successRef} className="enquiry-form__feedback enquiry-form__feedback--success">
          <strong>Thank you.</strong>
          <span>Your enquiry was accepted. The Anjora team will be in touch.</span>
        </div>
      )
    : status === 'error'
      ? <p className="enquiry-form__feedback enquiry-form__feedback--error">{errorMessage}</p>
      : <p className="enquiry-form__note">Your details are sent securely to the Anjora team.</p>

  const buttonLabel = status === 'submitting'
    ? 'Sending…'
    : status === 'success'
      ? 'Enquiry sent'
      : status === 'error'
        ? 'Try again'
        : 'Send enquiry'

  return (
    <section ref={sectionRef} id="enquiry" className="enquiry-section" aria-labelledby={`${fieldId}-title`}>
      <img className="enquiry-section__atmosphere" src={atmosphere} alt="" width="1600" height="1091" loading="lazy" aria-hidden="true" />
      <div className="container">
      <div className="enquiry-section__panel enquiry-section__grid">
        <div className="enquiry-section__intro">
          <p className="eyebrow">Start a conversation</p>
          <h2 id={`${fieldId}-title`} className="display-title"><span data-enquiry-heading>Have a project in mind?</span></h2>
          <span className="enquiry-section__line" aria-hidden="true" />
          <p>Let’s explore how thoughtful lighting can shape the way your space is seen and experienced.</p>
          {projectName && <p className="enquiry-section__product">A conversation about <strong>{projectName}</strong></p>}
          {selectedProduct && <p className="enquiry-section__product">Enquiring about <strong>{selectedProduct.name} · {selectedProduct.id}</strong></p>}
        </div>

        <form className="enquiry-form" onSubmit={handleSubmit} onFocusCapture={() => revealRef.current?.progress(1)} noValidate aria-busy={status === 'submitting'}>
          <div className="enquiry-form__field">
            <label htmlFor={`${fieldId}-name`}>Name</label>
            <input
              id={`${fieldId}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={formData.name}
              onChange={updateField('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
              required
            />
            {errors.name && <p id={`${fieldId}-name-error`} className="enquiry-form__field-error">{errors.name}</p>}
          </div>

          <div className="enquiry-form__field">
            <label htmlFor={`${fieldId}-email`}>Email</label>
            <input
              id={`${fieldId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={updateField('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${fieldId}-email-error` : undefined}
              required
            />
            {errors.email && <p id={`${fieldId}-email-error`} className="enquiry-form__field-error">{errors.email}</p>}
          </div>

          <div className="enquiry-form__field">
            <label htmlFor={`${fieldId}-phone`}>Phone</label>
            <input
              id={`${fieldId}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={updateField('phone')}
            />
          </div>

          <div className="enquiry-form__field">
            <label htmlFor={`${fieldId}-project-type`}>Project type</label>
            <select
              id={`${fieldId}-project-type`}
              name="projectType"
              value={formData.projectType}
              onChange={updateField('projectType')}
            >
              {projectTypes.map((projectType) => <option key={projectType}>{projectType}</option>)}
            </select>
          </div>

          <div className="enquiry-form__field enquiry-form__message">
            <label htmlFor={`${fieldId}-message`}>Tell us about your project</label>
            <textarea
              id={`${fieldId}-message`}
              name="message"
              rows={3}
              placeholder="Location, scope, timeline and what you would like the lighting to achieve"
              value={formData.message}
              onChange={updateField('message')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${fieldId}-message-error` : undefined}
              required
            />
            {errors.message && <p id={`${fieldId}-message-error`} className="enquiry-form__field-error">{errors.message}</p>}
          </div>

          <div className="enquiry-form__botcheck" aria-hidden="true">
            <label htmlFor={`${fieldId}-botcheck`}>Leave this field empty</label>
            <input
              id={`${fieldId}-botcheck`}
              name="botcheck"
              type="checkbox"
              tabIndex={-1}
              autoComplete="off"
              checked={botcheck}
              onChange={(event) => setBotcheck(event.target.checked)}
            />
          </div>

          <div className="enquiry-form__submit">
            <div className="enquiry-form__status" aria-live="polite">{feedback}</div>
            <button type="submit" disabled={status === 'submitting' || status === 'success'}>
              {buttonLabel}
              {status !== 'submitting' && <span aria-hidden="true">↗</span>}
            </button>
          </div>
        </form>
      </div>
      </div>
    </section>
  )
}
