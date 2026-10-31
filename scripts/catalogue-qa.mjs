import assert from 'node:assert/strict'
import { mkdir, readFile, access } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const output = '/tmp/anjora-catalogue-qa'
await mkdir(output, { recursive: true })
const catalogue = JSON.parse(await readFile('src/data/rajasthan.json', 'utf8'))
const raw = JSON.parse(await readFile('docs/catalogue/catalog.raw.json', 'utf8'))
const expected = [
  ['Sunehri Dhara',4,8,[5]], ['Falpushpa',9,12,[10]], ['Abhaas',13,16,[14]], ['Peet Vrinda',17,19,[18]], ['CHHEEN',20,23,[21]],
  ['Maru Bel',24,27,[25]], ['CHIDKOLI',28,31,[29]], ['Kaag',32,35,[33]], ['Shilora',36,39,[37]], ['Atki badli',40,43,[41]],
  ['Shilpstambh',44,49,[45]], ['Dhwani stambh',50,56,[51,54,55,56]], ['Vrikshamani',57,60,[58]], ['MINAR',61,66,[62]],
  ['Kankad',67,70,[68]], ['PHOG',71,76,[72,73,75]], ['Imlika',77,80,[78]], ['Meghchhatra',81,84,[82]],
]
assert.equal(catalogue.length, 18)
assert.equal(new Set(catalogue.map(p => p.slug)).size, 18)
assert.equal(raw.products.length, 20)
assert.equal(raw.products.filter(p => p.slug.startsWith('unidentified')).length, 2)
for (const [index, product] of catalogue.entries()) {
  const [name, start, end, pages] = expected[index]
  assert.equal(product.name, name)
  assert.deepEqual(product.sourcePages, Array.from({ length: end - start + 1 }, (_, i) => start + i))
  assert.deepEqual(product.configurations.map(c => c.sourcePage), pages)
  const source = raw.products.find(p => p.slug === product.slug)
  assert(!JSON.stringify(product.story).includes('Luma Birds'))
  if (product.slug === 'minar') assert(!/branching|woodwork/.test(JSON.stringify(product.story)))
  assert(!('sku' in product || 'price' in product || 'availability' in product))
  const images = [product.cover, ...product.gallery]
  assert.equal(new Set(images.map(i => i.path)).size, images.length)
  for (const image of images) {
    assert(image.path.startsWith(`${product.slug}/`))
    assert(product.sourcePages.includes(image.sourcePage))
    await access(`src/assets/products/rajasthan/${image.path}`)
  }
  for (const configuration of product.configurations) {
    const original = source.technicalVariants.find(v => v.catalogPage === configuration.sourcePage)
    assert.equal(configuration.finish, original.finish)
    assert.equal(configuration.material, configuration.sourcePage === 55 ? 'Ceramic, Glass and “meta” (source incomplete; please confirm)' : original.material)
    assert.equal(configuration.lightSource, original.lightSource.replace('Blub', 'Bulb'))
    assert.equal(configuration.weight, original.weight.replace('Kg','kg').replace('(per pcs)','per piece'))
    assert.deepEqual(configuration.sizes, original.sizes.map(s => s.replace(/^Size\s*:\s*/, '').replace('2100mm','2100 mm')))
    assert.equal(configuration.image.sourcePage, configuration.sourcePage)
    assert.equal(configuration.customization, original.customizableStatement)
  }
}
console.log('Data: all 18 designs, 23 configurations, exact source fields, pages and image associations passed.')

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const errors = []
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text()) })
let submissions = []
await page.route('https://api.web3forms.com/**', async route => {
  submissions.push(route.request().postDataJSON())
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
})
const go = async path => { await page.goto(`${base}${path}`); await page.locator('main h1').waitFor({ state: 'visible' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(750) }
const menuState = async kind => page.locator(`#${kind}-mega-menu`).getAttribute('aria-hidden')
async function productCount(expected) {
  await page.waitForFunction(count => document.querySelectorAll('.product-card').length === count, expected)
  assert.equal(await page.locator('.product-card').count(), expected)
}
async function imagesValid() {
  await page.locator('main img').evaluateAll(async images => {
    await Promise.all(images.map(image => { image.loading = 'eager'; return image.decode().catch(() => {}) }))
  })
  assert.equal(await page.locator('main img').evaluateAll(images => images.filter(image => !image.naturalWidth).length), 0)
}
try {
  await go('/products')
  await productCount(18)
  await imagesValid()
  const productsTrigger = page.locator('.products-nav-trigger')
  const projectsTrigger = page.locator('.projects-nav-trigger')
  const menu = page.locator('#products-mega-menu')
  await productsTrigger.hover(); await page.waitForTimeout(500)
  assert.equal(await menuState('products'), 'false')
  assert.equal(await menuState('projects'), 'true')
  const bounds = await productsTrigger.boundingBox()
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height + 14)
  await page.waitForTimeout(350)
  assert.equal(await menuState('products'), 'false', 'hover bridge')
  for (const category of ['Glass','Alabaster','Wood & ceramic','Jute & leather']) await menu.locator(`[data-category="${category}"]`).hover()
  await page.waitForTimeout(450)
  assert.equal(await menu.locator('[data-preview="Jute & leather"]').evaluate(el => Number(getComputedStyle(el).opacity)), 1)
  assert((await menu.locator('[data-preview="Jute & leather"] img').getAttribute('src')).includes('sunehri-dhara'))
  await page.screenshot({ path: `${output}/products-menu-light.png` })
  await projectsTrigger.hover(); await productsTrigger.hover(); await page.waitForTimeout(500)
  assert.equal(await menuState('projects'), 'true'); assert.equal(await menuState('products'), 'false')
  assert.equal(await page.locator('.site-header').evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)')
  await page.keyboard.press('Escape'); await page.waitForTimeout(250)
  assert.equal(await menuState('products'), 'true')
  assert.equal(await page.locator('[aria-controls="products-mega-menu"]').evaluate(el => el === document.activeElement), true)
  await page.keyboard.press('Space'); await page.waitForTimeout(450)
  assert.equal(await menuState('products'), 'false')
  await page.keyboard.press('Tab')
  assert.equal(await page.getByRole('button', { name: 'Close products menu' }).evaluate(el => el === document.activeElement), true)
  await menu.locator('a').last().focus(); await page.keyboard.press('Tab')
  assert.equal(await page.locator('.desktop-nav a[href="/research"]').evaluate(el => el === document.activeElement), true)
  assert.equal(await menuState('products'), 'true')
  await productsTrigger.locator('a').focus(); await page.keyboard.press('ArrowDown')
  assert.equal(await menu.locator('a').first().evaluate(el => el === document.activeElement), true)
  await page.mouse.click(10, 850); assert.equal(await menuState('products'), 'true')
  await productsTrigger.hover(); await menu.locator('[data-category="Glass"]').click()
  assert.equal(new URL(page.url()).searchParams.get('category'), 'Glass')
  const glassCount = catalogue.filter(p => p.materials.includes('Glass')).length
  await productCount(glassCount)
  await page.reload(); await productCount(glassCount)
  await page.getByRole('button', { name: 'Alabaster', exact: true }).click()
  assert.equal(new URL(page.url()).searchParams.get('category'), 'Alabaster')
  await page.goBack(); await productCount(glassCount)
  await page.goForward(); assert.equal(new URL(page.url()).searchParams.get('category'), 'Alabaster')
  await go('/products?category=invalid')
  await productCount(18)
  await page.getByRole('searchbox').fill('brass')
  assert((await page.locator('.product-card').count()) > 0)
  await page.reload(); assert.equal(await page.getByRole('searchbox').inputValue(), 'brass')
  await page.getByRole('searchbox').fill('no-matching-design')
  await productCount(0)
  await page.getByRole('button', { name: 'View all designs' }).click()
  await productCount(18)
  console.log('Navigation: shared menus, rapid previews, focus, Escape, Space, outside click, filters, refresh, history and search passed.')

  for (const product of catalogue) {
    await go(`/products/${product.slug}`)
    assert.equal(await page.locator('#product-title').innerText(), product.name)
    assert.equal(await page.locator('.product-detail__specifications dl').locator('div').count(), 6)
    assert(!(await page.locator('main').innerText()).includes(product.id), 'Internal key is not a SKU')
    await imagesValid()
    for (const config of product.configurations) {
      if (product.configurations.length > 1) await page.locator('.configuration-select select').selectOption(String(config.sourcePage))
      await page.waitForFunction(number => document.querySelector('.product-detail__specifications .eyebrow')?.textContent.includes(`p. ${number}`), config.sourcePage)
      const specs = await page.locator('.product-detail__specifications').innerText()
      assert(specs.includes(config.finish) && specs.includes(config.weight) && specs.includes(config.material))
      for (const size of config.sizes) assert(specs.includes(size))
      if (product.configurations.length > 1) {
        assert((await page.locator('.product-detail__visual img').getAttribute('src')).includes(config.image.path))
        assert.equal(await page.locator('.catalogue-gallery__item').count(), [product.cover,...product.gallery].filter(image => image.configurationPage === config.sourcePage && image.path !== config.image.path).length)
      }
      const enquiry = new URL(await page.locator('.product-detail__summary .enquiry-button').getAttribute('href'), base)
      assert.equal(enquiry.searchParams.get('product'), product.slug)
      assert.equal(enquiry.searchParams.get('configuration'), String(config.sourcePage))
    }
    for (const href of await page.locator('.product-detail__related .product-card__main').evaluateAll(links => links.map(a => a.getAttribute('href')))) assert(catalogue.some(p => href === `/products/${p.slug}`))
  }
  await go('/products/phog?configuration=75')
  await page.locator('.product-detail__summary .enquiry-button').click()
  await page.locator('textarea[name="message"]').waitFor()
  const message = await page.locator('textarea[name="message"]').inputValue()
  assert(message.includes('PHOG') && message.includes('Rajasthan') && message.includes('75'))
  assert.equal(submissions.length, 0)
  await page.locator('input[name="name"]').fill('QA Visitor')
  await page.locator('input[name="email"]').fill('qa@example.com')
  await page.getByRole('button', { name: /send enquiry/i }).click()
  await page.getByText('Your enquiry was accepted.').waitFor()
  assert.equal(submissions.length, 1)
  assert(submissions[0].subject.includes('PHOG') && submissions[0].subject.includes('75'))
  assert(submissions[0].message.includes('Rajasthan') && submissions[0].message.includes('75'))
  await page.reload(); assert((await page.locator('textarea[name="message"]').inputValue()).includes('75'))
  await go('/products/recessed-downlight-type-01'); assert.equal(new URL(page.url()).pathname, '/products')
  await go('/products/does-not-exist'); assert(await page.getByText('No matching product').isVisible())
  await go('/products/phog?configuration=invalid'); assert.equal(await page.locator('.configuration-select select').inputValue(), '72')
  console.log('Catalogue: every detail route, specifications, variants, related links and mocked contextual enquiry passed.')

  await go('/talk-to-our-team')
  for (const [name, phone, email] of [['Kirti Nankani','+919116668039','kirti@anjora.lighting'],['Shraddha Soni','+918619527505','shraddha@anjora.lighting']]) {
    assert(await page.getByRole('heading', { name, exact: true }).isVisible())
    assert.equal(await page.locator(`main a[href="tel:${phone}"]`).count(), 1)
    assert.equal(await page.locator(`main a[href="mailto:${email}"]`).count(), 1)
    assert(!(await page.locator('footer').innerText()).includes(name))
  }
  assert.equal(await page.locator('footer a[href="/talk-to-our-team"]').count(), 1)
  assert.equal(await page.locator('.site-header a[href="/talk-to-our-team"]').count(), 0)
  assert.equal(await page.locator('footer a[href="tel:+919929571272"]').count(), 1)
  assert.equal(await page.locator('footer a[href="https://www.linkedin.com/company/anjora-lighting"]').count(), 1)

  // Verify animation cleanup over SPA navigation and filter changes.
  const counts = []
  for (let pass = 0; pass < 3; pass++) {
    await page.locator('footer a[href="/products"]').evaluate(el => el.click())
    await page.waitForTimeout(750)
    counts.push(await page.evaluate(async () => (await import('/src/lib/gsap.ts')).ScrollTrigger.getAll().length))
    await page.locator('.product-card__main').first().click()
    await page.locator('footer a[href="/talk-to-our-team"]').evaluate(el => el.click())
  }
  assert(Math.max(...counts) - Math.min(...counts) <= 1, `ScrollTrigger counts: ${counts}`)
  console.log(`Team and motion: contact routes and links passed; stable catalogue ScrollTriggers ${counts}.`)

  for (const theme of ['light','dark']) {
    await page.evaluate(value => localStorage.setItem('anjora-theme', value), theme)
    for (const width of [1440,1024,768,430,375]) {
      await page.setViewportSize({ width, height: 900 })
      for (const path of ['/products','/products/sunehri-dhara','/products/dhwani-stambh?configuration=55','/products/phog?configuration=75','/talk-to-our-team']) {
        await go(path)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `overflow: ${theme}/${width}/${path}`)
        assert(await page.locator('h1').isVisible())
        await page.screenshot({ path: `${output}/${theme}-${width}-${path.split('?')[0].split('/').at(-1)}.png` })
        if (width === 1440 && path === '/products') {
          await page.locator('#designs').scrollIntoViewIfNeeded(); await page.waitForTimeout(650)
          await page.screenshot({ path: `${output}/${theme}-grid.png` })
          await page.locator('.products-nav-trigger').hover(); await page.waitForTimeout(500)
          await page.screenshot({ path: `${output}/${theme}-menu.png` })
          const productBg = await page.locator('.products-nav-trigger').evaluate(el => getComputedStyle(el).backgroundColor)
          await page.locator('.projects-nav-trigger').hover(); await page.waitForTimeout(500)
          assert.equal(await page.locator('.projects-nav-trigger').evaluate(el => getComputedStyle(el).backgroundColor), productBg)
        }
      }
      if (width <= 768) {
        await page.getByRole('button', { name: 'Open menu', exact: true }).click()
        await page.getByRole('button', { name: 'Products', exact: true }).click()
        assert(await page.locator('#mobile-product-categories').isVisible())
        await page.screenshot({ path: `${output}/${theme}-mobile-menu-${width}.png` })
        await page.locator('#mobile-product-categories a').filter({ hasText: /^Alabaster$/ }).click()
        assert.equal(new URL(page.url()).searchParams.get('category'), 'Alabaster')
        await page.waitForFunction(() => !document.body.classList.contains('menu-open'))
        assert.equal(await page.evaluate(() => document.body.classList.contains('menu-open')), false)
        await page.getByRole('button', { name: 'Open menu', exact: true }).click()
        await page.getByRole('button', { name: 'Projects', exact: true }).click()
        assert(await page.locator('#mobile-project-categories').isVisible())
        await page.keyboard.press('Escape')
      }
      console.log(`Visual checks: ${theme} ${width}px passed.`)
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width:1440, height:900 })
  for (const path of ['/products','/products/chheen','/talk-to-our-team']) {
    await go(path)
    assert.equal(await page.locator('[data-catalogue-heading]').evaluateAll(elements => elements.some(el => Number(getComputedStyle(el).opacity) < 1)), false)
  }
  assert.deepEqual(errors, [])
  console.log(`Catalogue QA passed. Screenshots: ${output}`)
} finally { await browser.close() }
