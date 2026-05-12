import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../AuthContext'

function ThyroSenseLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="7" width="24" height="4" rx="2" fill="var(--accent)" />
      <rect x="14" y="11" width="4" height="16" rx="2" fill="var(--accent)" />
      <path
        d="M 8,9 L 11,9 L 12,7 L 13,12 L 14,6 L 15,12 L 16,9 L 19,9"
        stroke="var(--bg)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        background: 'var(--surface-alpha)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
      >
        <ThyroSenseLogo />
        <span
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}
        >
          ThyroSense
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
              {user.name}
              <span
                style={{
                  marginLeft: '0.5rem',
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: 'var(--accent)',
                  color: 'var(--accent-text)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {user.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: 'var(--accent)',
                color: 'var(--accent-text)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent-hover)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  )
}
