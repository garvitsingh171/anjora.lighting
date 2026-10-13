import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const outputDirectory = '/tmp/anjora-theme-qa'
const errors = []
const themes = ['dark', 'light']
const widths = [375, 430, 768, 1024, 1440]
const routes = [
  '/',
  '/projects',
  '/projects/rosado',
  '/products',
  '/products/recessed-downlight-type-01',
  '/research',
  '/blog',
  '/blog/how-to-choose-outdoor-lights-ip-rating-explained',
  '/about-us',
]

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') {
    errors.push(`${new URL(page.url()).pathname} console ${message.type()}: ${message.text()}`)
  }
})
page.on('pageerror', (error) => errors.push(`${new URL(page.url()).pathname} page: ${error.message}`))

async function applyStoredTheme(theme) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.evaluate((nextTheme) => localStorage.setItem('anjora-theme', nextTheme), theme)
}

async function checkRoute(route, theme, width) {
  await page.setViewportSize({ width, height: width < 768 ? 820 : 900 })
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 45_000 })
  if (route === '/') await page.waitForTimeout(850)

  const state = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    colorScheme: document.documentElement.style.colorScheme,
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    bodyBackground: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    brokenImages: [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  }))

  const label = `${theme} ${width}px ${route}`
  if (state.theme !== theme || state.colorScheme !== theme) {
    errors.push(`${label}: root theme state is ${state.theme}/${state.colorScheme}`)
  }
  if (state.content > state.viewport + 1) {
    errors.push(`${label}: horizontal overflow (${state.content}px in ${state.viewport}px)`)
  }
  if (state.brokenImages.length) errors.push(`${label}: broken images: ${state.brokenImages.join(', ')}`)

  const expectedBackground = theme === 'light' ? 'rgb(243, 241, 232)' : 'rgb(14, 28, 41)'
  const expectedColor = theme === 'light' ? 'rgb(14, 28, 41)' : 'rgb(241, 240, 233)'
  if (state.bodyBackground !== expectedBackground || state.bodyColor !== expectedColor) {
    errors.push(`${label}: unexpected body colors ${state.bodyBackground}/${state.bodyColor}`)
  }

  const visibleToggle = page.locator('.theme-toggle:visible')
  if (await visibleToggle.count() !== 1) errors.push(`${label}: expected one visible theme toggle`)
  if (width <= 900 && await page.locator('.mobile-header-controls .theme-toggle:visible').count() !== 1) {
    errors.push(`${label}: mobile theme toggle is not beside the menu control`)
  }
}

for (const theme of themes) {
  await applyStoredTheme(theme)
  for (const width of widths) {
    for (const route of routes) await checkRoute(route, theme, width)
  }
}

await page.setViewportSize({ width: 1440, height: 900 })
await applyStoredTheme('dark')
await page.goto(`${baseUrl}/about-us`, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => window.scrollTo(0, 620))
const scrollBeforeToggle = await page.evaluate(() => window.scrollY)
await page.locator('.theme-toggle--desktop').evaluate((button) => button.click())
await page.waitForTimeout(700)
const toggleState = await page.evaluate(() => ({
  theme: document.documentElement.dataset.theme,
  stored: localStorage.getItem('anjora-theme'),
  scrollY: window.scrollY,
  overlayVisibility: getComputedStyle(document.querySelector('.theme-transition-overlay')).visibility,
}))
if (toggleState.theme !== 'light' || toggleState.stored !== 'light') errors.push('desktop toggle did not apply and persist light theme')
if (Math.abs(toggleState.scrollY - scrollBeforeToggle) > 1) errors.push(`theme toggle changed scroll position by ${toggleState.scrollY - scrollBeforeToggle}px`)
if (toggleState.overlayVisibility !== 'hidden') errors.push('theme overlay remained visible after the transition')
await page.reload({ waitUntil: 'domcontentloaded' })
if (await page.evaluate(() => document.documentElement.dataset.theme) !== 'light') errors.push('theme preference did not survive reload')
await page.waitForTimeout(1_200)
await page.screenshot({ path: `${outputDirectory}/about-light-desktop.png`, fullPage: false })

await page.evaluate(() => localStorage.setItem('anjora-theme', 'dark'))
await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2_100)
await page.screenshot({ path: `${outputDirectory}/home-dark-desktop.png`, fullPage: false })

await page.setViewportSize({ width: 375, height: 820 })
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.goto(`${baseUrl}/products`, { waitUntil: 'domcontentloaded' })
await page.locator('.theme-toggle:visible').click()
const reducedMotionState = await page.evaluate(() => ({
  theme: document.documentElement.dataset.theme,
  overlayVisibility: getComputedStyle(document.querySelector('.theme-transition-overlay')).visibility,
}))
if (reducedMotionState.theme !== 'light' || reducedMotionState.overlayVisibility !== 'hidden') {
  errors.push(`reduced-motion toggle did not switch immediately: ${JSON.stringify(reducedMotionState)}`)
}
await page.screenshot({ path: `${outputDirectory}/products-light-mobile.png`, fullPage: false })

const systemContext = await browser.newContext({ colorScheme: 'light' })
const systemPage = await systemContext.newPage()
await systemPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
await systemPage.evaluate(() => localStorage.removeItem('anjora-theme'))
await systemPage.reload({ waitUntil: 'domcontentloaded' })
if (await systemPage.evaluate(() => document.documentElement.dataset.theme) !== 'light') {
  errors.push('first visit did not respect the system light preference')
}
await systemContext.close()

await browser.close()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Theme QA complete: ${outputDirectory}`)
  console.log('Both themes passed route, persistence, reduced-motion, scroll-position and responsive overflow checks.')
}
