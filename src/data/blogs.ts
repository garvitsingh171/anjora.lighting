import outdoorIpRating from '../assets/blog/outdoor-ip-rating/cover-color.webp'
import landscapeLighting from '../assets/blog/landscape-lighting/cover-color.webp'
import smartHomeScenes from '../assets/blog/smart-home-scenes/cover-color.webp'
import lightingChecklist from '../assets/blog/lighting-checklist/cover-color.webp'
import lightingDesignCost from '../assets/blog/lighting-design-cost/cover-color.webp'
import lightingMistakes from '../assets/blog/lighting-mistakes/cover-color.webp'
import kitchenLighting from '../assets/blog/kitchen-lighting/cover-color.webp'
import bedroomLighting from '../assets/blog/bedroom-lighting/cover-color.webp'
import ledVoltageDrop from '../assets/blog/led-voltage-drop/cover-color.webp'
import daliLighting from '../assets/blog/dali-lighting/cover-color.webp'
import dmxLighting from '../assets/blog/dmx-lighting/cover-color.webp'
import facadeLighting from '../assets/blog/facade-lighting/cover-color.webp'
import beamAngle from '../assets/blog/beam-angle/cover-color.webp'
import falseCeilingLighting from '../assets/blog/false-ceiling-lighting/cover-color.webp'
import colorTemperature from '../assets/blog/color-temperature/cover-color.webp'
import layeredLighting from '../assets/blog/layered-lighting/cover-color.webp'
import architecturalLightingDesign from '../assets/blog/architectural-lighting-design/cover-color.webp'
import content from '../content/blog/posts.json'

export type BlogSection =
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; level: 2 | 3; content: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; content: string }
  | { type: 'image'; src: string; alt: string }

interface BlogContentRecord {
  slug: string
  assetFolder: string
  title: string
  excerpt: string
  publishedAt: string
  author: string
  readingTime: string
  category: string
  legacyUrl: string
  imageSource: string
  imageAlt: string
  sections: BlogSection[]
}

export interface BlogPost extends BlogContentRecord {
  featuredImage: string
  objectPosition?: string
}

const covers: Record<string, string> = {
  'outdoor-ip-rating': outdoorIpRating,
  'landscape-lighting': landscapeLighting,
  'smart-home-scenes': smartHomeScenes,
  'lighting-checklist': lightingChecklist,
  'lighting-design-cost': lightingDesignCost,
  'lighting-mistakes': lightingMistakes,
  'kitchen-lighting': kitchenLighting,
  'bedroom-lighting': bedroomLighting,
  'led-voltage-drop': ledVoltageDrop,
  'dali-lighting': daliLighting,
  'dmx-lighting': dmxLighting,
  'facade-lighting': facadeLighting,
  'beam-angle': beamAngle,
  'false-ceiling-lighting': falseCeilingLighting,
  'color-temperature': colorTemperature,
  'layered-lighting': layeredLighting,
  'architectural-lighting-design': architecturalLightingDesign,
}

export const blogPosts: BlogPost[] = (content as unknown as BlogContentRecord[]).map((post) => ({
  ...post,
  featuredImage: covers[post.assetFolder] ?? '',
}))

export const featuredBlogPost = blogPosts[0]!

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function getNextBlogPost(slug: string) {
  const index = blogPosts.findIndex((post) => post.slug === slug)
  return blogPosts[(index + 1) % blogPosts.length]!
}

export function getRelatedBlogPosts(slug: string, count = 3) {
  const index = blogPosts.findIndex((post) => post.slug === slug)
  return Array.from({ length: count }, (_, offset) => blogPosts[(index + offset + 1) % blogPosts.length]!)
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
