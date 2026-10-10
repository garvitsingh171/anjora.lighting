import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const outputDirectory = '/tmp/anjora-about-qa'
const errors = []

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})

async function settle(page) {
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 3_000))])
    await Promise.race([
      Promise.all([...document.images].map((image) => image.complete ? undefined : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      }))),
      new Promise((resolve) => setTimeout(resolve, 3_000)),
    ])
  })
}

async function checkOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  if (dimensions.content > dimensions.viewport + 1) {
    errors.push(`${label}: horizontal overflow (${dimensions.content}px in ${dimensions.viewport}px)`)
  }
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') errors.push(`${new URL(page.url()).pathname} console ${message.type()}: ${message.text()}`)
})
page.on('pageerror', (error) => errors.push(`${new URL(page.url()).pathname} page error: ${error.stack ?? error.message}`))

await page.goto(`${baseUrl}/about-us`, { waitUntil: 'domcontentloaded' })
await settle(page)
await page.waitForTimeout(1_100)
await checkOverflow(page, 'desktop About')

const state = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.getAttribute('aria-label') ?? document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
  ogType: document.querySelector('meta[property="og:type"]')?.getAttribute('content'),
  jsonLd: Boolean(document.querySelector('script[data-blog-json-ld]')),
  sectionCount: document.querySelectorAll('.about-page section').length,
  brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
  remoteImages: [...document.images].filter((image) => image.currentSrc.includes('anjora.lighting/wp-content')).map((image) => image.currentSrc),
  portrait: (() => {
    const image = document.querySelector('.about-founder__portrait img')
    return image ? { width: image.naturalWidth, height: image.naturalHeight, objectFit: getComputedStyle(image).objectFit, alt: image.alt } : null
  })(),
}))

if (!state.title.startsWith('About Anjora Lighting')) errors.push(`unexpected title: ${state.title}`)
if (!state.h1?.includes('Transforming ambience')) errors.push(`unexpected or missing h1: ${state.h1}`)
if (state.canonical !== 'https://anjora.lighting/about-us') errors.push(`unexpected canonical: ${state.canonical}`)
if (!state.description?.includes('independent architectural lighting design consultancy')) errors.push('meta description is missing factual consultancy positioning')
if (state.ogType !== 'website') errors.push(`About og:type is ${state.ogType}`)
if (!state.jsonLd) errors.push('About structured data is missing')
if (state.sectionCount < 7) errors.push(`About rendered only ${state.sectionCount} narrative sections`)
if (state.brokenImages.length) errors.push(`broken images: ${state.brokenImages.join(', ')}`)
if (state.remoteImages.length) errors.push(`hotlinked images: ${state.remoteImages.join(', ')}`)
if (!state.portrait || state.portrait.width < 250 || state.portrait.objectFit !== 'cover') errors.push(`founder portrait failed validation: ${JSON.stringify(state.portrait)}`)
if (state.portrait?.alt !== 'Shubham Khandelwal, Director of Anjora Lighting') errors.push('founder portrait alt text is incorrect')

await page.screenshot({ path: `${outputDirectory}/about-hero-desktop.png` })

const navigation = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
navigation.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') errors.push(`${new URL(navigation.url()).pathname} navigation console ${message.type()}: ${message.text()}`)
})
navigation.on('pageerror', (error) => errors.push(`${new URL(navigation.url()).pathname} navigation page error: ${error.stack ?? error.message}`))

await navigation.goto(`${baseUrl}/about`, { waitUntil: 'networkidle' })
if (!navigation.url().endsWith('/about-us')) errors.push(`legacy /about did not redirect to /about-us: ${navigation.url()}`)

await navigation.goto(baseUrl, { waitUntil: 'networkidle' })
await navigation.waitForTimeout(700)
await navigation.getByRole('link', { name: 'About Us', exact: true }).first().click()
await navigation.waitForTimeout(700)
if (!navigation.url().endsWith('/about-us')) errors.push('Home navigation did not reach /about-us')

await navigation.getByRole('link', { name: 'Projects', exact: true }).first().click()
await navigation.waitForTimeout(700)
await navigation.getByRole('link', { name: 'About Us', exact: true }).first().click()
await navigation.waitForTimeout(700)
if (!navigation.url().endsWith('/about-us')) errors.push('Projects navigation did not reach /about-us')

await navigation.getByRole('link', { name: 'Blog', exact: true }).first().click()
await navigation.waitForTimeout(700)
await navigation.getByRole('link', { name: 'About Us', exact: true }).first().click()
await navigation.waitForTimeout(700)
if (!navigation.url().endsWith('/about-us')) errors.push('Blog navigation did not reach /about-us')

await navigation.goBack()
await navigation.waitForTimeout(500)
if (!navigation.url().endsWith('/blog')) errors.push('browser back did not return Blog')
await navigation.goForward()
await navigation.waitForTimeout(500)
if (!navigation.url().endsWith('/about-us')) errors.push('browser forward did not restore About')
await navigation.close()

await page.emulateMedia({ reducedMotion: 'reduce' })
await page.reload({ waitUntil: 'domcontentloaded' })
await settle(page)
await page.locator('.about-company').screenshot({ path: `${outputDirectory}/about-company-desktop.png` })
await page.locator('.about-philosophy').screenshot({ path: `${outputDirectory}/about-philosophy-desktop.png` })
await page.locator('.about-founder').screenshot({ path: `${outputDirectory}/about-founder-desktop.png` })
await page.locator('.about-principles').screenshot({ path: `${outputDirectory}/about-principles-desktop.png` })
await page.locator('.about-closing').screenshot({ path: `${outputDirectory}/about-closing-desktop.png` })
const reducedState = await page.evaluate(() => ({
  portraitClip: getComputedStyle(document.querySelector('.about-founder__portrait')).clipPath,
  philosophyOpacity: getComputedStyle(document.querySelector('[data-philosophy-word]')).opacity,
  careerScale: getComputedStyle(document.querySelector('[data-career-line]')).transform,
}))
if (reducedState.portraitClip !== 'none' || reducedState.philosophyOpacity !== '1') {
  errors.push(`reduced motion left content hidden: ${JSON.stringify(reducedState)}`)
}

const responsive = await browser.newPage({ viewport: { width: 375, height: 820 }, deviceScaleFactor: 1 })
await responsive.emulateMedia({ reducedMotion: 'reduce' })
for (const width of [375, 430, 768, 1024, 1440]) {
  await responsive.setViewportSize({ width, height: width < 768 ? 820 : 900 })
  await responsive.goto(`${baseUrl}/about-us`, { waitUntil: 'domcontentloaded' })
  await settle(responsive)
  await checkOverflow(responsive, `${width}px About`)
}
await responsive.setViewportSize({ width: 390, height: 844 })
await responsive.goto(`${baseUrl}/about-us`, { waitUntil: 'domcontentloaded' })
await settle(responsive)
await responsive.screenshot({ path: `${outputDirectory}/about-hero-mobile.png` })
await responsive.locator('.about-founder').screenshot({ path: `${outputDirectory}/about-founder-mobile.png` })
await responsive.locator('.about-career').screenshot({ path: `${outputDirectory}/about-career-mobile.png` })

await browser.close()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`About QA complete: ${outputDirectory}`)
  console.log('Route, content, local imagery, SEO, reduced motion and responsive checks passed.')
}
