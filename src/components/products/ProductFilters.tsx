import type { ProductCategory } from '../../data/products'

export type ProductFilter = 'All' | ProductCategory

interface ProductFiltersProps {
  categories: ProductCategory[]
  active: ProductFilter
  onChange: (category: ProductFilter) => void
}

export function ProductFilters({ categories, active, onChange }: ProductFiltersProps) {
  return (
    <div className="product-filters" role="group" aria-label="Filter products by category">
      {(['All', ...categories] as ProductFilter[]).map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={active === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
