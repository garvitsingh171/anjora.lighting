import catalogue from './rajasthan.json'
import { catalogueImages } from './catalogue-images'

export interface CatalogueImage {
  path: string
  src: string
  width: number
  height: number
  sourcePage: number
  role: string
  configurationPage: number | null
  alt: string
  caption: string
}

export interface CatalogueConfiguration {
  sourcePage: number
  finish: string
  material: string
  lightSource: string
  weight: string
  sizes: string[]
  customization: string
  image: CatalogueImage
  reviewStatus: string
}

export interface Product {
  /** Internal application key, never a manufacturer SKU. */
  id: string
  slug: string
  name: string
  collection: string
  subtitle: string
  introduction: string
  introductionPage: number
  story: { text: string; sourcePage: number }[]
  materials: string[]
  cover: CatalogueImage
  gallery: CatalogueImage[]
  configurations: CatalogueConfiguration[]
  customizable: boolean
  sourcePdf: string
  sourcePages: number[]
  reviewStatus: string
  reviewNotes: string[]
}

function resolveImage(image: Omit<CatalogueImage, 'src'>): CatalogueImage {
  const src = catalogueImages[image.path]
  if (!src) throw new Error(`Missing reviewed catalogue image: ${image.path}`)
  return { ...image, src }
}

export const products: Product[] = catalogue.map(product => ({
  ...product,
  cover: resolveImage(product.cover),
  gallery: product.gallery.map(resolveImage),
  configurations: product.configurations.map(configuration => ({ ...configuration, image: resolveImage(configuration.image) })),
}))

// Material discovery is editorial; technical claims remain in source-linked configurations.
export const productCategories = ['Rajasthan Collection', ...new Set(products.flatMap(product => product.materials))]
export type ProductCategory = string
export type ProductFilter = 'All' | ProductCategory
export function productMatchesCategory(product: Product, category: string) {
  return category === 'All' || category === 'Rajasthan Collection' || product.materials.includes(category)
}
export function productCategoryPath(category: ProductFilter) {
  return category === 'All' ? '/products' : `/products?${new URLSearchParams({ category })}`
}
export function getProductBySlug(slug: string | undefined) {
  return products.find(product => product.slug === slug)
}
export function getProductConfiguration(product: Product, value: string | null) {
  return product.configurations.find(configuration => String(configuration.sourcePage) === value) ?? product.configurations[0]!
}
export const featuredProducts = ['sunehri-dhara', 'chheen', 'meghchhatra'].map(slug => getProductBySlug(slug)!)
export const legacyProductSlugs = [
  'recessed-downlight-type-01', 'trimless-downlight-type-02', 'linear-system-type-01', 'track-spotlight-type-01',
  'interior-pendant-type-01', 'wall-light-type-01', 'facade-projector-type-01', 'landscape-spike-type-01',
]
