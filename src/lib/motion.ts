export const MOTION_FAST = 0.24
export const MOTION_BASE = 0.68
export const MOTION_SLOW = 1.05

export const EASE_UI = 'power2.out'
export const EASE_REVEAL = 'power3.out'
export const EASE_IN_OUT = 'power2.inOut'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
