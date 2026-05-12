import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ label, value, sub, accent = false, delay = 0, icon }) {
  const isNumber = typeof value === 'number'
  const [displayed, setDisplayed] = useState(isNumber ? 0 : value)
  const animRef = useRef(null)

  useEffect(() => {
    if (!isNumber) { setDisplayed(value); return }
    const start = performance.now()
    const duration = 900
    const run = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(value * eased))
      if (t < 1) animRef.current = requestAnimationFrame(run)
    }
    const timeout = setTimeout(() => { animRef.current = requestAnimationFrame(run) }, delay * 1000)
    return () => { clearTimeout(timeout); cancelAnimationFrame(animRef.current) }
  }, [value, isNumber, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: '1 1 160px', minWidth: 160,
        background: accent
          ? `linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, var(--surface)) 0%, var(--surface) 100%)`
          : 'var(--surface)',
        border: accent ? '1.5px solid color-mix(in srgb, var(--accent) 35%, transparent)' : '1px solid var(--border)',
        borderRadius: 14, padding: '1.35rem 1.4rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </span>
        {icon && <span style={{ opacity: 0.5 }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: accent ? 'var(--accent)' : 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {displayed}
      </div>
      {sub && (
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          {sub}
        </span>
      )}
    </motion.div>
  )
}
