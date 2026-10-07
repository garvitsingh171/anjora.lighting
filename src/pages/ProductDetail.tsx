import { Link, useParams } from 'react-router-dom'
import { EnquiryButton } from '../components/products/EnquiryButton'
import { ProductCard } from '../components/products/ProductCard'
import { ProductVisual } from '../components/products/ProductVisual'
import { getProductBySlug, products } from '../data/products'
import './Products.css'

export function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <main id="main-content" className="container product-not-found">
        <p className="eyebrow">Product not found</p>
        <h1 className="display-title">No matching product</h1>
        <Link className="text-link" to="/products">View product library</Link>
      </main>
    )
  }

  const relatedProducts = products
    .filter((candidate) => candidate.slug !== product.slug)
    .filter((candidate) => candidate.category === product.category || candidate.applications.some((application) => product.applications.includes(application)))
    .slice(0, 3)

  if (relatedProducts.length < 3) {
    products.forEach((candidate) => {
      if (candidate.slug !== product.slug && !relatedProducts.includes(candidate) && relatedProducts.length < 3) {
        relatedProducts.push(candidate)
      }
    })
  }

  return (
    <main id="main-content" className="product-detail">
      <div className="product-detail__breadcrumbs container">
        <Link to="/products">Products</Link><span aria-hidden="true">/</span><span>{product.category}</span>
      </div>

      <section className="product-detail__hero container" aria-labelledby="product-title">
        <div className="product-detail__visual"><ProductVisual product={product} large /></div>
        <div className="product-detail__summary">
          <p className="eyebrow">{product.category} · {product.id}</p>
          <h1 id="product-title" className="display-title">{product.name}</h1>
          <p>{product.description}</p>
          <EnquiryButton product={product} label="Enquire about this product" />
          <small>{product.catalogueStatus}</small>
        </div>
      </section>

      <section className="product-detail__information container">
        <div>
          <p className="eyebrow">Applications</p>
          <ul>{product.applications.map((application) => <li key={application}>{application}</li>)}</ul>
        </div>
        <div>
          <p className="eyebrow">Specification framework</p>
          <dl>
            {product.specifications.map((specification) => (
              <div key={specification.label}>
                <dt>{specification.label}</dt>
                <dd>{specification.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="product-detail__related container" aria-labelledby="related-products-title">
        <p className="eyebrow">Continue exploring</p>
        <h2 id="related-products-title" className="display-title">Related products</h2>
        <div className="product-grid">
          {relatedProducts.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)}
        </div>
      </section>
    </main>
  )
}
