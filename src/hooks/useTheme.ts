import { useEffect } from 'react'
import { useSettingsStore } from '@stores/settingsStore'

export function useTheme() {
  const { appearance, updateAppearanceSettings } = useSettingsStore()
  const { theme, accentColor } = appearance

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (dark: boolean) => {
      root.classList.toggle('dark', dark)
    }

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mq.matches)
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      applyTheme(theme === 'dark')
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor)
  }, [accentColor])

  const resolvedTheme = (() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  })()

  return {
    theme,
    resolvedTheme,
    setTheme: (t: 'light' | 'dark' | 'system') => updateAppearanceSettings({ theme: t }),
  }
}
