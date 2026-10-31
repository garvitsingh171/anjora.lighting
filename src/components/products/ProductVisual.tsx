import type { CatalogueImage, Product } from '../../data/products'

interface ProductVisualProps {
  product: Product
  image?: CatalogueImage
  large?: boolean
}

export function ProductVisual({ product, image = product.cover, large = false }: ProductVisualProps) {
  return (
    <figure className={`product-visual product-visual--${image.role}`}>
      <img src={image.src} alt={image.alt} width={image.width} height={image.height}
        loading={large ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  )
}
