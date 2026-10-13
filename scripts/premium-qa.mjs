import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const errors = []

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') {
    errors.push(`console ${message.type()}: ${message.text()}`)
  }
})
page.on('pageerror', (error) => errors.push(`page error: ${error.message}`))

async function waitForTransition() {
  await page.waitForFunction(() => {
    const panel = document.querySelector('.route-transition')
    return !panel || getComputedStyle(panel).visibility === 'hidden'
  })
}

async function follow(locator, pathname) {
  await locator.evaluate((element) => {
    window.__anjoraRouteStartedAt = performance.now()
    element.click()
  })
  await page.waitForURL((url) => url.pathname === pathname)
  await waitForTransition()
  const duration = await page.evaluate(() => performance.now() - window.__anjoraRouteStartedAt)
  if (duration > 850) errors.push(`${pathname}: route transition took ${duration}ms`)
  const scrollTop = await page.evaluate(() => window.scrollY)
  if (scrollTop > 2) errors.push(`${pathname}: route opened at ${scrollTop}px instead of the top`)
}

async function triggerCount() {
  return page.evaluate(async () => {
    const { ScrollTrigger } = await import('/src/lib/gsap.ts')
    return ScrollTrigger.getAll().length
  })
}

async function captureCount(counts, route) {
  await page.waitForTimeout(120)
  counts[route] ??= []
  counts[route].push(await triggerCount())
}

const triggerCounts = {}
await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(900)
await captureCount(triggerCounts, 'home')

for (let pass = 0; pass < 2; pass += 1) {
  await follow(page.getByRole('link', { name: 'Projects', exact: true }).first(), '/projects')
  await captureCount(triggerCounts, 'projects')

  const projectPath = await page.locator('.project-card a').first().getAttribute('href')
  await follow(page.locator('.project-card a').first(), projectPath)
  await captureCount(triggerCounts, 'project-detail')

  await follow(page.getByRole('link', { name: 'Blog', exact: true }).first(), '/blog')
  await captureCount(triggerCounts, 'blog')

  const articlePath = await page.locator('.blog-feature a').first().getAttribute('href')
  await follow(page.locator('.blog-feature a').first(), articlePath)
  await captureCount(triggerCounts, 'blog-detail')

  await follow(page.getByRole('link', { name: 'About Us', exact: true }).first(), '/about-us')
  await captureCount(triggerCounts, 'about')

  await follow(page.locator('.brand-logo').first(), '/')
  await captureCount(triggerCounts, 'home')
}

for (const [route, counts] of Object.entries(triggerCounts)) {
  if (Math.max(...counts) - Math.min(...counts) > 1) {
    errors.push(`${route}: ScrollTrigger count drifted across visits (${counts.join(', ')})`)
  }
}

await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
await page.waitForTimeout(950)
const hiddenHomeContent = await page.locator([
  '.project-tile__caption',
  '[data-home-insight]',
  '.enquiry-section__grid > *',
  '[data-footer-reveal]',
].join(',')).evaluateAll((elements) => elements.filter((element) => {
  const style = getComputedStyle(element)
  return style.visibility === 'hidden' || Number.parseFloat(style.opacity) < 0.99
}).map((element) => ({
  element: element.className || element.getAttribute('data-home-insight') || element.tagName,
  top: Math.round(element.getBoundingClientRect().top),
  bottom: Math.round(element.getBoundingClientRect().bottom),
  opacity: getComputedStyle(element).opacity,
})))
if (hiddenHomeContent.length) errors.push(`fast home scroll left content hidden: ${JSON.stringify(hiddenHomeContent)}`)

await page.goto(`${baseUrl}/projects/rosado`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(250)
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
await page.waitForTimeout(300)
const hiddenGalleryItems = await page.locator('[data-gallery-item]').evaluateAll((items) => items.filter((item) => {
  const style = getComputedStyle(item)
  return style.visibility === 'hidden' || Number.parseFloat(style.opacity) < 0.99 || !style.clipPath.includes('0%')
}).length)
if (hiddenGalleryItems) errors.push(`fast project scroll left ${hiddenGalleryItems} gallery items hidden`)

await browser.close()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log('Premium QA complete.')
  console.log(`Stable ScrollTrigger counts: ${JSON.stringify(triggerCounts)}`)
  console.log('Route timing, route scroll reset and fast-scroll visibility checks passed.')
}
