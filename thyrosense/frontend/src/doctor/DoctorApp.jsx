import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../AuthContext'
import api from '../api'

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="7" width="24" height="4" rx="2" fill="var(--accent)" />
      <rect x="14" y="11" width="4" height="16" rx="2" fill="var(--accent)" />
      <path d="M 8,9 L 11,9 L 12,7 L 13,12 L 14,6 L 15,12 L 16,9 L 19,9" stroke="var(--bg)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const PAGE_TITLES = {
  '/doctor': 'Clinical Overview',
  '/doctor/patients': 'Patient Roster',
  '/doctor/profile': 'My Profile',
}

const NAV_ITEMS = [
  {
    to: '/doctor', end: true, label: 'Overview',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" /></svg>,
  },
  {
    to: '/doctor/patients', label: 'Patients',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M1.5 13c0-3 2-4.5 4.5-4.5S10.5 10 10.5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="12" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.3" /><path d="M11 10.5c1.5 0 3.5.8 3.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
    badge: null,
  },
  {
    to: '/doctor/profile', label: 'Profile',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M2 14c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  },
]

export default function DoctorApp() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [highRiskCount, setHighRiskCount] = useState(0)

  useEffect(() => {
    const uid = JSON.parse(localStorage.getItem('thyrosense-user') || '{}').id
    api.get(`/patients?user_id=${uid}`).then(res => {
      const count = (res.data || []).filter(p => p.risk_level === 'high').length
      setHighRiskCount(count)
    }).catch(() => {})
  }, [])

  const navItems = NAV_ITEMS.map(item =>
    item.to === '/doctor/patients' ? { ...item, badge: highRiskCount } : item
  )

  const pageTitle = Object.entries(PAGE_TITLES).reverse().find(([path]) => location.pathname.startsWith(path))?.[1] || 'Doctor Portal'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', paddingTop: 64 }}>
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 260, position: 'fixed', left: 0, top: 64, bottom: 0,
          background: 'var(--surface)', borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', zIndex: 50, overflowY: 'auto',
        }}
      >
        <div style={{ padding: '1.25rem 1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border)' }}>
          <Logo />
          <div>
            <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.02em', display: 'block' }}>ThyroSense</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Physician Portal</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.63rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
            Navigation
          </p>
          {navItems.map(({ to, end, label, icon, badge }) => (
            <NavLink
              key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 0.75rem', borderRadius: 9, textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                background: isActive ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                transition: 'all 0.18s ease',
              })}
            >
              {icon}
              <span style={{ flex: 1 }}>{label}</span>
              {badge > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 99, background: 'var(--danger)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.62rem', fontWeight: 700 }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.83rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.3rem' }}>
              Dr. {user?.name || 'Doctor'}
            </div>
            <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 99, background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Physician
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/') }}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M4.5 1.5H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M9 9.5l3-3-3-3M12 6.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </button>
        </div>
      </motion.aside>

      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
        <header style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: '1px solid var(--border)', background: 'var(--surface-alpha)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
            {pageTitle}
          </h2>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </header>
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
