import { Link } from 'react-router-dom'
import { ProductCard } from '../products/ProductCard'
import { products } from '../../data/products'
import './ProductPreview.css'

export function ProductPreview() {
  return (
    <section className="product-preview" aria-labelledby="product-preview-title">
      <div className="container product-preview__header">
        <div>
          <p className="eyebrow">Tools for the design</p>
          <h2 id="product-preview-title" className="display-title">Selected products</h2>
        </div>
        <div>
          <p>We source and specify products for their performance, visual comfort and fit within the wider lighting strategy.</p>
          <Link className="text-link" to="/products">Explore the product library</Link>
        </div>
      </div>
      <div className="product-grid container">
        {products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  )
}
