export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'anjora-theme'

export const THEME_BACKGROUND: Record<Theme, string> = {
  dark: '#0e1c29',
  light: '#f3f1e8',
}

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export function getStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(storedTheme) ? storedTheme : null
  } catch {
    return null
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function getInitialTheme(): Theme {
  const appliedTheme = document.documentElement.dataset.theme
  if (isTheme(appliedTheme)) return appliedTheme
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  themeColor?.setAttribute('content', THEME_BACKGROUND[theme])
}

export function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Theme still applies for this visit when storage is unavailable.
  }
}
