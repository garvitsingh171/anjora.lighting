export const productCategories = [
  'Architectural',
  'Indoor',
  'Outdoor',
  'Linear',
  'Track',
  'Downlights',
  'Decorative',
  'Landscape',
] as const

export type ProductCategory = (typeof productCategories)[number]

export interface ProductSpecification {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  description: string
  applications: string[]
  specifications: ProductSpecification[]
  image?: string
  imageAlt?: string
  datasheet?: string
  catalogueStatus: 'Pending client confirmation'
}

export const products: Product[] = [
  {
    id: 'DL-01',
    slug: 'recessed-downlight-type-01',
    name: 'Recessed Downlight — Type 01',
    category: 'Downlights',
    description: 'A compact architectural downlight framework for glare-conscious ambient and accent applications.',
    applications: ['Residences', 'Hospitality', 'Retail'],
    specifications: [
      { label: 'Optics', value: 'Project-specific' },
      { label: 'CCT / CRI', value: 'Selected to brief' },
      { label: 'Control', value: 'On request' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
  {
    id: 'DL-02',
    slug: 'trimless-downlight-type-02',
    name: 'Trimless Downlight — Type 02',
    category: 'Architectural',
    description: 'A minimal trimless ceiling aperture intended for quiet, integrated architectural lighting schemes.',
    applications: ['Luxury residences', 'Museums', 'Boutique hospitality'],
    specifications: [
      { label: 'Installation', value: 'Trimless recessed' },
      { label: 'Beam', value: 'To be specified' },
      { label: 'Finish', value: 'Project-specific' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
  {
    id: 'LN-01',
    slug: 'linear-system-type-01',
    name: 'Linear System — Type 01',
    category: 'Linear',
    description: 'A continuous linear system framework for concealed details, guidance and precise architectural rhythm.',
    applications: ['Offices', 'Hospitality', 'Retail'],
    specifications: [
      { label: 'Configuration', value: 'Surface / recessed' },
      { label: 'Length', value: 'Configured to project' },
      { label: 'Dimming', value: 'On request' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
  {
    id: 'TR-01',
    slug: 'track-spotlight-type-01',
    name: 'Track Spotlight — Type 01',
    category: 'Track',
    description: 'An adjustable spotlight framework for flexible accents, displays and evolving spatial programmes.',
    applications: ['Galleries', 'Retail', 'Hospitality'],
    specifications: [
      { label: 'Mounting', value: 'Track mounted' },
      { label: 'Optics', value: 'Selected to application' },
      { label: 'Accessories', value: 'On request' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
  {
    id: 'IN-01',
    slug: 'interior-pendant-type-01',
    name: 'Interior Pendant — Type 01',
    category: 'Decorative',
    description: 'A decorative pendant placeholder for feature moments coordinated within a wider architectural lighting scheme.',
    applications: ['Dining', 'Lounges', 'Reception spaces'],
    specifications: [
      { label: 'Suspension', value: 'To be coordinated' },
      { label: 'Finish', value: 'Project-specific' },
      { label: 'Light source', value: 'On request' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
  {
    id: 'IN-02',
    slug: 'wall-light-type-01',
    name: 'Wall Light — Type 01',
    category: 'Indoor',
    description: 'A wall-mounted lighting framework for soft vertical illumination and low-glare circulation lighting.',
    applications: ['Corridors', 'Guest rooms', 'Residences'],
    specifications: [
      { label: 'Distribution', value: 'Project-specific' },
      { label: 'Finish', value: 'On request' },
      { label: 'Control', value: 'Selected to scheme' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
  {
    id: 'OD-01',
    slug: 'facade-projector-type-01',
    name: 'Facade Projector — Type 01',
    category: 'Outdoor',
    description: 'An exterior projector framework for controlled architectural accents and facade composition.',
    applications: ['Facades', 'Heritage', 'Public realm'],
    specifications: [
      { label: 'Protection', value: 'To suit application' },
      { label: 'Optics', value: 'Selected to throw' },
      { label: 'Controls', value: 'On request' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
  {
    id: 'LS-01',
    slug: 'landscape-spike-type-01',
    name: 'Landscape Spike — Type 01',
    category: 'Landscape',
    description: 'An adjustable landscape-lighting framework for planting, pathways and architectural garden elements.',
    applications: ['Gardens', 'Resorts', 'Private landscapes'],
    specifications: [
      { label: 'Mounting', value: 'Spike / surface options' },
      { label: 'Beam', value: 'Selected to landscape' },
      { label: 'Protection', value: 'To suit site' },
    ],
    catalogueStatus: 'Pending client confirmation',
  },
]

export function getProductBySlug(slug: string | undefined) {
  return products.find((product) => product.slug === slug)
}
