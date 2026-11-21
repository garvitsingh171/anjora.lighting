import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const output = '/tmp/anjora-dual-qa'
await mkdir(output, { recursive: true })
if (!process.env.ZOOM_ONLY) {
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
await page.route('https://api.web3forms.com/**', route => route.abort())
const go = async path => { await page.goto(`${base}${path}`); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800) }
const overflow = async label => {
  const result = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth,
    escaped: [...document.querySelectorAll('main h1, main h2, main h3, .experience-choice, .service-slide__body')].filter(el => {
      if (!el.getClientRects().length) return false
      const r = el.getBoundingClientRect()
      return r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2
    }).map(el => `${el.className}: ${el.textContent.slice(0, 50)}`) }))
  assert(result.width <= result.viewport + 1, `${label}: document overflow`)
  assert.deepEqual(result.escaped, [], `${label}: component overflow`)
}
try {
  await go('/')
  assert.equal(await page.locator('.experience-choice').count(), 2)
  assert.equal(await page.locator('.services-section').count(), 0)
  const consultancy = page.locator('.experience-choice--consultancy')
  await consultancy.focus()
  assert(await consultancy.evaluate(el => el === document.activeElement))
  await consultancy.hover(); await page.waitForTimeout(700)
  assert.notEqual(await consultancy.locator('img').evaluate(el => getComputedStyle(el).transform), 'none')
  await page.keyboard.press('Enter'); await page.waitForURL(`${base}/consultancy`)
  await page.waitForTimeout(800)
  assert.equal(await page.locator('[data-service-slide]').count(), 7)
  assert.equal(await page.locator('.consultancy-process').count(), 1)
  assert.equal(await page.locator('.practice-intro').count(), 1)
  await page.locator('.experience-crosslink a').click(); await page.waitForURL(`${base}/products`)
  await page.waitForTimeout(800)
  await page.locator('input[type="search"]').fill('phog')
  await page.waitForFunction(() => document.querySelectorAll('.product-card').length === 1)
  await page.locator('.product-card__main').click(); await page.waitForURL(/\/products\/phog/)
  await page.reload(); assert(await page.locator('h1').textContent().then(text => text.toLowerCase().includes('phog')))
  await page.locator('.product-detail__summary .enquiry-button').click(); await page.waitForURL(/#enquiry$/)
  await page.waitForTimeout(500)
  assert((await page.locator('textarea[name="message"]').inputValue()).toLowerCase().includes('phog'))
  await page.goBack(); await page.waitForURL(/\/products\/phog/)
  await page.goForward(); await page.waitForURL(/#enquiry$/)
  await go('/products'); await page.locator('.experience-crosslink a').click(); await page.waitForURL(`${base}/consultancy`)
  await go('/#services'); await page.waitForURL(`${base}/consultancy#services`)
  await page.waitForTimeout(500)
  assert(await page.locator('.services__intro .eyebrow').evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom))
  // Back restores the chooser position, not an arbitrary top reset.
  await go('/'); await page.locator('#explore').evaluate(el => el.scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(500)
  const savedY = await page.evaluate(() => scrollY)
  await page.locator('.experience-choice--products').click(); await page.waitForURL(`${base}/products`); await page.waitForTimeout(500)
  await page.goBack(); await page.waitForTimeout(1000)
  assert(Math.abs(await page.evaluate(() => scrollY) - savedY) < 8, 'history restores chooser')
  // Content-fit, both themes, mobile, tablets and short desktop viewports.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const routes = ['/', '/consultancy', '/products', '/products/phog', '/projects', '/projects/city-palace', '/blog', '/about-us', '/research', '/talk-to-our-team']
  for (const theme of ['light', 'dark']) {
    await page.evaluate(t => localStorage.setItem('anjora-theme', t), theme)
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width === 1024 ? 600 : 900 })
      for (const path of routes) { await go(path); await overflow(`${theme} ${width} ${path}`) }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 }); await go('/')
  await page.locator('.experience-chooser').screenshot({ path: `${output}/choices-mobile.png` })
  await page.locator('.menu-toggle').click(); await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Consultancy/ }).click()
  await page.waitForURL(`${base}/consultancy`)
  assert.equal(await page.locator('.pin-spacer').count(), 0)
  assert.deepEqual(errors, [])
  console.log('Experience QA passed: both journeys, keyboard, hover, history, direct links, contextual enquiry, 100 route/theme/viewport checks, mobile and reduced motion.')
} finally { await browser.close() }
}

