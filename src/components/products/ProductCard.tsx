import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { EnquiryButton } from './EnquiryButton'
import { ProductVisual } from './ProductVisual'

interface ProductCardProps { product: Product }

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link className="product-card__visual" to={`/products/${product.slug}`}>
        <ProductVisual product={product} />
      </Link>
      <div className="product-card__meta">
        <div>
          <p>{product.category} · {product.id}</p>
          <h2><Link to={`/products/${product.slug}`}>{product.name}</Link></h2>
        </div>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__actions">
          <Link className="product-card__view" to={`/products/${product.slug}`}>View product</Link>
          <EnquiryButton product={product} />
        </div>
      </div>
    </article>
  )
}
