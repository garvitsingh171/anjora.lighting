import type { Product } from '../../data/products'
import { ProductCard } from './ProductCard'

interface ProductGridProps { products: Product[] }

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid" aria-live="polite">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
