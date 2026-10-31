import { Link } from 'react-router-dom'
import { ProductCard } from '../products/ProductCard'
import { featuredProducts } from '../../data/products'
import './ProductPreview.css'

export function ProductPreview() {
  return (
    <section className="product-preview" aria-labelledby="product-preview-title">
      <div className="container product-preview__header">
        <div>
          <p className="eyebrow">Anjora design practice · Rajasthan</p>
          <h2 id="product-preview-title" className="display-title">Light as an attitude.</h2>
        </div>
        <div>
          <p>Alongside our lighting consultancy, discover bespoke pieces inspired by Rajasthan’s landscapes, heritage and craft. Size, shape and design can be tailored to your project.</p>
          <Link className="text-link" to="/products">Explore the Rajasthan Collection</Link>
        </div>
      </div>
      <div className="product-grid container">
        {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  )
}
