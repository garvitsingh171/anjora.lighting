import { Link, useSearchParams } from 'react-router-dom'
import { ProductFilters } from '../components/products/ProductFilters'
import { ProductGrid } from '../components/products/ProductGrid'
import { featuredProducts, productCategories, productMatchesCategory, products } from '../data/products'
import { useCatalogueMotion } from '../lib/catalogue-motion'
import { usePageMeta } from '../lib/page-meta'
import './Products.css'

export function Products() {
  const [params, setParams] = useSearchParams()
  const requestedCategory = params.get('category') ?? 'All'
  const active = productCategories.includes(requestedCategory) ? requestedCategory : 'All'
  const query = params.get('q') ?? ''
  const search = query.trim().toLocaleLowerCase()
  const filteredProducts = products.filter(product => productMatchesCategory(product, active) &&
    [product.name, product.collection, ...product.materials, ...product.configurations.flatMap(config => [config.material, config.finish])]
      .join(' ').toLocaleLowerCase().includes(search))
  const rootRef = useCatalogueMotion(`${active}:${search}`)
  const hero = featuredProducts[1]!
  usePageMeta({ title: 'Rajasthan Collection | Anjora Lighting', description: 'Discover 18 bespoke lighting designs inspired by Rajasthan, with catalogue specifications and project-led customization.', canonical: 'https://anjora.lighting/products', ogType: 'website' })
  const update = (key: string, value: string, replace = false) => {
    const next = new URLSearchParams(params)
    if (value && value !== 'All') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace, preventScrollReset: true })
  }

  return (
    <main ref={rootRef} id="main-content" className="products-page">
      <header className="products-page__hero container">
        <div className="collection-heading" data-catalogue-heading>
          <p className="eyebrow">Anjora Lighting · Bespoke by design</p>
          <h1 className="display-title">Rajasthan<span>Collection</span></h1>
          <div className="collection-heading__rule" data-catalogue-rule />
          <p className="collection-heading__statement">Light as an attitude.</p>
          <p className="collection-heading__intro">Bespoke lighting experiences that enhance architecture, elevate ambience, and bring spaces to life.</p>
          <p className="collection-heading__context">From our architectural lighting consultancy, a collection inspired by Rajasthan’s heritage, landscapes and craft.</p>
          <a href="#designs" className="text-link">Discover the 18 designs <span aria-hidden="true">↓</span></a>
        </div>
        <figure className="collection-hero-image" data-catalogue-heading>
          <img src={hero.cover.src} alt={hero.cover.alt} width={hero.cover.width} height={hero.cover.height} fetchPriority="high" />
          <figcaption><span>01 / Rajasthan</span><Link to={`/products/${hero.slug}`}>{hero.name} — {hero.subtitle} ↗</Link></figcaption>
        </figure>
      </header>

      <section id="designs" className="products-page__catalogue container" aria-labelledby="catalogue-title">
        <div className="catalogue-toolbar">
          <div><p className="eyebrow">Form / Material / Light</p><h2 id="catalogue-title">The collection</h2></div>
          <label className="catalogue-search"><span>Search the collection</span><input type="search" name="product-search" value={query} placeholder="Name, material or finish" onChange={event => update('q', event.target.value, true)} /></label>
        </div>
        <ProductFilters categories={productCategories} active={active} onChange={category => update('category', category)} />
        <p className="catalogue-count" role="status">{filteredProducts.length} {filteredProducts.length === 1 ? 'design' : 'designs'}{active !== 'All' ? ` · ${active}` : ''}</p>
        {filteredProducts.length ? <ProductGrid products={filteredProducts} /> : <div className="catalogue-empty"><h3>No designs match your search.</h3><button type="button" onClick={() => setParams({})}>View all designs ↗</button></div>}
        <div className="collection-closing" data-catalogue-reveal>
          <p className="eyebrow">Made around your space</p>
          <h2>Every project has<br />its own expression.</h2>
          <div><p>Size, shape, and design can be customized to project requirements. Our team can help bring the collection into your lighting scheme.</p><Link className="text-link" to="/#enquiry">Discuss your project ↗</Link></div>
        </div>
      </section>
    </main>
  )
}
