import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../AuthContext'
import ECGLine from '../components/ECGLine'

const fieldVariant = {
  hidden: { opacity: 0, x: 20 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

function InputField({ label, type = 'text', value, onChange, placeholder, required = true, i }) {
  return (
    <motion.div custom={i} variants={fieldVariant} initial="hidden" animate="show">
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
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 14px',
          borderRadius: 9,
          border: '1.5px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.9rem',
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
  )
}

function LogoMark() {
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
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

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [role, setRole] = useState('patient')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [licenseNo, setLicenseNo] = useState('')
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).slice(2, 9),
      name,
      email,
      role,
    }
    login(mockUser)
    navigate(role === 'doctor' ? '/doctor' : '/patient')
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
            Join thousands of{' '}
            <span style={{ color: 'var(--accent)' }}>clinicians</span>
            <br />
            already using ThyroSense.
          </h1>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              marginTop: '1.25rem',
              lineHeight: 1.65,
              maxWidth: 280,
            }}
          >
            Create your account in under a minute.
            No credit card required.
          </p>
        </div>
        <div style={{ paddingBottom: '1.5rem' }}>
          <ECGLine height={60} opacity={0.25} speed={3.5} />
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
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
              Create account
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Start detecting thyroid disorders with AI
            </p>

            {/* Role toggle */}
            <div
              style={{
                display: 'flex',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 4,
                marginBottom: '1.5rem',
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
                  }}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" i={0} />
              <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@clinic.com" i={1} />
              <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" i={2} />
              <InputField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" i={3} />

              <AnimatePresence mode="wait">
                {role === 'doctor' && (
                  <motion.div
                    key="doctor-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <InputField
                      label="Medical License Number"
                      value={licenseNo}
                      onChange={setLicenseNo}
                      placeholder="e.g. MED-2024-00123"
                      i={4}
                    />
                  </motion.div>
                )}
                {role === 'patient' && (
                  <motion.div
                    key="patient-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
                  >
                    <InputField label="Date of Birth" type="date" value={dob} onChange={setDob} placeholder="" i={4} />
                    <InputField label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="+1 555 000 0000" i={5} />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'var(--danger)', margin: 0 }}>
                  {error}
                </p>
              )}

              <motion.button
                custom={6}
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
                  marginTop: '0.4rem',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
              >
                Create Account
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
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
