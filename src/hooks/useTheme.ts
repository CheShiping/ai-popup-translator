import { useEffect } from 'react'
import { useUIStore } from '../stores/ui'

export function useTheme() {
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    const applyTheme = (resolvedTheme: 'dark' | 'light') => {
      document.documentElement.setAttribute('data-theme', resolvedTheme)
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches ? 'dark' : 'light')

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light')
      }
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      applyTheme(theme)
    }
  }, [theme])

  return { theme, setTheme }
}
