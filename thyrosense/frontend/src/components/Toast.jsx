import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext(null)

const ICONS = {
  success: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="var(--success)" strokeWidth="1.4" />
      <path d="M4 7l2.5 2.5L10 5" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="var(--danger)" strokeWidth="1.4" />
      <path d="M5 5l4 4M9 5l-4 4" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="7" y1="6.5" x2="7" y2="10.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="4.5" r="0.7" fill="var(--accent)" />
    </svg>
  ),
}

const BORDER_COLORS = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--accent)' }

function ToastItem({ id, message, type, onDismiss }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -16, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
        padding: '0.85rem 1rem', borderRadius: 11,
        background: 'var(--surface)',
        border: `1px solid var(--border)`,
        borderLeft: `3px solid ${BORDER_COLORS[type] || 'var(--accent)'}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        minWidth: 260, maxWidth: 340, cursor: 'pointer',
      }}
      onClick={() => onDismiss(id)}
    >
      <span style={{ marginTop: 1, flexShrink: 0 }}>{ICONS[type] || ICONS.info}</span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.84rem', color: 'var(--text)', lineHeight: 1.5, flex: 1 }}>
        {message}
      </span>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counterRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++counterRef.current
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <ToastItem key={t.id} {...t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.toast
}
