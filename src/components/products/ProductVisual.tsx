import type { Product } from '../../data/products'

interface ProductVisualProps {
  product: Product
  large?: boolean
}

export function ProductVisual({ product, large = false }: ProductVisualProps) {
  return (
    <figure className="product-visual">
      <img
        src={product.image}
        alt={product.imageAlt}
        width={1200}
        height={800}
        loading={large ? 'eager' : 'lazy'}
      />
      <figcaption>Illustrative installation · model pending confirmation</figcaption>
    </figure>
  )
}
