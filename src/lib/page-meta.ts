import { useEffect } from 'react'

interface PageMeta {
  title: string
  description: string
  canonical: string
  image?: string
  structuredData?: Record<string, unknown>
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title
    upsertMeta('meta[name="description"]', 'name', 'description', meta.description)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', meta.structuredData ? 'article' : 'website')
    if (meta.image) upsertMeta('meta[property="og:image"]', 'property', 'og:image', meta.image)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = meta.canonical

    const jsonLd = document.createElement('script')
    if (meta.structuredData) {
      jsonLd.type = 'application/ld+json'
      jsonLd.dataset.blogJsonLd = 'true'
      jsonLd.text = JSON.stringify(meta.structuredData)
      document.head.append(jsonLd)
    }

    return () => {
      jsonLd.remove()
    }
  }, [meta.canonical, meta.description, meta.image, meta.structuredData, meta.title])
}
