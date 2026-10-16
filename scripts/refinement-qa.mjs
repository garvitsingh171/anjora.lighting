import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const output = '/tmp/anjora-refinement-qa'
const failures = []
await mkdir(output, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})

for (const theme of ['dark', 'light']) {
  for (const width of [1440, 1024, 768, 430, 375]) {
    const height = width >= 1024 ? 900 : width >= 768 ? 820 : 800
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    await page.addInitScript((value) => localStorage.setItem('anjora-theme', value), theme)
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1150)

    const hero = await page.evaluate(() => {
      const box = (selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect()
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom }
      }
      return {
        title: box('.hero__title'),
        body: box('.hero__body'),
        support: box('.hero__support'),
        cta: box('.hero__enquiry'),
        fontSize: Number.parseFloat(getComputedStyle(document.querySelector('.hero__title')).fontSize),
        scrollCue: document.querySelectorAll('.hero__scroll').length,
        width: document.documentElement.scrollWidth,
        imageLoaded: document.querySelector('.hero__image').naturalWidth > 0,
        logoFilter: getComputedStyle(document.querySelector('.brand-logo img')).filter,
        clippedLines: [...document.querySelectorAll('.hero__line')].filter((line) => line.scrollWidth > line.clientWidth + 2).length,
      }
    })
    const label = `${theme}-${width}`
    if (hero.width > width + 1) failures.push(`${label}: horizontal overflow ${hero.width}px`)
    if (hero.scrollCue) failures.push(`${label}: scroll cue remains`)
    if (!hero.imageLoaded) failures.push(`${label}: hero image failed to load`)
    if (hero.clippedLines) failures.push(`${label}: ${hero.clippedLines} hero lines clipped`)
    if (Math.abs(hero.cta.x - hero.title.x) > 2) failures.push(`${label}: CTA is not left aligned`)
    if (hero.cta.y < hero.support.bottom || hero.cta.y - hero.support.bottom > 50) failures.push(`${label}: CTA detached from copy`)
    if (Math.abs(hero.body.y + hero.body.height / 2 - height / 2) > 110) failures.push(`${label}: hero body not vertically centered`)
    if (width === 1440 && hero.fontSize < 70) failures.push(`${label}: heading is too small`)
    if (hero.logoFilter === 'none') failures.push(`${label}: logo is dark over the hero`)
    if (pageErrors.length) failures.push(`${label}: ${pageErrors.join('; ')}`)
    await page.screenshot({ path: `${output}/hero-${label}.png` })

    if (width === 1440) {
      await page.locator('.services__intro').scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
      const services = await page.evaluate(() => {
        const intro = document.querySelector('.services__intro').getBoundingClientRect()
        const title = document.querySelector('.services__intro h2').getBoundingClientRect()
        const kicker = document.querySelector('.services__intro-kicker').getBoundingClientRect()
        const image = document.querySelector('.service-slide__visual').getBoundingClientRect()
        return {
          headingOffset: Math.abs(title.top - kicker.top),
          imageGap: image.top - intro.bottom,
        }
      })
      if (services.headingOffset > 70) failures.push(`${label}: service headings misaligned by ${services.headingOffset}px`)
      if (services.imageGap > 180) failures.push(`${label}: first service image starts ${services.imageGap}px after intro`)
      await page.locator('.services__intro').screenshot({ path: `${output}/services-intro-${theme}.png` })
      await page.evaluate(() => window.scrollTo({ top: document.querySelector('.hero-section').offsetHeight + 120, behavior: 'instant' }))
      await page.waitForTimeout(450)
      const logoOnContent = await page.locator('.brand-logo img').evaluate((logo) => getComputedStyle(logo).filter)
      if (theme === 'light' && logoOnContent !== 'none') failures.push(`${label}: logo filter over light content is ${logoOnContent}`)
    }
    await page.close()
  }
}

await browser.close()
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Refinement QA passed. Screenshots: ${output}`)
}
