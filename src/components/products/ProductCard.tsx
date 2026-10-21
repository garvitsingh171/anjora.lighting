import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { EnquiryButton } from './EnquiryButton'
import { ProductVisual } from './ProductVisual'

interface ProductCardProps { product: Product }

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link className="product-card__main" to={`/products/${product.slug}`} aria-label={`Explore ${product.name}`}>
        <div className="product-card__visual"><ProductVisual product={product} /></div>
        <div className="product-card__meta">
          <p className="product-card__category">{product.category} · {product.id}</p>
          <h2>{product.name}<span aria-hidden="true">↗</span></h2>
          <p className="product-card__description">{product.description}</p>
        </div>
      </Link>
      <div className="product-card__actions">
        <EnquiryButton product={product} />
      </div>
    </article>
  )
}
