import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

// Every URL below is served by anjora.lighting and was verified against either
// the live project page, its WordPress media attachments, or the homepage.
const assets = {
  kingsman: [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2026/01/images-1.jpg'],
  ],
  'city-palace': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2026/01/Mubarak_Mahal_at_Night_378e1e68f1-1-scaled.jpg'],
  ],
  'facade-3': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture35-e1706863476220.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture34-e1706863495140.jpg'],
  ],
  'facade-2': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture33-e1706863542280.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture32.jpg'],
  ],
  'facade-1': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture31-e1706298030986.jpg'],
  ],
  'office-3': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture29-e1706863593359.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture30-e1706863577892.jpg'],
  ],
  'office-2': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture27-e1706863652233.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture28-e1706863615957.jpg'],
  ],
  'office-1': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture25-e1706863682916.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture26-e1706863668108.jpg'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture24-e1706863697550.jpg'],
  ],
  theatre: [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture23-e1706863710417.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture22-e1706863725471.jpg'],
  ],
  'gym-ajmer': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture21.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture20.jpg'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture19.jpg'],
    ['gallery-03.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture18.jpg'],
    ['gallery-04.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture17.jpg'],
  ],
  'hobs-and-taters': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture16-e1706863773222.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture14-e1706863760580.jpg'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture15-e1706863745843.jpg'],
  ],
  turmeric: [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/turmeric.jpg'],
  ],
  'code-black': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/code-black-1-e1706296626854.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture12-e1706296568743.jpg'],
  ],
  ohana: [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture10-e1706863791901.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/OIP-1.jpg'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/OIP.jpg'],
    ['gallery-03.webp', 'https://anjora.lighting/wp-content/uploads/2024/01/ohana-cocktail-bar-and-kitchen-malviya-nagar-jaipur-lounge-bars-fjmqges2b3-250.webp'],
    ['gallery-04.webp', 'https://anjora.lighting/wp-content/uploads/2024/01/ohana-cocktail-bar-and-kitchen-malviya-nagar-jaipur-lounge-bars-5ffp41hg1b-250.webp'],
    ['gallery-05.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/ohanaa.jpg'],
  ],
  baramasi: [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/baramasi-peacock-gate.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/488954172.jpg'],
  ],
  neo: [
    ['cover.jpeg', 'https://anjora.lighting/wp-content/uploads/2024/01/restaurant_692286_restaurant220231216152644.jpeg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture2-e1706295503157.jpg'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2024/01/Picture3-e1706295472643.jpg'],
  ],
  dyore: [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/a000049966.jpg'],
    ['gallery-01.png', 'https://anjora.lighting/wp-content/uploads/2023/12/1.png'],
    ['gallery-02.png', 'https://anjora.lighting/wp-content/uploads/2023/12/dyore2.png'],
  ],
  boozup: [
    ['cover.webp', 'https://anjora.lighting/wp-content/uploads/2023/12/unnamed.webp'],
    ['gallery-01.png', 'https://anjora.lighting/wp-content/uploads/2023/12/1.png'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/Picture4-e1706863826447.jpg'],
    ['gallery-03.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/Picture5-e1706863811889.jpg'],
  ],
  'vr-theme-park': [
    ['cover.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/IMG_5972-1920x2560.jpg'],
    ['gallery-01.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/IMG_5964-1920x1440.jpg'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/VR-PARK-03-450x359-custom.jpg'],
    ['gallery-03.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/IMG_5999-1920x1440.jpg'],
  ],
  rosado: [
    ['cover.jpeg', 'https://anjora.lighting/wp-content/uploads/2023/12/banquet-halls-rosado-catering-setup_15_447360-168422601836157.jpeg'],
    ['gallery-01.jpeg', 'https://anjora.lighting/wp-content/uploads/2023/12/banquet-halls-rosado-terrace-4_15_447360-168422607680466.jpeg'],
    ['gallery-02.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/360_bg_2.jpg'],
    ['gallery-03.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/360-3.jpg'],
    ['gallery-04.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/rosado_bar.jpg'],
    ['gallery-05.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/slider_7.jpg'],
    ['gallery-06.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/slider_4.jpg'],
    ['gallery-07.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/slider_3.jpg'],
    ['gallery-08.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/slider_1.jpg'],
    ['gallery-09.jpg', 'https://anjora.lighting/wp-content/uploads/2023/12/did_you_know_img2.jpg'],
  ],
}

let downloaded = 0
let skipped = 0

for (const [project, files] of Object.entries(assets)) {
  for (const [filename, url] of files) {
    const destination = resolve(root, 'src/assets/projects', project, filename)
    await mkdir(dirname(destination), { recursive: true })

    try {
      if ((await stat(destination)).size > 0) {
        skipped += 1
        continue
      }
    } catch {
      // The asset has not been downloaded yet.
    }

    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
    await writeFile(destination, Buffer.from(await response.arrayBuffer()))
    downloaded += 1
    console.log(`Downloaded ${project}/${filename}`)
  }
}

console.log(`Complete: ${downloaded} downloaded, ${skipped} already present.`)
