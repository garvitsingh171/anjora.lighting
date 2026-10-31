import type { Product } from '../data/products'

export function getProductEnquiryUrl(product: Product, configurationPage = product.configurations[0]!.sourcePage) {
  return `/?${new URLSearchParams({ product: product.slug, configuration: String(configurationPage) })}#enquiry`
}
