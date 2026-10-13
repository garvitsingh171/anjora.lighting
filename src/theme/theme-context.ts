import { createContext } from 'react'
import type { Theme } from './theme'

export interface ThemeChangeOrigin {
  x: number
  y: number
}

export interface ThemeContextValue {
  theme: Theme
  isTransitioning: boolean
  setTheme: (theme: Theme, origin?: ThemeChangeOrigin) => void
  toggleTheme: (origin?: ThemeChangeOrigin) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
