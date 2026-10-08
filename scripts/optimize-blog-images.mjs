import { readdir, readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const root = 'src/assets/blog'
const folders = await readdir(root)
const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()

for (const folder of folders) {
  const source = `${root}/${folder}/cover-color.png`
  const target = `${root}/${folder}/cover-color.webp`
  const input = await readFile(source)
  const dataUrl = `data:image/png;base64,${input.toString('base64')}`
  const output = await page.evaluate(async (url) => {
    const image = new Image()
    image.src = url
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    canvas.getContext('2d').drawImage(image, 0, 0)
    return canvas.toDataURL('image/webp', 0.86).split(',')[1]
  }, dataUrl)
  await writeFile(target, Buffer.from(output, 'base64'))
  console.log(`Optimized ${folder}/cover-color.webp`)
}

await browser.close()
