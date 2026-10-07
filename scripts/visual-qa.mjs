import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const outputDirectory = '/tmp/anjora-visual-qa'
const errors = []

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})

async function preparePage(page) {
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      errors.push(`console ${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`))
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 })
  await page.evaluate(async () => {
    const timeout = new Promise((resolve) => setTimeout(resolve, 5_000))
    await Promise.race([document.fonts.ready, timeout])
    const images = [...document.images]
    await Promise.race([Promise.all(images.map((image) => image.complete ? undefined : new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true })
      image.addEventListener('error', resolve, { once: true })
    }))), timeout])
  })
}

async function checkHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  if (dimensions.content > dimensions.viewport + 1) {
    errors.push(`${label}: horizontal overflow (${dimensions.content}px content in ${dimensions.viewport}px viewport)`)
  }
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await preparePage(desktop)
await checkHorizontalOverflow(desktop, 'desktop home')
await desktop.screenshot({ path: `${outputDirectory}/hero-desktop.png` })

const servicesPin = desktop.locator('.services__pin')
await servicesPin.scrollIntoViewIfNeeded()
await desktop.waitForTimeout(400)
await desktop.screenshot({ path: `${outputDirectory}/services-start.png` })
await desktop.mouse.wheel(0, 1200)
await desktop.waitForTimeout(500)
await desktop.screenshot({ path: `${outputDirectory}/services-mid.png` })
await desktop.mouse.wheel(0, 2300)
await desktop.waitForTimeout(500)
await desktop.screenshot({ path: `${outputDirectory}/services-end.png` })

await desktop.emulateMedia({ reducedMotion: 'reduce' })
await desktop.reload({ waitUntil: 'domcontentloaded' })
for (const [selector, name] of [
  ['.services__intro', 'services-intro'],
  ['.curated-works', 'curated-works'],
  ['.consultancy-process', 'process'],
  ['.product-preview', 'product-preview'],
  ['.enquiry-section', 'enquiry'],
  ['.site-footer', 'footer'],
]) {
  await desktop.locator(selector).screenshot({ path: `${outputDirectory}/${name}.png` })
}

await desktop.goto(`${baseUrl}/products`, { waitUntil: 'domcontentloaded' })
await desktop.locator('.products-page__hero').screenshot({ path: `${outputDirectory}/products-hero.png` })
await desktop.locator('.product-card').first().screenshot({ path: `${outputDirectory}/product-card.png` })

await desktop.goto(`${baseUrl}/products/recessed-downlight-type-01`, { waitUntil: 'domcontentloaded' })
await desktop.locator('.product-detail__hero').screenshot({ path: `${outputDirectory}/product-detail.png` })

await desktop.goto(`${baseUrl}/projects`, { waitUntil: 'domcontentloaded' })
await checkHorizontalOverflow(desktop, 'desktop projects')
await desktop.locator('.projects-hero').screenshot({ path: `${outputDirectory}/projects-hero.png` })
await desktop.locator('.featured-project').screenshot({ path: `${outputDirectory}/projects-featured.png` })
const projectCount = await desktop.locator('.project-card').count() + await desktop.locator('.featured-project').count()
if (projectCount !== 20) errors.push(`projects inventory rendered ${projectCount} entries instead of 20`)
const projectHrefs = await desktop.locator('a[href^="/projects/"]').evaluateAll((links) => (
  [...new Set(links.map((link) => link.getAttribute('href')).filter(Boolean))]
))
if (projectHrefs.length !== 20) errors.push(`project archive exposed ${projectHrefs.length} unique routes instead of 20`)

for (const href of projectHrefs) {
  await desktop.goto(`${baseUrl}${href}`, { waitUntil: 'domcontentloaded' })
  await desktop.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await desktop.waitForTimeout(120)
  const routeState = await desktop.evaluate(async () => {
    await Promise.race([
      Promise.all([...document.images].map((image) => image.complete ? undefined : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      }))),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ])
    return {
      detail: Boolean(document.querySelector('.project-detail')),
      broken: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
    }
  })
  if (!routeState.detail) errors.push(`${href}: direct route did not render a project detail`)
  if (routeState.broken.length) errors.push(`${href}: broken images: ${routeState.broken.join(', ')}`)
}

await desktop.goto(`${baseUrl}/projects`, { waitUntil: 'domcontentloaded' })

for (const [filter, expected] of Object.entries({ Clubs: 10, Heritage: 1, Commercial: 1, Facade: 3, Gym: 1, Office: 3, Theatre: 1 })) {
  await desktop.getByRole('button', { name: filter, exact: true }).click()
  await desktop.waitForTimeout(50)
  const filteredCount = await desktop.locator('.project-card').count() + await desktop.locator('.featured-project').count()
  if (filteredCount !== expected) errors.push(`${filter} filter returned ${filteredCount} projects instead of ${expected}`)
}

