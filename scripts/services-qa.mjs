import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const base = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const errors = []
page.on('pageerror', error => errors.push(error.message))

async function snapshot() {
  return page.evaluate(async () => {
    const { ScrollTrigger } = await import('/src/lib/gsap.ts')
    const slides = [...document.querySelectorAll('[data-service-slide]')].map((slide, index) => {
      const style = getComputedStyle(slide)
      const title = getComputedStyle(slide.querySelector('h3'))
      const image = slide.querySelector('img')
      return { index, opacity: Number(style.opacity), visible: style.visibility !== 'hidden', inert: slide.inert,
        hidden: slide.getAttribute('aria-hidden'), title: Number(title.opacity), titleVisible: title.visibility !== 'hidden',
        image: image.complete && image.naturalWidth > 0 }
    })
    return { slides, counter: Number(document.querySelector('[data-service-current]').textContent) - 1,
      pins: ScrollTrigger.getAll().filter(t => t.pin?.classList.contains('services__pin')).length,
      mainVisible: getComputedStyle(document.querySelector('main')).visibility === 'visible' }
  })
}
async function checkStage(label, expected) {
  const state = await snapshot()
  const active = state.slides[state.counter]
  assert.equal(state.pins, 1, `${label}: exactly one services pin`)
  assert(state.mainVisible, `${label}: main hidden`)
  assert(state.slides.some(s => s.visible && s.opacity >= 0.49 && s.title >= 0.99 && s.titleVisible && s.image), `${label}: blank stage`)
  assert(active.visible && active.opacity >= 0.49 && active.title >= 0.99 && active.titleVisible && !active.inert && active.hidden === 'false', `${label}: counter/presentation/accessibility disagree`)
  assert.equal(state.slides.filter(s => !s.inert).length, 1, `${label}: only active slide interactive`)
  if (expected !== undefined) assert.equal(state.counter, expected, `${label}: wrong service`)
}
async function seek(progress, wait = 400) {
  await page.evaluate(async p => {
    const { ScrollTrigger } = await import('/src/lib/gsap.ts')
    const trigger = ScrollTrigger.getAll().find(t => t.pin?.classList.contains('services__pin'))
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * p, behavior: 'instant' })
  }, progress)
  await page.waitForTimeout(wait)
}
async function cycle() {
  for (let i = 0; i < 7; i++) { await seek(i / 6); await checkStage(`forward ${i}`, i) }
  for (let i = 5; i >= 0; i--) { await seek(i / 6); await checkStage(`reverse ${i}`, i) }
  // Sample the handoff where the old implementation hid the current title.
  for (let i = 0; i < 6; i++) {
    for (const fraction of [.48, .68, .79, .9]) { await seek((i + fraction) / 6); await checkStage(`handoff ${i}/${fraction}`) }
  }
  for (const progress of [0, 1, .2, .95, .5, 0, 1]) { await seek(progress, 30); await checkStage(`fast ${progress}`) }
  await page.waitForTimeout(400)
  await checkStage('final release', 6)
}
try {
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)
  await cycle()
  await seek(.5)
  await page.locator('.theme-toggle--desktop').click()
  await page.waitForTimeout(700)
  await checkStage('theme', 3)
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.waitForTimeout(500)
  await seek(.5)
  await checkStage('resize', 3)
  for (const route of ['/projects', '/about-us', '/projects']) {
    await page.locator(`.desktop-nav a[href="${route}"]`).click()
    await page.waitForURL(`${base}${route}`)
    await page.locator('.brand-logo').click()
    await page.waitForURL(`${base}/`)
    await page.waitForTimeout(500)
    await seek(.5)
    await checkStage(`revisit ${route}`, 3)
  }
  await page.mouse.wheel(0, 1500); await page.waitForTimeout(600); await checkStage('wheel')
  await page.mouse.wheel(0, -900); await page.waitForTimeout(600); await checkStage('reverse wheel')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(500)
  let fallback = await snapshot()
  assert.equal(fallback.pins, 0)
  assert(fallback.slides.every(s => s.visible && s.opacity === 1 && !s.inert && s.hidden === null && s.title === 1), 'reduced motion fallback')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 430, height: 820 }); await page.waitForTimeout(500)
  fallback = await snapshot()
  assert.equal(fallback.pins, 0)
  assert(fallback.slides.every(s => s.visible && s.opacity === 1 && !s.inert), 'mobile fallback')
  assert.deepEqual(errors, [])
  console.log('Services QA passed: forward, reverse, handoffs, fast seek, wheel, theme, resize, 3 route revisits, reduced motion and mobile.')
} finally { await browser.close() }
