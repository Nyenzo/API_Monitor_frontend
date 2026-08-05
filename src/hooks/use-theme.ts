import { useEffect, useState, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

// Manage the UI theme preference with localStorage persistence
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem('api-monitor-theme') as Theme) || 'system'
  })

  // Apply the dark class to the document root based on theme preference
  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = t === 'dark' || (t === 'system' && prefersDark)
    root.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('api-monitor-theme', theme)
  }, [theme, applyTheme])

  // Listen for OS color-scheme changes and re-apply when in system mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => { if (theme === 'system') applyTheme('system') }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, applyTheme])

  return { theme, setTheme: setThemeState }
}
