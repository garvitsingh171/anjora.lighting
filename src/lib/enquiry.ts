import type { Product } from '../data/products'

export function getProductEnquiryUrl(product: Product) {
  return `/?product=${encodeURIComponent(product.slug)}#enquiry`
}