await desktop.getByRole('button', { name: 'Office', exact: true }).click()
await desktop.waitForTimeout(250)
const officeCategories = await desktop.locator('.project-card__caption > div > p').allTextContents()
if (officeCategories.length !== 3 || officeCategories.some((category) => category !== 'Office')) {
  errors.push(`Office filter returned unexpected categories: ${officeCategories.join(', ')}`)
}
const officeWidths = await desktop.locator('.project-card').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().width))
if (officeWidths.some((width) => width < 300)) errors.push(`Office filter produced a collapsed card: ${officeWidths.join(', ')}`)
await desktop.locator('.project-grid').screenshot({ path: `${outputDirectory}/projects-filter-office.png` })

await desktop.getByRole('button', { name: 'All', exact: true }).click()
await desktop.waitForTimeout(150)
await desktop.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
await desktop.locator('.project-card').first().locator('a').click()
await desktop.waitForLoadState('domcontentloaded')
await desktop.waitForTimeout(100)
if (!desktop.url().includes('/projects/kingsman')) errors.push('project card did not open its detail route')
const projectScrollTop = await desktop.evaluate(() => window.scrollY)
if (projectScrollTop > 2) errors.push(`project detail did not reset scroll position (${projectScrollTop}px)`)
await desktop.goBack({ waitUntil: 'domcontentloaded' })
if (!desktop.url().endsWith('/projects')) errors.push('browser back did not return to the project archive')
await desktop.goForward({ waitUntil: 'domcontentloaded' })
if (!desktop.url().includes('/projects/kingsman')) errors.push('browser forward did not restore the project detail route')

await desktop.goto(`${baseUrl}/projects/rosado`, { waitUntil: 'domcontentloaded' })
await checkHorizontalOverflow(desktop, 'desktop project detail')
await desktop.locator('.project-detail__hero').screenshot({ path: `${outputDirectory}/project-detail-hero.png` })
await desktop.locator('.project-gallery').screenshot({ path: `${outputDirectory}/project-detail-gallery.png` })
if (!(await desktop.title()).startsWith('Rosado')) errors.push('project detail document title was not updated')
await desktop.locator('.next-project a').click()
await desktop.waitForTimeout(100)
if (!desktop.url().includes('/projects/office-1')) errors.push('Next Project did not advance to the next verified project')

await desktop.goto(`${baseUrl}/projects/not-a-real-project`, { waitUntil: 'domcontentloaded' })
if (await desktop.locator('.project-not-found').count() !== 1) errors.push('invalid project slug did not render the not-found state')

await desktop.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await desktop.locator('.hero__enquiry').click()
await desktop.waitForTimeout(800)
const enquiryHash = await desktop.evaluate(() => window.location.hash)
const enquiryInView = await desktop.locator('#enquiry').evaluate((element) => {
  const bounds = element.getBoundingClientRect()
  return bounds.top >= -2 && bounds.top < window.innerHeight
})
if (enquiryHash !== '#enquiry' || !enquiryInView) {
  errors.push('hero enquiry CTA did not scroll to #enquiry')
}
await desktop.screenshot({ path: `${outputDirectory}/enquiry-from-hero.png` })

const enquiryForm = desktop.locator('.enquiry-form')
const emptyFormValid = await enquiryForm.evaluate((form) => form.checkValidity())
await enquiryForm.locator('[name="name"]').fill('Visual QA')
await enquiryForm.locator('[name="email"]').fill('qa@example.com')
await enquiryForm.locator('[name="message"]').fill('Lighting consultancy enquiry validation.')
const completedFormValid = await enquiryForm.evaluate((form) => form.checkValidity())
if (emptyFormValid || !completedFormValid) {
  errors.push('enquiry form native validation is not working as expected')
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await mobile.emulateMedia({ reducedMotion: 'reduce' })
await preparePage(mobile)
await checkHorizontalOverflow(mobile, 'mobile home')
await mobile.screenshot({ path: `${outputDirectory}/hero-mobile.png` })
await mobile.locator('.services__intro').screenshot({ path: `${outputDirectory}/services-mobile.png` })
await mobile.locator('.project-tile').first().screenshot({ path: `${outputDirectory}/project-tile-mobile.png` })
await mobile.locator('.menu-toggle').click()
await mobile.waitForTimeout(400)
await mobile.screenshot({ path: `${outputDirectory}/menu-mobile.png` })

await mobile.goto(`${baseUrl}/projects`, { waitUntil: 'domcontentloaded' })
await checkHorizontalOverflow(mobile, 'mobile projects')
await mobile.locator('.projects-hero').screenshot({ path: `${outputDirectory}/projects-mobile-hero.png` })
await mobile.locator('.project-card').first().screenshot({ path: `${outputDirectory}/project-card-mobile.png` })

await mobile.goto(`${baseUrl}/projects/rosado`, { waitUntil: 'domcontentloaded' })
await checkHorizontalOverflow(mobile, 'mobile project detail')
await mobile.locator('.project-detail__hero').screenshot({ path: `${outputDirectory}/project-detail-mobile.png` })

await browser.close()

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Visual QA complete: ${outputDirectory}`)
  console.log('No browser console warnings, console errors, or page errors detected.')
}
