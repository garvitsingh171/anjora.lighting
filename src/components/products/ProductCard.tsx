import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { EnquiryButton } from './EnquiryButton'
import { ProductVisual } from './ProductVisual'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card" data-product={product.slug}>
      <Link className="product-card__main" to={`/products/${product.slug}`} aria-label={`Explore ${product.name}`}>
        <div className="product-card__visual"><ProductVisual product={product} /></div>
        <div className="product-card__meta">
          <p className="product-card__category">{product.collection} Collection</p>
          <h2>{product.name}<span aria-hidden="true">↗</span></h2>
          <p className="product-card__description">{product.subtitle}</p>
        </div>
      </Link>
      <div className="product-card__actions">
        <span>{product.materials.slice(0, 2).join(' / ')}</span>
        <EnquiryButton product={product} />
      </div>
    </article>
  )
}
