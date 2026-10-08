import type { BlogPost } from '../data/blogs'

export type BlogGroupVariant = 'large-left' | 'large-right' | 'wide'

export interface BlogGroup {
  posts: BlogPost[]
  variant: BlogGroupVariant
}

const pattern = ['large-left', 'large-right', 'wide'] as const

export function createBlogGroups(posts: BlogPost[]) {
  const queue = [...posts]
  const groups: BlogGroup[] = []
  let index = 0

  while (queue.length > 0) {
    const variant = pattern[index % pattern.length]!
    if (queue.length === 1 || variant === 'wide') {
      groups.push({ posts: [queue.shift()!], variant: 'wide' })
    } else {
      groups.push({ posts: queue.splice(0, 2), variant })
    }
    index += 1
  }

  return groups
}
