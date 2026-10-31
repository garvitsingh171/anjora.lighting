import type { ProductCategory, ProductFilter } from '../../data/products'
export type { ProductFilter } from '../../data/products'

interface ProductFiltersProps {
  categories: ProductCategory[]
  active: ProductFilter
  onChange: (category: ProductFilter) => void
}

export function ProductFilters({ categories, active, onChange }: ProductFiltersProps) {
  return (
    <div className="product-filters" role="group" aria-label="Discover products by collection or material">
      {['All', ...categories].map(category => (
        <button key={category} type="button" aria-pressed={active === category} onClick={() => onChange(category)}>
          {category === 'All' ? 'All Designs' : category}
        </button>
      ))}
    </div>
  )
}
