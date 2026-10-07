import type { Product } from '../data/products'

export const ANJORA_ENQUIRY_EMAIL = 'info@anjora.lighting'

export function getProductEnquiryUrl(product: Product) {
  const subject = `Product Enquiry - ${product.name}`
  const body = [
    'Hello Anjora Lighting,',
    '',
    'I would like to enquire about:',
    '',
    `${product.name} (${product.id})`,
    '',
    'Please share more information regarding specifications, availability and pricing.',
    '',
    'Thank you.',
  ].join('\n')

  return `mailto:${ANJORA_ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export interface ProjectEnquiry {
  name: string
  email: string
  phone: string
  projectType: string
  message: string
}

export function getProjectEnquiryUrl(enquiry: ProjectEnquiry) {
  const subject = 'New Project Enquiry - Anjora Lighting'
  const body = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || 'Not provided'}`,
    `Project Type: ${enquiry.projectType}`,
    '',
    'Message:',
    enquiry.message,
  ].join('\n')

  return `mailto:${ANJORA_ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
