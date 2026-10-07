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

await browser.close()

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Visual QA complete: ${outputDirectory}`)
  console.log('No browser console warnings, console errors, or page errors detected.')
}
