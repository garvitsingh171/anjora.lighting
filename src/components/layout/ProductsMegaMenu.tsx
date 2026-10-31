import { productCategories, productCategoryPath, productMatchesCategory, products } from '../../data/products'
import { CatalogueMegaMenu, type MegaMenuEntry, type MegaMenuProps } from './CatalogueMegaMenu'

const previewSlugs: Record<string, string> = { All: 'chheen', 'Rajasthan Collection': 'meghchhatra', Glass: 'falpushpa', Metal: 'maru-bel', Alabaster: 'peet-vrinda', 'Jute & leather': 'sunehri-dhara', 'Wood & ceramic': 'dhwani-stambh' }
const entries: MegaMenuEntry[] = ['All', ...productCategories].map(category => {
  const matching = products.filter(product => productMatchesCategory(product, category))
  const product = matching.find(product => product.slug === previewSlugs[category]) ?? matching[0]!
  return { category, label: category === 'All' ? 'All Products' : category, count: matching.length,
    href: productCategoryPath(category), image: product.cover, title: product.name, caption: product.subtitle }
})
export function ProductsMegaMenu(props: MegaMenuProps) {
  return <CatalogueMegaMenu {...props} kind="products" heading="Explore our collection" entries={entries} nextLink="/research" note="Discover Rajasthan through its materials. Bespoke pieces, considered for your space." />
}
