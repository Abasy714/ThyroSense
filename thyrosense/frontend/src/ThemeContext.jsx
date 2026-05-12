import { createContext, useContext, useEffect, useState } from 'react'
import { themes, defaultTheme } from './themes'

const ThemeContext = createContext(null)

function applyTheme(theme) {
  const root = document.documentElement
  root.style.setProperty('--bg', theme.bg)
  root.style.setProperty('--surface', theme.surface)
  root.style.setProperty('--surface-hover', theme.surfaceHover)
  root.style.setProperty('--surface-alpha', theme.surfaceAlpha)
  root.style.setProperty('--border', theme.border)
  root.style.setProperty('--text', theme.text)
  root.style.setProperty('--text-muted', theme.textMuted)
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent-hover', theme.accentHover)
  root.style.setProperty('--accent-text', theme.accentText)
  root.style.setProperty('--danger', theme.danger)
  root.style.setProperty('--success', theme.success)
  root.style.setProperty('--warning', theme.warning)
}

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem('thyrosense-theme') || defaultTheme
  )

  const theme = themes[themeName] || themes[defaultTheme]

  useEffect(() => {
    document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease'
    applyTheme(theme)
    localStorage.setItem('thyrosense-theme', themeName)
  }, [themeName, theme])

  function setTheme(key) {
    if (themes[key]) setThemeName(key)
  }

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
