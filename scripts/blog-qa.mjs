import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const output = '/tmp/anjora-blog-qa'
const errors = []
await mkdir(output, { recursive: true })

const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })

function observe(page) {
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(`console ${message.type()}: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`))
}

async function overflow(page, label) {
  const value = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  if (value > 1) errors.push(`${label}: ${value}px horizontal overflow`)
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
observe(desktop)
await desktop.emulateMedia({ reducedMotion: 'reduce' })
await desktop.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' })
await overflow(desktop, 'desktop blog')
await desktop.locator('.blog-hero').screenshot({ path: `${output}/blog-hero.png` })
await desktop.locator('.blog-feature').screenshot({ path: `${output}/blog-feature.png` })

const groups = desktop.locator('[data-blog-group]')
for (let index = 0; index < await groups.count(); index += 1) {
  await groups.nth(index).scrollIntoViewIfNeeded()
  await desktop.waitForTimeout(40)
}
await desktop.locator('.blog-index').screenshot({ path: `${output}/blog-index.png` })

const archiveState = await desktop.evaluate(async () => {
  const links = [...document.querySelectorAll('a[href^="/blog/"]')]
  const hrefs = [...new Set(links.map((link) => link.getAttribute('href')).filter(Boolean))]
  const images = [...document.querySelectorAll('.blog-index img')]
  await Promise.all(images.map((image) => image.complete ? undefined : new Promise((resolve) => {
    image.addEventListener('load', resolve, { once: true })
    image.addEventListener('error', resolve, { once: true })
  })))
  const saturation = images.map((image) => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, 32, 32)
    const pixels = context.getImageData(0, 0, 32, 32).data
    let difference = 0
    for (let index = 0; index < pixels.length; index += 4) {
      difference += Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) - Math.min(pixels[index], pixels[index + 1], pixels[index + 2])
    }
    return difference / (pixels.length / 4)
  })
  return {
    hrefs,
    cards: document.querySelectorAll('[data-blog-card]').length,
    groups: [...document.querySelectorAll('[data-blog-group]')].map((group) => group.querySelectorAll('[data-blog-card]').length),
    broken: images.filter((image) => !image.naturalWidth).length,
    remote: images.filter((image) => image.currentSrc.includes('anjora.lighting')).length,
    saturation,
    reducedClip: getComputedStyle(document.querySelector('.blog-card__media')).clipPath,
  }
})

if (archiveState.hrefs.length !== 17) errors.push(`blog archive exposes ${archiveState.hrefs.length} unique posts instead of 17`)
if (archiveState.cards !== 16) errors.push(`blog listing has ${archiveState.cards} grid cards instead of 16 plus the featured article`)
if (archiveState.groups.some((count) => count < 1 || count > 2)) errors.push('blog grouping produced an invalid group')
if (archiveState.broken) errors.push(`${archiveState.broken} blog cover images are broken`)
if (archiveState.remote) errors.push(`${archiveState.remote} blog images are remotely hotlinked`)
if (archiveState.saturation.some((value) => value < 10)) errors.push(`one or more blog covers remain effectively monochrome: ${archiveState.saturation.join(', ')}`)
if (archiveState.reducedClip !== 'none') errors.push(`reduced motion left card media clipped: ${archiveState.reducedClip}`)

for (const href of archiveState.hrefs) {
  await desktop.goto(`${baseUrl}${href}`, { waitUntil: 'networkidle' })
  await overflow(desktop, href)
  const detail = await desktop.evaluate(() => ({
    found: Boolean(document.querySelector('.blog-detail')),
    h1: document.querySelector('h1')?.textContent?.trim(),
    blocks: document.querySelectorAll('.article-body > *').length,
    words: (document.querySelector('.article-body')?.textContent ?? '').trim().split(/\s+/).length,
    imageLocal: !document.querySelector('.article-hero__media img')?.currentSrc.includes('anjora.lighting'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    jsonLd: Boolean(document.querySelector('script[data-blog-json-ld]')),
  }))
  if (!detail.found || !detail.h1) errors.push(`${href}: detail page did not render`)
  if (detail.blocks < 10 || detail.words < 400) errors.push(`${href}: article body appears incomplete (${detail.blocks} blocks, ${detail.words} words)`)
  if (!detail.imageLocal) errors.push(`${href}: hero image is not local`)
  if (!detail.canonical?.includes(href)) errors.push(`${href}: canonical URL is incorrect (${detail.canonical})`)
  if (!detail.jsonLd) errors.push(`${href}: BlogPosting JSON-LD is missing`)
}

await desktop.goto(`${baseUrl}/blog/not-a-real-article`, { waitUntil: 'domcontentloaded' })
if (await desktop.locator('.blog-not-found').count() !== 1) errors.push('invalid blog slug does not render article-not-found state')

await desktop.goto(baseUrl, { waitUntil: 'networkidle' })
if (await desktop.locator('.insights-preview [data-blog-card]').count() !== 4) errors.push('Home does not show four linked insight previews')

const motion = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
observe(motion)
await motion.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' })
const firstGroup = motion.locator('[data-blog-group]').first()
await firstGroup.scrollIntoViewIfNeeded()
await motion.waitForTimeout(1300)
const reveal = await firstGroup.locator('.blog-card__media').first().evaluate((element) => getComputedStyle(element).clipPath)
if (!reveal.includes('0%')) errors.push(`normal-motion blog reveal did not settle: ${reveal}`)
await motion.close()

const responsive = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
observe(responsive)
await responsive.emulateMedia({ reducedMotion: 'reduce' })
for (const width of [375, 390, 430, 768, 1024, 1440]) {
  await responsive.setViewportSize({ width, height: width < 768 ? 844 : 900 })
  await responsive.goto(`${baseUrl}/blog`, { waitUntil: 'domcontentloaded' })
  await overflow(responsive, `${width}px blog`)
  await responsive.goto(`${baseUrl}/blog/how-to-choose-outdoor-lights-ip-rating-explained`, { waitUntil: 'domcontentloaded' })
  await overflow(responsive, `${width}px article`)
}
await responsive.setViewportSize({ width: 390, height: 844 })
await responsive.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' })
await responsive.locator('.blog-feature').screenshot({ path: `${output}/blog-mobile-feature.png` })
await responsive.goto(`${baseUrl}/blog/how-to-choose-outdoor-lights-ip-rating-explained`, { waitUntil: 'networkidle' })
await responsive.locator('.article-hero').screenshot({ path: `${output}/article-mobile-hero.png` })
await responsive.close()

await desktop.goto(`${baseUrl}/blog/how-to-choose-outdoor-lights-ip-rating-explained`, { waitUntil: 'networkidle' })
await desktop.locator('.article-hero').screenshot({ path: `${output}/article-hero.png` })
await desktop.locator('.article-layout').screenshot({ path: `${output}/article-body.png` })
await desktop.close()
await browser.close()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Blog QA complete: ${output}`)
  console.log('All 17 articles, local color images, routes, SEO metadata, motion modes and responsive layouts passed.')
}
