import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'
import StatCard from './components/StatCard'
import ClassDistChart from './components/ClassDistChart'
import HormoneChart from './components/HormoneChart'
import RiskTable from './components/RiskTable'
import ActivityFeed from './components/ActivityFeed'

function buildStats(patients) {
  const classCounts = {}
  const hormoneGrouped = {}
  const allPreds = []
  let highRisk = []
  const now = new Date()

  patients.forEach(p => {
    if (p.risk_level === 'high') highRisk.push(p)
    ;(p.predictions || []).forEach(pred => {
      const cls = pred.predicted_class
      classCounts[cls] = (classCounts[cls] || 0) + 1
      if (!hormoneGrouped[cls]) hormoneGrouped[cls] = []
      if (pred.form_data?.TSH != null) hormoneGrouped[cls].push(pred.form_data.TSH)
      allPreds.push({ ...pred, patient: { full_name: p.full_name } })
    })
  })

  const hormoneData = Object.entries(hormoneGrouped).map(([name, vals]) => ({
    name,
    avgTSH: vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : 0,
  }))

  const sorted = [...allPreds].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const thisMonth = sorted.filter(p => {
    const d = new Date(p.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const totalConf = allPreds.reduce((s, p) => s + (p.confidence || 0), 0)
  const avgConf = allPreds.length ? Math.round((totalConf / allPreds.length) * 100) : 0

  return { classCounts, hormoneData, highRisk, allPreds: sorted, thisMonth, avgConf }
}

function SectionCard({ title, children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', ...style }}
    >
      <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: '0 0 1.1rem', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'model', label: 'Model Intelligence' },
]

function ModelIntelligence() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/predict/model-results').then(res => {
      setResults(res.data.results || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={{ padding: '3rem 0', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Loading model data…</div>
  }

  if (results.length === 0) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>No gridsearch results available.</p>
      </div>
    )
  }

  const best = results.reduce((a, b) => ((b.best_score || 0) > (a.best_score || 0) ? b : a), results[0])

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Best Model</div>
          <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>{best.model_name || '—'}</div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Best CV Score</div>
          <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent)', letterSpacing: '-0.02em' }}>
            {best.best_score != null ? `${(best.best_score * 100).toFixed(1)}%` : '—'}
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Models Evaluated</div>
          <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>{results.length}</div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr', gap: '1rem', padding: '0.75rem 1.25rem', background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
          {['Model', 'CV Score', 'Best Parameters'].map(h => (
            <span key={h} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>
        {[...results].sort((a, b) => (b.best_score || 0) - (a.best_score || 0)).map((r, i) => {
          const isBest = r.model_name === best.model_name
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr', gap: '1rem', padding: '0.9rem 1.25rem', alignItems: 'center', borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none', background: isBest ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{r.model_name}</span>
                {isBest && <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 99, background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase' }}>Best</span>}
              </div>
              <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: isBest ? 'var(--accent)' : 'var(--text)' }}>
                {r.best_score != null ? `${(r.best_score * 100).toFixed(1)}%` : '—'}
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.best_params || '—'}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function DoctorHome() {
  const [patients, setPatients] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const uid = JSON.parse(localStorage.getItem('thyrosense-user') || '{}').id
    api.get(`/patients?user_id=${uid}`).then(res => setPatients(res.data || [])).catch(() => {})
  }, [])

  const { classCounts, hormoneData, highRisk, allPreds, thisMonth, avgConf } = buildStats(patients)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>
          Clinical Overview
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0 }}>
          Patient analytics and risk monitoring dashboard
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.25rem', width: 'fit-content' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1.1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.83rem',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-text)' : 'var(--text-muted)',
              transition: 'all 0.18s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <StatCard label="Total Patients" value={patients.length} sub="across all diagnoses" delay={0.05} accent />
              <StatCard label="High Risk" value={highRisk.length} sub="require close monitoring" delay={0.1}
                icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L12.5 11H1.5L7 2z" stroke="var(--danger)" strokeWidth="1.4" strokeLinejoin="round" /><line x1="7" y1="6" x2="7" y2="8.5" stroke="var(--danger)" strokeWidth="1.4" strokeLinecap="round" /><circle cx="7" cy="10" r="0.6" fill="var(--danger)" /></svg>}
              />
              <StatCard label="This Month" value={thisMonth.length} sub="new predictions" delay={0.15} />
              <StatCard label="Avg Confidence" value={avgConf} sub="model accuracy" delay={0.2} />
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <SectionCard title="Diagnosis Distribution" delay={0.25} style={{ flex: '1 1 280px' }}>
                <ClassDistChart counts={classCounts} />
              </SectionCard>
              <SectionCard title="Avg TSH by Class" delay={0.3} style={{ flex: '2 1 320px' }}>
                <HormoneChart data={hormoneData} />
              </SectionCard>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <SectionCard title="High Risk Patients" delay={0.35} style={{ flex: '3 1 360px' }}>
                <RiskTable patients={highRisk} />
              </SectionCard>
              <SectionCard title="Recent Activity" delay={0.4} style={{ flex: '2 1 260px' }}>
                <ActivityFeed predictions={allPreds.slice(0, 8)} />
              </SectionCard>
            </div>
          </motion.div>
        ) : (
          <motion.div key="model" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ModelIntelligence />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
