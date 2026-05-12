import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../ThemeContext'
import { themes } from '../themes'

const themeKeys = Object.keys(themes)

export default function ThemeSwitcher() {
  const { themeName, setTheme, theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <AnimatePresence>
        {open &&
          themeKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28, delay: i * 0.04 }}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              <AnimatePresence>
                {hovered === key && (
                  <motion.div
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      right: 'calc(100% + 10px)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: themes[key].surface,
                      color: themes[key].text,
                      border: `1px solid ${themes[key].border}`,
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                      fontFamily: 'DM Sans, sans-serif',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    }}
                  >
                    {themes[key].name}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => { setTheme(key); setOpen(false) }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: themes[key].accent,
                  border: themeName === key ? '3px solid white' : '3px solid transparent',
                  cursor: 'pointer',
                  boxShadow: themeName === key
                    ? `0 0 0 2px ${themes[key].accent}, 0 4px 16px rgba(0,0,0,0.3)`
                    : '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: theme.accent,
          color: theme.accentText,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          outline: 'none',
        }}
        title="Switch theme"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <circle cx="12" cy="4"  r="2" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="4"  cy="12" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="20" cy="12" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="6.3"  cy="6.3"  r="1.8" fill="currentColor" opacity="0.5" />
          <circle cx="17.7" cy="6.3"  r="1.8" fill="currentColor" opacity="0.5" />
          <circle cx="6.3"  cy="17.7" r="1.8" fill="currentColor" opacity="0.5" />
          <circle cx="17.7" cy="17.7" r="1.8" fill="currentColor" opacity="0.5" />
        </svg>
      </motion.button>
    </div>
  )
}