// Native Chrome zoom, not a CSS zoom rule, DPR override or viewport emulation.
// A temporary persistent profile permits chrome.settingsPrivate on chrome://settings.
const context = await chromium.launchPersistentContext(`${output}/chrome-profile`, { executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', viewport: null, args: ['--no-sandbox', '--window-size=1920,1080'] })
const tab = await context.newPage()
const settings = await context.newPage()
const measurements = []
const cdp = await context.newCDPSession(tab)
const capture = async name => {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(`${output}/${name}.png`, Buffer.from(data, 'base64'))
}
try {
  await settings.goto('chrome://settings/appearance')
  for (const zoom of [1, 1.25, 1.5]) {
    await settings.evaluate(value => new Promise(resolve => globalThis.chrome.settingsPrivate.setDefaultZoom(value, resolve)), zoom)
    for (const theme of ['light', 'dark']) {
      await tab.goto(base); await tab.evaluate(t => localStorage.setItem('anjora-theme', t), theme); await tab.reload(); await tab.waitForTimeout(1500)
      await capture(`home-${theme}-${zoom * 100}`)
      await tab.locator('#explore').evaluate(el => el.scrollIntoView({ behavior: 'instant' })); await tab.waitForTimeout(900)
      await capture(`choices-${theme}-${zoom * 100}`)
      await tab.goto(`${base}/consultancy#services`); await tab.evaluate(() => document.fonts.ready); await tab.waitForTimeout(1200)
      const measurement = await tab.evaluate(() => {
        const header = document.querySelector('.site-header').getBoundingClientRect()
        const label = document.querySelector('.services__intro .eyebrow').getBoundingClientRect()
        return { physicalWindow: outerWidth, cssWidth: innerWidth, cssHeight: innerHeight, dpr: devicePixelRatio, headerBottom: header.bottom, labelTop: label.top, headingSize: getComputedStyle(document.querySelector('#services-title')).fontSize, overflow: document.documentElement.scrollWidth > innerWidth, enhanced: document.querySelector('#services').hasAttribute('data-enhanced') }
      })
      assert(measurement.labelTop >= measurement.headerBottom, `zoom ${zoom}: header overlap`)
      assert(!measurement.overflow, `zoom ${zoom}: overflow`)
      assert.equal(measurement.physicalWindow, 1920)
      assert(Math.abs(measurement.cssWidth - 1920 / zoom) < 2, 'native page zoom changed CSS viewport')
      measurements.push({ zoom, theme, ...measurement })
      await capture(`services-${theme}-${zoom * 100}`)
      if (measurement.enhanced) {
        await tab.evaluate(async () => { const { ScrollTrigger } = await import('/src/lib/gsap.ts'); const t = ScrollTrigger.getById('home-services'); scrollTo({ top: t.start + (t.end - t.start) * 0.5, behavior: 'instant' }) })
        await tab.waitForTimeout(600)
        const clipped = await tab.locator('[data-service-slide][aria-hidden="false"] .service-slide__body').evaluate(el => el.getBoundingClientRect().bottom > document.querySelector('.services__stage').getBoundingClientRect().bottom + 1)
        assert(!clipped, `zoom ${zoom}: pinned content clipped`)
        await capture(`pinned-${theme}-${zoom * 100}`)
      }
    }
  }
  await writeFile(`${output}/zoom-measurements.json`, JSON.stringify(measurements, null, 2))
  console.log('Native Chrome zoom QA passed at 100%, 125%, 150%, fixed 1920×1080 window, both themes. Screenshots:', output)
} finally { await context.close() }
