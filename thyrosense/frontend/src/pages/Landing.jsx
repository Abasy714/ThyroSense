import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ECGLine from '../components/ECGLine'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const wordVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Landing() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 64,
      }}
    >
      {/* Radial accent bloom */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      />

      {/* ECG line */}
      <div
        style={{
          position: 'absolute',
          bottom: '28%',
          left: 0,
          right: 0,
          pointerEvents: 'none',
        }}
      >
        <ECGLine height={100} opacity={0.18} speed={4} />
      </div>

      {/* Hero */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: 860,
          padding: '0 2rem',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '6px 16px',
            borderRadius: 99,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontFamily: 'DM Sans, sans-serif',
            marginBottom: '2.5rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'inline-block',
            }}
          />
          AI-powered endocrine diagnostics
        </motion.div>

        {/* Headline */}
        <motion.div variants={container} initial="hidden" animate="show">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '0.15rem',
            }}
          >
            {['Diagnose', 'Smarter.'].map((word, i) => (
              <motion.span
                key={word}
                variants={wordVariant}
                style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: i === 1 ? 'var(--accent)' : 'var(--text)',
                  display: 'inline-block',
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Treat', 'Faster.'].map(word => (
              <motion.span
                key={word}
                variants={wordVariant}
                style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: 'var(--text)',
                  display: 'inline-block',
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.68 }}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-muted)',
            margin: '1.75rem auto 2.75rem',
            lineHeight: 1.65,
            maxWidth: 500,
          }}
        >
          AI-powered thyroid disorder detection trusted by clinicians.
          <br />
          Results in seconds. Explained in plain language.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link
            to="/login"
            state={{ role: 'doctor' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '14px 32px',
              borderRadius: 12,
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 28px var(--accent), 0 8px 24px rgba(0,0,0,0.2)'
              e.currentTarget.style.background = 'var(--accent-hover)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = 'var(--accent)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
              <rect x="18" y="7" width="2" height="6" rx="1"/>
              <rect x="15" y="10" width="8" height="2" rx="1"/>
            </svg>
            I'm a Doctor
          </Link>

          <Link
            to="/login"
            state={{ role: 'patient' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '14px 32px',
              borderRadius: 12,
              background: 'var(--surface)',
              color: 'var(--text)',
              textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: '1px solid var(--border)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)'
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
            </svg>
            I'm a Patient
          </Link>
        </motion.div>
      </div>

      {/* Live stat card — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '12px 20px',
          borderRadius: 12,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 10,
        }}
      >
        <span style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'block',
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: -3,
              borderRadius: '50%',
              border: '2px solid var(--accent)',
              animation: 'pulse-ring 1.8s ease-out infinite',
            }}
          />
        </span>
        <div>
          <div
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}
          >
            9,172
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Clinical Records
          </div>
        </div>
      </motion.div>
    </div>
  )
}
