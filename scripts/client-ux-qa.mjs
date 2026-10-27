import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const output = '/tmp/anjora-client-qa'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()) })
await page.route('https://api.web3forms.com/**', route => route.abort()) // Never contact a real inbox.
const menu = page.locator('#projects-mega-menu')
const trigger = page.locator('.projects-nav-trigger a')
const disclosure = page.getByRole('button', { name: 'Browse project categories' })
async function assertMenu(open) {
  await page.waitForFunction(expected => document.querySelector('[aria-controls="projects-mega-menu"]').getAttribute('aria-expanded') === String(expected), open)
  await page.waitForTimeout(450)
  assert.equal(await menu.evaluate(el => getComputedStyle(el).visibility === 'visible'), open)
}
async function assertFilter(category) {
  await page.waitForFunction(expected => document.querySelector('.project-filters [aria-pressed="true"]')?.textContent === expected, category)
  await page.locator('.project-card').first().waitFor({ state: 'attached' })
  const categories = await page.locator('.project-card__caption p span:first-child').allTextContents()
  assert(categories.length > 0)
  assert(categories.every(value => value === category), `${category}: wrong records: ${categories}`)
  assert.equal(await page.locator('.project-filters [aria-pressed="true"]').textContent(), category)
}
async function screenshot(name) { await page.screenshot({ path: `${output}/${name}.png` }) }
try {
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)
  await trigger.hover(); await assertMenu(true)
  const triggerBox = await trigger.boundingBox()
  await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height + 14)
  await page.waitForTimeout(300)
  await assertMenu(true)
  await menu.locator('[data-category="Heritage"]').hover(); await page.waitForTimeout(450)
  assert.equal(await page.locator('[data-preview="Heritage"]').evaluate(el => Number(getComputedStyle(el).opacity)), 1)
  await menu.locator('[data-category="Clubs"]').hover(); await page.waitForTimeout(450)
  assert.equal(await page.locator('[data-preview="Clubs"]').evaluate(el => Number(getComputedStyle(el).opacity)), 1)
  await screenshot('mega-menu-light')
  await page.keyboard.press('Escape'); await assertMenu(false)
  assert.equal(await disclosure.evaluate(el => el === document.activeElement), true)
  await trigger.focus(); await assertMenu(true)
  await page.keyboard.press('ArrowDown')
  await page.waitForFunction(() => document.activeElement === document.querySelector('#projects-mega-menu a'))
  await page.keyboard.press('Escape'); await assertMenu(false)
  await disclosure.click(); await assertMenu(true)
  await page.keyboard.press('Tab')
  assert.equal(await page.getByRole('button', { name: 'Close projects menu' }).evaluate(el => el === document.activeElement), true)
  await menu.locator('a').last().focus()
  await page.keyboard.press('Tab'); await assertMenu(false)
  assert.equal(await page.locator('.desktop-nav a[href="/products"]').evaluate(el => el === document.activeElement), true)
  await disclosure.click(); await assertMenu(true)
  await page.mouse.click(20, 850); await assertMenu(false)
  await trigger.hover(); await assertMenu(true)
  await menu.locator('[data-category="Clubs"]').click()
  await page.waitForURL(`${base}/projects?category=Clubs`); await assertFilter('Clubs')
  await page.reload(); await assertFilter('Clubs')
  await page.locator('.project-filters').getByRole('button', { name: 'Heritage', exact: true }).click()
  await assertFilter('Heritage')
  await page.goBack(); await assertFilter('Clubs')
  await page.goForward(); await assertFilter('Heritage')
  await page.locator('.project-card a[href="/projects/city-palace"]').click()
  await page.waitForURL(`${base}/projects/city-palace`)
  await page.waitForTimeout(1300)
  assert.equal(await page.locator('h1').textContent(), 'City Palace')
  assert.equal(await page.locator('.project-detail__hero--portrait').count(), 0)
  assert(!await page.locator('.project-detail__story').textContent().then(text => text.includes('Kingsman')))
  await screenshot('city-palace')
  await page.locator('.project-detail__breadcrumb').getByRole('link', { name: 'Back to Heritage' }).click()
  await assertFilter('Heritage')
  await page.goto(`${base}/projects/kingsman`); await page.waitForTimeout(1300)
  assert.equal(await page.locator('h1').textContent(), 'Kingsman')
  assert.equal(await page.locator('.project-detail__hero--portrait').count(), 1)
  assert(!await page.locator('.project-detail__story').textContent().then(text => text.includes('City Palace')))
  assert.equal(await page.locator('.next-project .eyebrow').textContent(), 'Explore another project')
  assert.equal(await page.locator('.next-project a').getAttribute('href'), '/projects/rosado')
  await screenshot('kingsman-light')
  await page.locator('.theme-toggle--desktop').click(); await page.waitForTimeout(700); await screenshot('kingsman-dark')
  await page.locator('.project-detail__breadcrumb').getByRole('link', { name: 'Back to Clubs' }).click()
  await assertFilter('Clubs')
  const counts = []
  for (let i = 0; i < 3; i++) {
    for (const name of ['All', 'Heritage', 'Clubs']) {
      await page.locator('.project-filters').getByRole('button', { name, exact: true }).click()
      await page.waitForTimeout(100)
    }
    counts.push(await page.evaluate(async () => { const { ScrollTrigger } = await import('/src/lib/gsap.ts'); return ScrollTrigger.getAll().length }))
  }
  assert(Math.max(...counts) - Math.min(...counts) <= 1, `filter ScrollTrigger leak: ${counts}`)
  await page.goto(`${base}/projects?category=Invalid`)
  assert.equal(await page.locator('.project-filters [aria-pressed="true"]').textContent(), 'All')
  assert.equal(await page.locator('.project-card').count(), 20)

  // Interrupt navigation with a second click, plus history. No animation may hide main.
  for (let i = 0; i < 4; i++) {
    await page.locator('.desktop-nav a[href="/about-us"]').evaluate(el => el.click())
    await page.locator('.desktop-nav a[href="/blog"]').evaluate(el => el.click())
    await page.waitForFunction(() => location.pathname === '/blog' && document.querySelector('.blog-page'))
    await page.evaluate(() => history.back())
    await page.waitForURL(`${base}/about-us`)
    await page.waitForTimeout(500)
    const main = await page.locator('main').evaluate(el => ({ opacity: getComputedStyle(el).opacity, visibility: getComputedStyle(el).visibility }))
    assert.equal(main.opacity, '1'); assert.equal(main.visibility, 'visible')
  }
  for (const route of ['/', '/projects', '/projects/kingsman', '/projects/city-palace', '/blog', '/blog/how-to-choose-outdoor-lights-ip-rating-explained', '/about-us', '/products', '/research']) {
    await page.goto(`${base}${route}`); await page.waitForTimeout(1300)
    assert(await page.locator('main h1').isVisible(), `${route}: missing title`)
    assert.equal(await page.locator('main').evaluate(el => getComputedStyle(el).opacity), '1')
  }
  assert.equal(await page.locator('.research-topic .blog-card').count(), 9)
  await screenshot('research-desktop')
  const contacts = [
    ['tel:+919116668039', '+91 9116668039'], ['mailto:kirti@anjora.lighting', 'kirti@anjora.lighting'],
    ['tel:+918619527505', '+91 861 952 7505'], ['mailto:shraddha@anjora.lighting', 'shraddha@anjora.lighting'],
    ['tel:+919929571272', '+91 99295 71272'], ['mailto:info@anjora.lighting', 'info@anjora.lighting'],
  ]
  for (const [href, label] of contacts) assert.equal(await page.locator(`footer a[href="${href}"]`).textContent(), label)
  const footerPaths = await page.locator('footer a[href^="/"]').evaluateAll(links => [...new Set(links.map(link => link.getAttribute('href').split('#')[0]))])
  for (const route of footerPaths) {
    await page.goto(`${base}${route}`)
    assert.equal(new URL(page.url()).pathname, route)
    assert.equal(await page.locator('main').count(), 1)
  }

  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const theme of ['light', 'dark']) {
    await page.evaluate(value => localStorage.setItem('anjora-theme', value), theme)
    for (const width of [1440, 1024, 768, 430, 375]) {
      await page.setViewportSize({ width, height: width < 768 ? 820 : 900 })
      for (const route of ['/', '/projects/kingsman', '/projects/city-palace', '/research']) {
        await page.goto(`${base}${route}`); await page.waitForTimeout(200)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${theme}/${width}/${route} overflow`)
        if (route.includes('kingsman')) await screenshot(`portrait-${theme}-${width}`)
      }
      await page.goto(`${base}/#enquiry`); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400)
      await page.locator('.enquiry-section').screenshot({ style: '.site-header, .skip-link { visibility: hidden !important; }', path: `${output}/glass-${theme}-${width}.png` })
      await page.locator('.site-footer').screenshot({ style: '.site-header, .skip-link { visibility: hidden !important; }', path: `${output}/footer-${theme}-${width}.png` })
      if (width <= 768) {
        await page.getByRole('button', { name: 'Open menu', exact: true }).click()
        await page.getByRole('button', { name: 'Projects', exact: true }).click()
        assert.equal(await page.locator('#mobile-project-categories a').count(), 8)
        await screenshot(`mobile-menu-${theme}-${width}`)
        await page.locator('.mobile-menu__enquiry').scrollIntoViewIfNeeded()
        const enquiryBounds = await page.locator('.mobile-menu__enquiry').boundingBox()
        assert(enquiryBounds.y > 0 && enquiryBounds.y + enquiryBounds.height <= page.viewportSize().height, 'mobile menu must scroll to its final action')
        if (width === 375) await screenshot(`mobile-menu-scrolled-${theme}`)
        await page.locator('#mobile-project-categories a').filter({ hasText: 'Heritage' }).click()
        await page.waitForURL(`${base}/projects?category=Heritage`)
        await assertFilter('Heritage')
        assert.equal(await page.evaluate(() => document.body.classList.contains('menu-open')), false)
      }
    }
  }
  await page.goto(base)
  const reel = page.locator('.instagram-reel a')
  assert.equal(await reel.getAttribute('href'), 'https://www.instagram.com/reel/DePausjtUqP/')
  assert.equal(await reel.getAttribute('target'), '_blank')
  assert.equal(await page.locator('iframe[src*="instagram"]').count(), 0)
  assert.deepEqual(errors, [])
  console.log(`Client UX QA passed: mega-menu, keyboard, categories/history, separate cases, filter cleanup (${counts}), rapid routes, research, contacts, mobile/reduced motion, 5 widths × 2 themes. Screenshots: ${output}`)
} finally { await browser.close() }
