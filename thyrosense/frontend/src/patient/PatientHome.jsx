import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../AuthContext'
import ClassBadge from './components/ClassBadge'

function StatCard({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1,
        minWidth: 160,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '1.4rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <span style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {label}
      </span>
      <div style={{
        fontFamily: 'Clash Display, sans-serif',
        fontWeight: 700,
        fontSize: '1.65rem',
        color: 'var(--text)',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
      }}>
        {value}
      </div>
    </motion.div>
  )
}

function EmptyClipboard() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" opacity="0.25">
      <rect x="14" y="10" width="36" height="44" rx="5" stroke="var(--text-muted)" strokeWidth="2" />
      <rect x="24" y="6" width="16" height="10" rx="3" stroke="var(--text-muted)" strokeWidth="2" />
      <line x1="22" y1="28" x2="42" y2="28" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="35" x2="38" y2="35" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="42" x2="34" y2="42" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function PatientHome() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const history = (() => {
    try { return JSON.parse(localStorage.getItem('thyrosense-history') || '[]') }
    catch { return [] }
  })()

  const lastName = user?.name?.split(' ')[0] || 'Patient'
  const accountSince = 'May 2026'
  const lastResult = history.length > 0 ? history[history.length - 1] : null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      {/* Greeting */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontFamily: 'Clash Display, sans-serif',
          fontWeight: 700,
          fontSize: '1.8rem',
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          margin: 0,
        }}>
          Welcome back, {lastName}
        </h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          marginTop: '0.3rem',
          marginBottom: 0,
        }}>
          Your thyroid health dashboard
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <StatCard label="Total Predictions" value={history.length} delay={0.05} />
        <StatCard
          label="Last Result"
          value={
            lastResult
              ? <ClassBadge diagnosisClass={lastResult.predicted_class} size="md" />
              : <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>None yet</span>
          }
          delay={0.1}
        />
        <StatCard label="Account Since" value={accountSince} delay={0.15} />
      </div>

      {/* Main row */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* CTA — 60% */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flex: '3 1 300px',
            borderRadius: 16,
            padding: '2rem',
            border: '1.5px solid var(--accent)',
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(135deg, var(--surface) 60%, color-mix(in srgb, var(--accent) 8%, var(--surface)) 100%)`,
          }}
        >
          {/* decorative ring */}
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', right: -30, top: -30, opacity: 0.06, pointerEvents: 'none' }}>
            <circle cx="90" cy="90" r="75" stroke="var(--accent)" strokeWidth="24" fill="none" />
          </svg>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
            borderRadius: 99,
            padding: '3px 10px',
            marginBottom: '1rem',
          }}>
            <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill="var(--accent)" /></svg>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              AI-Powered
            </span>
          </span>

          <h2 style={{
            fontFamily: 'Clash Display, sans-serif',
            fontWeight: 700,
            fontSize: '1.4rem',
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            marginBottom: '0.6rem',
            lineHeight: 1.25,
          }}>
            Start New Analysis
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            marginBottom: '1.5rem',
            maxWidth: 340,
          }}>
            Enter your thyroid panel results for an AI-powered diagnosis.
            Our XGBoost model is trained on 9,000+ clinical records with SHAP explainability.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/patient/predict')}
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            Begin Assessment
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2.5 7.5h10M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Recent Activity — 40% */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flex: '2 1 220px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <h3 style={{
              fontFamily: 'Clash Display, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text)',
              margin: 0,
            }}>
              Recent Activity
            </h3>
            {history.length > 0 && (
              <button
                onClick={() => navigate('/patient/history')}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                View all
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '0.75rem' }}>
              <EmptyClipboard />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                No predictions yet.<br />Run your first assessment.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {history.slice(-3).reverse().map((item, i) => (
                <div
                  key={item.id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 0.85rem',
                    background: 'color-mix(in srgb, var(--surface-hover) 60%, transparent)',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <ClassBadge diagnosisClass={item.predicted_class} size="sm" />
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'Clash Display, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--text)',
                  }}>
                    {Math.round((item.confidence || 0) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
