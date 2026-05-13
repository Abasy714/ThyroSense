import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

export default function DoctorHome() {
  const [patients, setPatients] = useState([])

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
  )
}
