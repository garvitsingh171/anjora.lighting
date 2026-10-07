import { chromium } from 'playwright-core'

const baseUrl = process.env.ANJORA_QA_URL ?? 'http://127.0.0.1:5173'
const errors = []
let requestCount = 0
let requestPayload
let responseMode = 'success'

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.emulateMedia({ reducedMotion: 'reduce' })
page.on('pageerror', (error) => errors.push(`page error: ${error.message}`))

await page.route('https://api.web3forms.com/submit', async (route) => {
  requestCount += 1
  requestPayload = route.request().postDataJSON()

  if (responseMode === 'network-error') {
    await route.abort('failed')
    return
  }

  await route.fulfill({
    status: responseMode === 'success' ? 200 : 400,
    contentType: 'application/json',
    body: JSON.stringify(responseMode === 'success'
      ? { success: true, message: 'Email sent successfully!' }
      : { success: false, message: 'Invalid access key' }),
  })
})

async function fillValidForm() {
  await page.getByLabel('Name', { exact: true }).fill('Test User')
  await page.getByLabel('Email', { exact: true }).fill('test@example.com')
  await page.getByLabel('Phone', { exact: true }).fill('+91 98765 43210')
  await page.getByLabel('Project type', { exact: true }).selectOption('Commercial')
  await page.getByLabel('Tell us about your project', { exact: true }).fill('Testing Anjora website enquiry form.')
}

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
const initialUrl = page.url()
await page.getByRole('button', { name: /send enquiry/i }).click()
if (requestCount !== 0) errors.push('blank invalid form sent an API request')
if (await page.locator('.enquiry-form__field-error').count() !== 3) errors.push('blank invalid form did not show three field errors')

await page.getByLabel('Name', { exact: true }).fill('Test User')
await page.getByLabel('Email', { exact: true }).fill('abc@')
await page.getByLabel('Tell us about your project', { exact: true }).fill('short')
await page.getByRole('button', { name: /send enquiry/i }).click()
if (requestCount !== 0) errors.push('syntactically invalid form sent an API request')
if (await page.locator('[aria-invalid="true"]').count() !== 2) errors.push('email/minimum-message validation did not mark two fields invalid')

await page.getByLabel('Email', { exact: true }).fill('test@example.com')
await page.getByLabel('Phone', { exact: true }).fill('+91 98765 43210')
await page.getByLabel('Project type', { exact: true }).selectOption('Commercial')
await page.getByLabel('Tell us about your project', { exact: true }).fill('Testing Anjora website enquiry form.')
await page.getByRole('button', { name: /send enquiry/i }).click()
await page.getByRole('button', { name: /enquiry sent/i }).waitFor()

if (requestCount !== 1) errors.push(`valid form sent ${requestCount} requests instead of one`)
if (page.url() !== initialUrl) errors.push('successful submission navigated away from the website')
if (await page.getByLabel('Name', { exact: true }).inputValue() !== '') errors.push('successful submission did not clear the form')
if (!(await page.getByRole('button', { name: /enquiry sent/i }).isDisabled())) errors.push('success button was re-enabled with an empty form')

const expectedPayload = {
  subject: 'New Website Enquiry | Anjora Lighting',
  from_name: 'Anjora Lighting Website',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+91 98765 43210',
  project_type: 'Commercial',
  message: 'Testing Anjora website enquiry form.',
  botcheck: false,
}
for (const [key, value] of Object.entries(expectedPayload)) {
  if (requestPayload?.[key] !== value) errors.push(`payload field ${key} was incorrect`)
}
if (!requestPayload?.access_key || !requestPayload?.page_url) errors.push('payload omitted access_key or page_url')

responseMode = 'failure'
await page.reload({ waitUntil: 'domcontentloaded' })
await fillValidForm()
await page.getByRole('button', { name: /send enquiry/i }).click()
await page.getByRole('button', { name: /try again/i }).waitFor()
if (await page.getByLabel('Name', { exact: true }).inputValue() !== 'Test User') errors.push('API failure cleared entered form values')
if (await page.locator('.enquiry-form__feedback--success').count()) errors.push('API failure displayed success feedback')

responseMode = 'network-error'
await page.reload({ waitUntil: 'domcontentloaded' })
await fillValidForm()
await page.getByRole('button', { name: /send enquiry/i }).click()
await page.getByRole('button', { name: /try again/i }).waitFor()
if (await page.getByLabel('Email', { exact: true }).inputValue() !== 'test@example.com') errors.push('network failure cleared entered form values')

responseMode = 'success'
await page.goto(`${baseUrl}/projects/kingsman`, { waitUntil: 'domcontentloaded' })
await fillValidForm()
await page.getByRole('button', { name: /send enquiry/i }).click()
await page.getByRole('button', { name: /enquiry sent/i }).waitFor()
if (requestPayload?.interested_project !== 'Kingsman' || requestPayload?.source !== 'Project Detail') {
  errors.push('project detail enquiry omitted its project context')
}

for (const width of [375, 430, 768, 1440]) {
  await page.setViewportSize({ width, height: width < 600 ? 800 : 900 })
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  const form = page.locator('.enquiry-form')
  await form.scrollIntoViewIfNeeded()
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  if (dimensions.content > dimensions.viewport + 1) errors.push(`${width}px viewport has horizontal overflow`)
  const buttonBox = await page.getByRole('button', { name: /send enquiry/i }).boundingBox()
  if (!buttonBox || buttonBox.x < 0 || buttonBox.x + buttonBox.width > width + 1) errors.push(`${width}px submit button is outside the viewport`)
}

await browser.close()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log('Enquiry QA complete: validation, success, API failure, network failure, context, and responsive layouts passed.')
}
