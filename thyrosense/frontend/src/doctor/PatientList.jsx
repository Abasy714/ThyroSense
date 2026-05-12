import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api'
import ClassBadge from '../patient/components/ClassBadge'

const RISK_COLORS = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' }
const ALL_CLASSES = ['healthy', 'hypothyroid', 'hyperthyroid', 'binding_protein_disorder']
const CLASS_LABELS = { healthy: 'Healthy', hypothyroid: 'Hypothyroid', hyperthyroid: 'Hyperthyroid', binding_protein_disorder: 'Binding Protein' }

function getLatestClass(patient) {
  return patient.predictions?.[0]?.predicted_class || null
}

function getAge(dob) {
  if (!dob) return '—'
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

function PatientCard({ patient, delay }) {
  const navigate = useNavigate()
  const cls = getLatestClass(patient)
  const pred = patient.predictions?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/doctor/patients/${patient.id}`)}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', cursor: 'pointer', transition: 'border-color 0.18s ease, box-shadow 0.18s ease' }}
      whileHover={{ y: -2 }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {patient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.87rem', color: 'var(--text)' }}>{patient.full_name}</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {getAge(patient.dob)}y · {patient.sex === 'M' ? 'Male' : 'Female'}
            </div>
          </div>
        </div>
        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontFamily: 'DM Sans, sans-serif', fontSize: '0.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: RISK_COLORS[patient.risk_level], background: `color-mix(in srgb, ${RISK_COLORS[patient.risk_level]} 12%, transparent)` }}>
          {patient.risk_level}
        </span>
      </div>

      <ClassBadge diagnosisClass={cls} size="sm" />

      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {(patient.predictions || []).length} prediction{(patient.predictions || []).length !== 1 ? 's' : ''}
        </span>
        {pred && (
          <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.83rem', color: 'var(--text)' }}>
            {Math.round((pred.confidence || 0) * 100)}%
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function PatientList() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')

  useEffect(() => {
    const uid = JSON.parse(localStorage.getItem('thyrosense-user') || '{}').id
    api.get(`/patients?user_id=${uid}`).then(res => setPatients(res.data || [])).catch(() => {})
  }, [])

  const filtered = patients.filter(p => {
    const cls = getLatestClass(p)
    const matchSearch = search === '' || p.full_name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    const matchClass = filterClass === 'all' || cls === filterClass
    const matchRisk = filterRisk === 'all' || p.risk_level === filterRisk
    return matchSearch && matchClass && matchRisk
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>
          Patient Roster
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0 }}>
          {filtered.length} of {patients.length} patients
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4 }}>
            <circle cx="6" cy="6" r="4.5" stroke="var(--text)" strokeWidth="1.4" />
            <path d="M9.5 9.5l2.5 2.5" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text" placeholder="Search patients…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2rem', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.18s ease' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ padding: '0.6rem 0.85rem', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.84rem', cursor: 'pointer', outline: 'none' }}>
          <option value="all">All Diagnoses</option>
          {ALL_CLASSES.map(c => <option key={c} value={c}>{CLASS_LABELS[c]}</option>)}
        </select>
        <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} style={{ padding: '0.6rem 0.85rem', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.84rem', cursor: 'pointer', outline: 'none' }}>
          <option value="all">All Risk Levels</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No patients match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {filtered.map((p, i) => (
            <PatientCard key={p.id} patient={p} delay={i * 0.03} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
