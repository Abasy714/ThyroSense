import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../AuthContext'
import ECGLine from '../components/ECGLine'

const fieldVariant = {
  hidden: { opacity: 0, x: 20 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

function LogoMark() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="8" y="16" width="40" height="7" rx="3.5" fill="var(--accent)" />
      <rect x="24.5" y="23" width="7" height="24" rx="3.5" fill="var(--accent)" />
      <path
        d="M 14,19.5 L 20,19.5 L 22,15 L 24,24 L 26,11 L 28,24 L 30,19.5 L 38,19.5"
        stroke="var(--bg)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [role, setRole] = useState(location.state?.role || 'patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const userData = await login(email, password, role)
      navigate(userData.role === 'doctor' ? '/doctor' : '/patient')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)', paddingTop: 64 }}>
      {/* Left panel */}
      <div
        style={{
          width: '40%',
          minHeight: 'calc(100vh - 64px)',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '4rem 3rem 0',
        }}
      >
        <div>
          <LogoMark />
          <h1
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
              color: 'var(--text)',
              letterSpacing: '-0.03em',
              marginTop: '2rem',
              lineHeight: 1.2,
            }}
          >
            Clinical intelligence,
            <br />
            beautifully delivered.
          </h1>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              marginTop: '1rem',
              lineHeight: 1.65,
              maxWidth: 280,
            }}
          >
            Thyroid disorder detection powered by XGBoost and trained on 9,000+ clinical records.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Instant diagnostic predictions', 'SHAP-powered explainability', 'Built for clinicians'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'var(--accent-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ paddingBottom: '1.5rem' }}>
          <ECGLine height={60} opacity={0.25} speed={3.5} />
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontWeight: 700,
                fontSize: '1.9rem',
                color: 'var(--text)',
                letterSpacing: '-0.02em',
                marginBottom: '0.4rem',
              }}
            >
              Welcome back
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Sign in to your ThyroSense account
            </p>

            {/* Role toggle */}
            <div
              style={{
                display: 'flex',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 4,
                marginBottom: '2rem',
              }}
            >
              {['patient', 'doctor'].map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    borderRadius: 7,
                    border: 'none',
                    background: role === r ? 'var(--accent)' : 'transparent',
                    color: role === r ? 'var(--accent-text)' : 'var(--text-muted)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {r === 'doctor' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                      <rect x="18" y="8" width="2" height="5" rx="1"/>
                      <rect x="15.5" y="10.5" width="7" height="2" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                    </svg>
                  )}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Email address', type: 'email', value: email, onChange: setEmail, placeholder: 'you@clinic.com', i: 0 },
                { label: 'Password', type: 'password', value: password, onChange: setPassword, placeholder: '••••••••', i: 1 },
              ].map(({ label, type, value, onChange, placeholder, i }) => (
                <motion.div key={label} custom={i} variants={fieldVariant} initial="hidden" animate="show">
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      marginBottom: '0.4rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 9,
                      border: '1.5px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </motion.div>
              ))}

              <motion.button
                custom={2}
                variants={fieldVariant}
                initial="hidden"
                animate="show"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'var(--accent-text)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
              >
                Sign In
              </motion.button>
            </form>

            <p
              style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
              }}
            >
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
