import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { EnquiryButton } from '../components/products/EnquiryButton'
import { ProductCard } from '../components/products/ProductCard'
import { ProductVisual } from '../components/products/ProductVisual'
import { getProductBySlug, getProductConfiguration, legacyProductSlugs, products, type Product } from '../data/products'
import { useCatalogueMotion } from '../lib/catalogue-motion'
import { usePageMeta } from '../lib/page-meta'
import './Products.css'

export function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  if (slug && legacyProductSlugs.includes(slug)) return <Navigate to="/products" replace />
  if (!product) return <main id="main-content" className="container product-not-found"><p className="eyebrow">Product not found</p><h1 className="display-title">No matching product</h1><Link className="text-link" to="/products">Explore the Rajasthan Collection ↗</Link></main>
  return <ProductDetailContent key={product.slug} product={product} />
}

function ProductDetailContent({ product }: { product: Product }) {
  const [params, setParams] = useSearchParams()
  const configuration = getProductConfiguration(product, params.get('configuration'))
  const multiple = product.configurations.length > 1
  const selectedImage = multiple ? configuration.image : product.cover
  const gallery = [product.cover, ...product.gallery].filter(image => image.path !== selectedImage.path &&
    (!multiple || image.configurationPage === configuration.sourcePage))
  const rootRef = useCatalogueMotion(`${product.slug}:${configuration.sourcePage}`)
  usePageMeta({ title: `${product.name} | Rajasthan Collection | Anjora Lighting`, description: product.introduction, canonical: `https://anjora.lighting/products/${product.slug}`, image: new URL(product.cover.src, 'https://anjora.lighting').href, ogType: 'website' })
  const related = products.filter(candidate => candidate.slug !== product.slug)
    .sort((a, b) => b.materials.filter(material => product.materials.includes(material)).length - a.materials.filter(material => product.materials.includes(material)).length).slice(0, 3)
  const specs = [
    ['Finish', configuration.finish], ['Material', configuration.material], ['Light source', configuration.lightSource], ['Weight', configuration.weight],
  ]

  return (
    <main ref={rootRef} id="main-content" className="product-detail">
      <nav className="product-detail__breadcrumbs container" aria-label="Breadcrumb"><Link to="/products">Rajasthan Collection</Link><span aria-hidden="true">/</span><span>{product.name}</span></nav>
      <section className="product-detail__hero container" aria-labelledby="product-title">
        <div className="product-detail__visual" data-catalogue-heading><ProductVisual product={product} image={selectedImage} large /></div>
        <div className="product-detail__summary" data-catalogue-heading>
          <p className="eyebrow">Anjora · {product.collection} Collection</p>
          <h1 id="product-title" className="display-title">{product.name}</h1>
          <p className="product-detail__subtitle">{product.subtitle}</p>
          <p>{product.introduction}</p>
          {multiple && <label className="configuration-select">Catalogue configuration
            <select value={configuration.sourcePage} onChange={event => { const next = new URLSearchParams(params); next.set('configuration', event.target.value); setParams(next, { preventScrollReset: true }) }}>
              {product.configurations.map(config => <option key={config.sourcePage} value={config.sourcePage}>Catalogue page {config.sourcePage}</option>)}
            </select>
          </label>}
          <EnquiryButton product={product} configurationPage={configuration.sourcePage} label="Enquire about this design" />
          <small>Made for your project. Size, shape and design can be customized.</small>
        </div>
      </section>
      <section className="product-detail__information container" aria-label="Design story and technical specifications">
        <div className="product-detail__story" data-catalogue-reveal>
          <p className="eyebrow">The idea behind the light</p>
          <h2>{product.subtitle}</h2>
          {product.story.length ? product.story.map(story => <p key={story.sourcePage}>{story.text}</p>) : <p>{product.introduction}</p>}
          <p className="product-source">Rajasthan catalogue · pp. {product.sourcePages[0]}–{product.sourcePages.at(-1)}</p>
        </div>
        <div className="product-detail__specifications" data-catalogue-reveal>
          <p className="eyebrow">Technical details · catalogue p. {configuration.sourcePage}</p>
          {multiple && <p className="configuration-note">Each catalogue configuration is shown separately. Names and final configuration details will be confirmed by Anjora.</p>}
          <dl>
            {specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            <div><dt>Dimensions</dt><dd>{configuration.sizes.map(size => <span key={size}>{size}</span>)}</dd></div>
            <div><dt>Customization</dt><dd>{configuration.customization}</dd></div>
          </dl>
          <p className="specification-enquiry">Contact Anjora for specifications, pricing and project suitability.</p>
        </div>
      </section>
      {gallery.length > 0 && <section className="product-detail__gallery container" aria-labelledby="gallery-title">
        <div className="gallery-heading"><p className="eyebrow">A closer look</p><h2 id="gallery-title">Form & atmosphere</h2></div>
        <div className="catalogue-gallery">
          {gallery.map(image => <figure key={image.path} data-catalogue-reveal data-source-page={image.sourcePage} className={`catalogue-gallery__item catalogue-gallery__item--${image.role}`}>
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
            <figcaption><span>{image.caption}</span><span>Catalogue / {image.sourcePage}</span></figcaption>
          </figure>)}
        </div>
      </section>}
      <section className="product-detail__related container" aria-labelledby="related-products-title"><p className="eyebrow">A shared material language</p><h2 id="related-products-title" className="display-title">Continue exploring</h2><div className="product-grid">{related.map(candidate => <ProductCard key={candidate.id} product={candidate} />)}</div></section>
    </main>
  )
}
