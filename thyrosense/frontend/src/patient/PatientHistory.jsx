import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ClassBadge from './components/ClassBadge'
import ShapChart from './components/ShapChart'
import api from '../api'

const CLASS_COLORS = {
  healthy: '#10B981',
  hypothyroid: '#3B82F6',
  hyperthyroid: '#EF4444',
  binding_protein_disorder: '#8B5CF6',
}

function EmptyState({ onCTA }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '1.25rem' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.2">
        <rect x="14" y="10" width="52" height="60" rx="6" stroke="var(--text-muted)" strokeWidth="2.5" />
        <rect x="28" y="4" width="24" height="14" rx="4" stroke="var(--text-muted)" strokeWidth="2.5" />
        <line x1="24" y1="36" x2="56" y2="36" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="47" x2="50" y2="47" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="58" x2="44" y2="58" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', margin: '0 0 0.4rem' }}>
          No predictions yet
        </h3>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.87rem', color: 'var(--text-muted)', margin: 0 }}>
          Run your first thyroid assessment to see results here
        </p>
      </div>
      <button
        onClick={onCTA}
        style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: 'var(--accent-text)', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s ease' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
      >
        Begin Assessment
      </button>
    </div>
  )
}

function ConfidenceBar({ confidence }) {
  const pct = Math.round((confidence || 0) * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden', minWidth: 50 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', minWidth: 34, textAlign: 'right' }}>
        {pct}%
      </span>
    </div>
  )
}

function Drawer({ item, onClose }) {
  const classColor = CLASS_COLORS[item.predicted_class] || '#6B7280'
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 440, maxWidth: '92vw',
          background: 'var(--surface)', borderLeft: '1px solid var(--border)',
          zIndex: 201, overflowY: 'auto', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.3rem' }}>
              {new Date(item.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
              Prediction Details
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-hover)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '1.1rem', background: `${classColor}0D`, border: `1.5px solid ${classColor}40`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ClassBadge diagnosisClass={item.predicted_class} size="md" />
          <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: classColor, letterSpacing: '-0.02em' }}>
            {Math.round((item.confidence || 0) * 100)}%
          </span>
        </div>

        {item.top_features?.length > 0 && (
          <div style={{ background: 'color-mix(in srgb, var(--surface-hover) 70%, transparent)', borderRadius: 12, padding: '1rem' }}>
            <h4 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', margin: '0 0 0.75rem' }}>
              Key Factors
            </h4>
            <ShapChart features={item.top_features} classColor={classColor} />
          </div>
        )}

        {item.form_data && (
          <div>
            <h4 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', margin: '0 0 0.75rem' }}>
              Input Summary
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[
                ['Age', item.form_data.age],
                ['Sex', item.form_data.sex === 'M' ? 'Male' : item.form_data.sex === 'F' ? 'Female' : item.form_data.sex],
                ['TSH', item.form_data.TSH ?? '—'],
                ['T3', item.form_data.T3 ?? '—'],
                ['TT4', item.form_data.TT4 ?? '—'],
                ['FTI', item.form_data.FTI ?? '—'],
              ].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.55rem 0.8rem' }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}

export default function PatientHistory() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const uid = JSON.parse(localStorage.getItem('thyrosense-user') || '{}').id
    api.get(`/patients/me?user_id=${uid}`).then(res => {
      setHistory(res.data.predictions || [])
    }).catch(() => {})
  }, [])

  const sorted = [...history]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>
            My Predictions
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0 }}>
            {history.length} prediction{history.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/patient/predict')}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: 'var(--accent-text)', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s ease' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <line x1="6.5" y1="1.5" x2="6.5" y2="11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="1.5" y1="6.5" x2="11.5" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Assessment
        </motion.button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {sorted.length === 0 ? (
          <EmptyState onCTA={() => navigate('/patient/predict')} />
        ) : (
          <>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr 1.3fr 1fr 100px', gap: '1rem', padding: '0.75rem 1.25rem', background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
              {['Date', 'Diagnosis', 'Confidence', 'Top Factor', ''].map(h => (
                <span key={h} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </span>
              ))}
            </div>
            {/* Data rows */}
            {sorted.map((item, i) => {
              const topFeat = item.top_features?.[0]
              const even = i % 2 === 0
              return (
                <div
                  key={item.id || i}
                  onClick={() => setSelected(item)}
                  style={{
                    display: 'grid', gridTemplateColumns: '1.1fr 1.2fr 1.3fr 1fr 100px',
                    gap: '1rem', padding: '0.9rem 1.25rem', alignItems: 'center',
                    background: even ? 'var(--surface)' : 'color-mix(in srgb, var(--surface-hover) 50%, var(--surface))',
                    borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer', transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = even ? 'var(--surface)' : 'color-mix(in srgb, var(--surface-hover) 50%, var(--surface))')}
                >
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <ClassBadge diagnosisClass={item.predicted_class} size="sm" />
                  <ConfidenceBar confidence={item.confidence} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>
                    {topFeat?.feature || '—'}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(item) }}
                    style={{ padding: '5px 11px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    Details
                  </button>
                </div>
              )
            })}
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && <Drawer item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}
