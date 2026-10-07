import type { Product } from '../../data/products'

interface ProductVisualProps {
  product: Product
  large?: boolean
}

export function ProductVisual({ product, large = false }: ProductVisualProps) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.imageAlt ?? product.name}
        width={large ? 1400 : 800}
        height={large ? 1000 : 800}
        loading={large ? 'eager' : 'lazy'}
      />
    )
  }

  return (
    <div className="product-visual__placeholder" data-large={large} role="img" aria-label={`Product photography pending for ${product.name}`}>
      <div className="product-visual__beam" aria-hidden="true" />
      <span>{product.id}</span>
      <p>Product photography pending</p>
    </div>
  )
}
