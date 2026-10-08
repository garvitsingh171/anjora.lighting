import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const entries = [
  ['how-to-choose-outdoor-lights-ip-rating-explained', 'outdoor-ip-rating', '4 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_33_59-PM.png'],
  ['why-landscape-lighting-is-essential-for-farmhouses-villas', 'landscape-lighting', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_34_01-PM.png'],
  ['smart-home-lighting-scenes-10-must-have-scenes-for-luxury-homes', 'smart-home-scenes', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_34_03-PM.png'],
  ['complete-lighting-checklist-before-interior-work-starts', 'lighting-checklist', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_37_37-PM.png'],
  ['lighting-design-cost-in-india-what-affects-pricing', 'lighting-design-cost', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_38_16-PM.png'],
  ['lighting-mistakes-people-make-in-luxury-homes-and-how-to-fix-them', 'lighting-mistakes', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_39_52-PM.png'],
  ['kitchen-lighting-design-under-cabinet-task-lights-practical-tips', 'kitchen-lighting', '4 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_41_00-PM.png'],
  ['best-lighting-for-bedroom-soft-calm-glare-free-setup', 'bedroom-lighting', '4 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_42_32-PM.png'],
  ['how-to-avoid-led-strip-voltage-drop-simple-calculation-best-practices', 'led-voltage-drop', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_43_25-PM.png'],
  ['dali-lighting-control-system-benefits-for-homes-hotels-offices', 'dali-lighting', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_44_33-PM.png'],
  ['dmx-lighting-explained-best-for-rgb-pixel-dynamic-lighting', 'dmx-lighting', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_45_56-PM.png'],
  ['facade-lighting-design-in-india-dos-donts', 'facade-lighting', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_46_54-PM.png'],
  ['how-to-choose-the-right-beam-angle-15-vs-24-vs-36', 'beam-angle', '4 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_52_29-PM.png'],
  ['false-ceiling-lighting-ideas-for-living-room-modern-minimal', 'false-ceiling-lighting', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_53_09-PM.png'],
  ['warm-white-vs-cool-white-vs-neutral-white-best-color-temperature-for-indianhomes', 'color-temperature', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_53_55-PM.png'],
  ['layered-lighting-how-to-light-a-home-like-a-luxury-villa', 'layered-lighting', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/02/ChatGPT-Image-Feb-3-2026-06_56_55-PM.png'],
  ['architectural-lighting-design-in-india', 'architectural-lighting-design', '5 min read', 'https://anjora.lighting/wp-content/uploads/2026/01/ChatGPT-Image-Jan-30-2026-06_55_35-PM-1-e1769838691808.png'],
]

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

async function loadArticle(url) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    for (let elapsed = 0; elapsed < 70_000; elapsed += 2_000) {
      if (await page.locator('.entry-content').count()) return
      await page.waitForTimeout(2_000)
    }
  }
  throw new Error(`Article content did not become available: ${url}`)
}

const posts = []

for (const [slug, assetFolder, readingTime, imageSource] of entries) {
  const legacyUrl = `https://anjora.lighting/${slug === 'layered-lighting-how-to-light-a-home-like-a-luxury-villa' ? '2026/01/24' : slug === 'architectural-lighting-design-in-india' ? '2026/01/21' : '2026/01/27'}/${slug}/`
  await loadArticle(legacyUrl)

  const extracted = await page.locator('.entry-content').evaluate((container) => {
    const sections = []
    const unsupported = []

    for (const element of container.children) {
      const tag = element.tagName.toLowerCase()
      const content = element.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      if (!content && tag !== 'figure') continue

      if (tag === 'h1') continue
      if (tag === 'h2' || tag === 'h3') {
        sections.push({ type: 'heading', level: Number(tag.slice(1)), content })
      } else if (tag === 'p') {
        sections.push({ type: 'paragraph', content })
      } else if (tag === 'ul' || tag === 'ol') {
        sections.push({
          type: 'list',
          ordered: tag === 'ol',
          items: [...element.querySelectorAll(':scope > li')]
            .map((item) => item.textContent?.replace(/\s+/g, ' ').trim() ?? '')
            .filter(Boolean),
        })
      } else if (tag === 'blockquote') {
        sections.push({ type: 'quote', content })
      } else if (tag === 'figure' && element !== container.lastElementChild && !element.classList.contains('wp-block-post-featured-image')) {
        const image = element.querySelector('img')
        if (image) sections.push({ type: 'image', src: image.currentSrc || image.src, alt: image.alt })
      } else if (tag === 'figure') {
        continue
      } else if (tag !== 'hr') {
        unsupported.push(tag)
      }
    }

    return {
      title: container.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      sections,
      unsupported,
    }
  })

  if (!extracted.title) {
    extracted.title = (await page.locator('h1.title').first().innerText()).replace(/\s+/g, ' ').trim()
  }

  if (extracted.unsupported.length) {
    throw new Error(`${slug} contains unsupported blocks: ${[...new Set(extracted.unsupported)].join(', ')}`)
  }

  const introduction = extracted.sections
    .filter((section) => section.type === 'paragraph')
    .slice(0, 2)
    .map((section) => section.content)
    .join(' ')
  const excerpt = introduction.length > 230
    ? `${introduction.slice(0, 227).replace(/\s+\S*$/, '')}…`
    : introduction
  const publishedAt = slug === 'layered-lighting-how-to-light-a-home-like-a-luxury-villa'
    ? '2026-01-24'
    : slug === 'architectural-lighting-design-in-india'
      ? '2026-01-21'
      : '2026-01-27'

  posts.push({
    slug,
    assetFolder,
    title: extracted.title,
    excerpt,
    publishedAt,
    author: 'shubham',
    readingTime,
    category: 'BLOG',
    legacyUrl,
    imageSource,
    imageAlt: `${extracted.title} — Anjora Lighting insight`,
    sections: extracted.sections,
  })

  console.log(`Extracted ${slug}: ${extracted.sections.length} blocks`)
}

await mkdir('src/content/blog', { recursive: true })
await writeFile('src/content/blog/posts.json', `${JSON.stringify(posts, null, 2)}\n`)

for (const post of posts) {
  const directory = `src/assets/blog/${post.assetFolder}`
  await mkdir(directory, { recursive: true })
  const response = await context.request.get(post.imageSource, { timeout: 90_000 })
  if (!response.ok()) throw new Error(`Image download failed (${response.status()}): ${post.imageSource}`)
  await writeFile(`${directory}/cover.png`, await response.body())
  console.log(`Downloaded ${post.assetFolder}/cover.png`)
}

await browser.close()
