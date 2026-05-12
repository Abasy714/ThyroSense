import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ClassBadge from './components/ClassBadge'
import ConfidenceGauge from './components/ConfidenceGauge'
import ShapChart from './components/ShapChart'

const CLASS_COLORS = {
  healthy: '#10B981',
  hypothyroid: '#3B82F6',
  hyperthyroid: '#EF4444',
  binding_protein_disorder: '#8B5CF6',
}

const CLASS_INFO = {
  healthy: 'Your thyroid hormone levels are within the normal range. No disorder pattern was detected based on the provided clinical data.',
  hypothyroid: 'Your results suggest reduced thyroid activity. Hypothyroidism occurs when the thyroid gland does not produce enough hormones, affecting metabolism and energy levels.',
  hyperthyroid: 'Your results suggest elevated thyroid activity. Hyperthyroidism occurs when the thyroid produces excess hormones. Common symptoms include rapid heartbeat and weight loss.',
  binding_protein_disorder: 'Your results suggest an abnormality in thyroid hormone binding proteins, affecting how hormones are transported in the bloodstream.',
}

function fadeUp(delay) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }
}

function ClusterDots() {
  const bg = [{ cx: 35, cy: 45 }, { cx: 65, cy: 30 }, { cx: 85, cy: 55 }, { cx: 50, cy: 70 }, { cx: 20, cy: 65 }]
  return (
    <svg viewBox="0 0 110 100" style={{ width: 110, height: 90 }}>
      {bg.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r={4} fill="var(--border)" />)}
      <circle cx={55} cy={48} r={6} fill="var(--accent)" />
      <circle cx={55} cy={48} r={11} fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35" />
    </svg>
  )
}

function Accordion({ title, body, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        type="button" onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '0.85rem 0', background: 'none',
          border: 'none', cursor: 'pointer', color: 'var(--text)',
          fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem',
          textAlign: 'left',
        }}
      >
        {title}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', color: 'var(--text-muted)', margin: '0 0 1rem', lineHeight: 1.7 }}>
          {body}
        </p>
      )}
    </div>
  )
}

export default function PredictionResult() {
  const navigate = useNavigate()

  const result = (() => {
    try { return JSON.parse(localStorage.getItem('thyrosense-last-result') || 'null') }
    catch { return null }
  })()

  if (!result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '55vh', gap: '1rem' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)' }}>No result found.</p>
        <button
          onClick={() => navigate('/patient/predict')}
          style={{ padding: '10px 22px', borderRadius: 9, background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}
        >
          Start Assessment
        </button>
      </div>
    )
  }

  const { predicted_class, confidence, cluster_id, top_features, clinical_interpretation } = result
  const classColor = CLASS_COLORS[predicted_class] || '#6B7280'
  const pct = Math.round((confidence || 0) * 100)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Hero */}
      <motion.div
        {...fadeUp(0.05)}
        style={{
          textAlign: 'center', padding: '2rem 1rem 1.5rem',
          borderRadius: 18, marginBottom: '1.5rem',
          background: `linear-gradient(135deg, var(--surface) 55%, ${classColor}0D 100%)`,
          border: `1.5px solid ${classColor}40`,
        }}
      >
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.75rem' }}>
          AI Prediction Result
        </p>
        <div style={{ marginBottom: '0.6rem' }}>
          <ClassBadge diagnosisClass={predicted_class} size="lg" />
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          with <strong style={{ color: classColor }}>{pct}%</strong> confidence
        </p>
      </motion.div>

      {/* Gauge + SHAP */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <motion.div {...fadeUp(0.1)} style={{ flex: '1 1 250px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
            Confidence Score
          </h3>
          <ConfidenceGauge value={pct} color={classColor} label={predicted_class?.replace(/_/g, ' ')} />
          {clinical_interpretation && (
            <div style={{
              background: 'color-mix(in srgb, var(--surface-hover) 80%, transparent)',
              borderLeft: `4px solid ${classColor}`,
              borderRadius: '0 10px 10px 0',
              padding: '0.85rem 1rem',
              display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
            }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="7.5" cy="7.5" r="6.5" stroke={classColor} strokeWidth="1.4" />
                <line x1="7.5" y1="6.5" x2="7.5" y2="10.5" stroke={classColor} strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7.5" cy="5" r="0.65" fill={classColor} />
              </svg>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>
                {clinical_interpretation}
              </p>
            </div>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.15)} style={{ flex: '2 1 280px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '0 0 1rem' }}>
            Key Factors in This Prediction
          </h3>
          <ShapChart features={top_features} classColor={classColor} />
        </motion.div>
      </div>

      {/* Cluster + Meaning */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <motion.div {...fadeUp(0.2)} style={{ flex: '1 1 210px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '0 0 1rem' }}>
            Phenotype Cluster
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ClusterDots />
            <div>
              <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.9rem', color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Group {cluster_id}
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.4rem 0 0', lineHeight: 1.55 }}>
                You share clinical patterns with patients in this group
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.25)} style={{ flex: '2 1 280px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '0 0 0.25rem' }}>
            What this means
          </h3>
          <Accordion
            title={`About ${predicted_class?.replace(/_/g, ' ')}`}
            body={CLASS_INFO[predicted_class] || 'Please consult your healthcare provider.'}
            defaultOpen
          />
          <Accordion
            title="Recommended next steps"
            body="This is an AI-assisted screening tool. Results should be reviewed by a qualified healthcare professional before any clinical decisions are made. Schedule a follow-up appointment if symptoms persist."
          />
          <Accordion
            title="About this model"
            body="ThyroSense uses an XGBoost classifier trained on 9,172 records from the UCI Thyroid Disease dataset. SHAP values explain which features contributed most to this prediction."
          />
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/patient/predict')}
          style={{ padding: '11px 22px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          New Assessment
        </button>
        <button
          onClick={() => navigate('/patient/history')}
          style={{ padding: '11px 22px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          View History
        </button>
        <button
          onClick={() => window.print()}
          style={{ padding: '11px 22px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: 'var(--accent-text)', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s ease' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="4" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 4V2.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5V4" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Download Report
        </button>
      </motion.div>
    </motion.div>
  )
}
