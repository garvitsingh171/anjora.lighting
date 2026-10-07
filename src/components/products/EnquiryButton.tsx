import type { Product } from '../../data/products'
import { getProductEnquiryUrl } from '../../lib/enquiry'

interface EnquiryButtonProps {
  product: Product
  className?: string
  label?: string
}

export function EnquiryButton({ product, className = '', label = 'Enquire' }: EnquiryButtonProps) {
  return (
    <a className={`enquiry-button ${className}`.trim()} href={getProductEnquiryUrl(product)}>
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  )
}
