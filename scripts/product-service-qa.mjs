import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const failures = []
const output = '/tmp/anjora-product-service-qa'
await mkdir(output, { recursive: true })

for (const theme of ['dark', 'light']) {
  for (const width of [1440, 1024, 768, 430, 375]) {
    const page = await browser.newPage({ viewport: { width, height: width >= 1024 ? 900 : 820 } })
    const label = `${theme}-${width}`
    page.on('pageerror', (error) => failures.push(`${label}: ${error.message}`))
    await page.addInitScript((value) => localStorage.setItem('anjora-theme', value), theme)
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => document.fonts.ready)
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      cardCount: document.querySelectorAll('.product-preview .product-card').length,
      placeholders: document.querySelectorAll('.product-visual__placeholder').length,
      nestedLinks: document.querySelectorAll('.product-card a a').length,
      imageFailures: [...document.querySelectorAll('.product-card img')].filter((image) => image.complete && !image.naturalWidth).length,
      formBackground: getComputedStyle(document.querySelector('.enquiry-form')).backgroundColor,
      panelBackground: getComputedStyle(document.querySelector('.enquiry-section__panel')).backgroundColor,
    }))
    if (state.overflow || state.cardCount !== 3 || state.placeholders || state.nestedLinks || state.imageFailures || state.formBackground === state.panelBackground) {
      failures.push(`${label}: ${JSON.stringify(state)}`)
    }
    await page.locator('.product-preview').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await page.locator('.product-preview').screenshot({ path: `${output}/products-${label}.png` })
    await page.locator('.enquiry-section').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1100)
    await page.locator('.enquiry-section').screenshot({ path: `${output}/enquiry-${label}.png` })
    if (width === 1440) {
      await page.evaluate(() => {
        const spacer = document.querySelector('.services__pin').parentElement
        window.scrollTo({ top: spacer.getBoundingClientRect().top + scrollY + 10, behavior: 'instant' })
      })
      await page.waitForTimeout(950)
      const start = await page.evaluate(() => {
        const visual = document.querySelector('.service-slide__visual').getBoundingClientRect()
        const body = document.querySelector('.service-slide__body').getBoundingClientRect()
        return { delta: Math.abs(visual.top - body.top), current: document.querySelector('[data-service-current]').textContent }
      })
      if (start.delta > 15 || start.current !== '01') failures.push(`${label}: service start is ${JSON.stringify(start)}`)
      await page.screenshot({ path: `${output}/service-start-${label}.png` })
      await page.mouse.wheel(0, 700)
      await page.waitForTimeout(1100)
      const forward = await page.locator('[data-service-current]').textContent()
      await page.screenshot({ path: `${output}/service-forward-${label}.png` })
      await page.mouse.wheel(0, -700)
      await page.waitForTimeout(1100)
      const backward = await page.locator('[data-service-current]').textContent()
      if (forward === '01' || backward !== '01') failures.push(`${label}: progress did not advance and reverse (${forward} → ${backward})`)
    }
    await page.close()
  }
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.route('https://api.web3forms.com/submit', async (route) => {
  const payload = route.request().postDataJSON()
  if (!payload.message.includes('DL-01') || !payload.subject.includes('DL-01')) failures.push('Product context missing from Web3Forms payload')
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'OK' }) })
})
await page.goto(`${baseUrl}/products`, { waitUntil: 'domcontentloaded' })
if (await page.locator('.product-card__view').count()) failures.push('View product action remains')
await page.locator('.product-card__main').first().click()
await page.waitForURL('**/products/recessed-downlight-type-01')
if (!page.url().endsWith('/products/recessed-downlight-type-01')) failures.push('Product tile did not navigate to detail')
await page.reload({ waitUntil: 'domcontentloaded' })
await page.locator('#product-title').waitFor()
if (!await page.locator('#product-title').isVisible()) failures.push('Direct product detail refresh failed')
await page.goBack({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(450)
if (!page.url().endsWith('/products')) failures.push('Back navigation failed')
await page.goto(`${baseUrl}/products`, { waitUntil: 'domcontentloaded' })
await page.locator('.product-card .enquiry-button').first().click()
await page.waitForURL('**/?product=recessed-downlight-type-01#enquiry')
await page.locator('textarea[name="message"]').waitFor()
if (!page.url().includes('product=recessed-downlight-type-01') || !page.url().endsWith('#enquiry')) failures.push('Product enquiry did not open onsite form')
const message = await page.locator('textarea[name="message"]').inputValue()
if (!message.includes('DL-01')) failures.push('Product form was not prefilled')
await page.locator('input[name="name"]').fill('QA Visitor')
await page.locator('input[name="email"]').fill('qa@example.com')
await page.getByRole('button', { name: /send enquiry/i }).click()
await page.getByText('Your enquiry was accepted.').waitFor()
await page.reload({ waitUntil: 'domcontentloaded' })
await page.locator('textarea[name="message"]').waitFor()
if (!(await page.locator('textarea[name="message"]').inputValue()).includes('DL-01')) failures.push('Direct enquiry URL did not restore product context')
await page.goto(`${baseUrl}/products/does-not-exist`, { waitUntil: 'domcontentloaded' })
if (!await page.getByText('No matching product').isVisible()) failures.push('Invalid slug fallback failed')
await page.close()
await browser.close()
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1 }
else console.log(`Product and service QA passed. Screenshots: ${output}`)
