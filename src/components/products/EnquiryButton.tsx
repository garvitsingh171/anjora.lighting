import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { getProductEnquiryUrl } from '../../lib/enquiry'

interface EnquiryButtonProps {
  product: Product
  className?: string
  label?: string
}

export function EnquiryButton({ product, className = '', label = 'Enquire' }: EnquiryButtonProps) {
  return (
    <Link className={`enquiry-button ${className}`.trim()} to={getProductEnquiryUrl(product)} aria-label={`${label}: ${product.name}`}>
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </Link>
  )
}
