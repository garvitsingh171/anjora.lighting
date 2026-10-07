import { useMemo, useState } from 'react'
import { ProductFilters, type ProductFilter } from '../components/products/ProductFilters'
import { ProductGrid } from '../components/products/ProductGrid'
import { productCategories, products } from '../data/products'
import './Products.css'

export function Products() {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('All')
  const filteredProducts = useMemo(
    () => activeFilter === 'All' ? products : products.filter((product) => product.category === activeFilter),
    [activeFilter],
  )

  return (
    <main id="main-content" className="products-page">
      <header className="products-page__hero container">
        <p className="eyebrow">Specified around your project</p>
        <div>
          <h1 className="display-title">Product library</h1>
          <p>
            Products support the design—not the other way around. Anjora specifies optics, output, finish and controls around the architecture.
          </p>
        </div>
        <p className="products-page__notice">
          Catalogue names, imagery and final technical data are awaiting client confirmation. Enquiries route directly to the Anjora team.
        </p>
      </header>

      <section className="products-page__catalogue container" aria-label="Product catalogue">
        <ProductFilters categories={[...productCategories]} active={activeFilter} onChange={setActiveFilter} />
        <ProductGrid products={filteredProducts} />
      </section>
    </main>
  )
}
