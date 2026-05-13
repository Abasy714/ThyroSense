import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api'
import ClassBadge from '../patient/components/ClassBadge'
import ShapChart from '../patient/components/ShapChart'
import { useToast } from '../components/Toast'

const CLASS_COLORS = {
  healthy: '#10B981',
  hypothyroid: '#3B82F6',
  hyperthyroid: '#EF4444',
  binding_protein_disorder: '#8B5CF6',
}

const RISK_COLORS = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' }

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text)' }}>{value}</span>
    </div>
  )
}

function getAge(dob) {
  if (!dob) return '—'
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({})
  const [noteInputs, setNoteInputs] = useState({})

  useEffect(() => {
    const uid = JSON.parse(localStorage.getItem('thyrosense-user') || '{}').id
    api.get(`/patients/${id}?user_id=${uid}`).then(res => {
      const p = res.data
      setPatient(p)
      setLoading(false)
      const initialNotes = {}
      ;(p.predictions || []).forEach(pred => {
        initialNotes[pred.id] = pred.notes || []
      })
      setNotes(initialNotes)
    }).catch(() => setLoading(false))
  }, [id])

  const handleNoteSubmit = async (predictionId) => {
    const text = (noteInputs[predictionId] || '').trim()
    if (!text) return
    const user = JSON.parse(localStorage.getItem('thyrosense-user') || '{}')
    try {
      const res = await api.post(`/patients/predictions/${predictionId}/notes`, {
        doctor_id: user.id,
        note: text,
      })
      setNotes(prev => ({
        ...prev,
        [predictionId]: [res.data, ...(prev[predictionId] || [])],
      }))
      setNoteInputs(prev => ({ ...prev, [predictionId]: '' }))
      toast('Clinical note saved', 'success')
    } catch {
      toast('Failed to save note', 'error')
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)' }}>Loading…</div>
  }

  if (!patient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)' }}>Patient not found.</p>
        <button onClick={() => navigate('/doctor/patients')} style={{ padding: '10px 22px', borderRadius: 9, background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
          Back to Roster
        </button>
      </div>
    )
  }

  const sorted = [...(patient.predictions || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const latest = sorted[0]
  const classColor = CLASS_COLORS[latest?.predicted_class] || '#6B7280'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <button
        onClick={() => navigate('/doctor/patients')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, transition: 'color 0.15s ease' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M8 2L4 6.5 8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Roster
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}
      >
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--surface)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-muted)', flexShrink: 0 }}>
          {patient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
            <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.55rem', color: 'var(--text)', margin: 0, letterSpacing: '-0.025em' }}>
              {patient.full_name}
            </h1>
            {latest && <ClassBadge diagnosisClass={latest.predicted_class} size="md" />}
            <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 99, fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: RISK_COLORS[patient.risk_level], background: `color-mix(in srgb, ${RISK_COLORS[patient.risk_level]} 12%, transparent)` }}>
              {patient.risk_level} risk
            </span>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.83rem', margin: 0 }}>
            {patient.email}{patient.phone ? ` · ${patient.phone}` : ''}
          </p>
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ flex: '1 1 220px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}
        >
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: '0 0 0.85rem' }}>
            Patient Info
          </h3>
          <InfoRow label="Date of Birth" value={patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
          <InfoRow label="Age" value={`${getAge(patient.dob)} years`} />
          <InfoRow label="Sex" value={patient.sex === 'M' ? 'Male' : patient.sex === 'F' ? 'Female' : '—'} />
          <InfoRow label="Status" value={patient.status} />
          <InfoRow label="Total Predictions" value={sorted.length} />
        </motion.div>

        {latest && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            style={{ flex: '2 1 320px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}
          >
            <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: '0 0 1rem' }}>
              Latest Prediction
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '1rem', background: `${classColor}0D`, border: `1.5px solid ${classColor}35`, borderRadius: 12 }}>
              <ClassBadge diagnosisClass={latest.predicted_class} size="md" />
              <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: classColor, letterSpacing: '-0.02em' }}>
                {Math.round((latest.confidence || 0) * 100)}%
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)' }}>confidence</span>
            </div>
            {latest.clinical_interpretation && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 1rem', padding: '0.75rem 1rem', background: 'var(--surface-hover)', borderRadius: 10, borderLeft: `3px solid ${classColor}` }}>
                {latest.clinical_interpretation}
              </p>
            )}
            {latest.top_features?.length > 0 && (
              <ShapChart features={latest.top_features} classColor={classColor} />
            )}
          </motion.div>
        )}
      </div>

      {sorted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          style={{ marginTop: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}
        >
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: '0 0 1.25rem' }}>
            Prediction History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sorted.map((pred, i) => {
              const color = CLASS_COLORS[pred.predicted_class] || '#6B7280'
              const predNotes = notes[pred.id] || []
              return (
                <div key={pred.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1rem', background: i === 0 ? `${color}08` : 'var(--surface-hover)', border: i === 0 ? `1px solid ${color}30` : '1px solid var(--border)', borderRadius: 11, marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <ClassBadge diagnosisClass={pred.predicted_class} size="sm" />
                        {i === 0 && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest</span>}
                      </div>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                        {new Date(pred.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1rem', color }}>
                      {Math.round((pred.confidence || 0) * 100)}%
                    </span>
                  </div>

                  <div style={{ marginLeft: '0.5rem', padding: '0.85rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', borderRadius: '0 8px 8px 0' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.55rem' }}>
                      Clinical Notes
                    </p>

                    {predNotes.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.65rem' }}>
                        {predNotes.map(note => (
                          <div key={note.id} style={{ padding: '0.5rem 0.75rem', background: 'var(--surface-hover)', borderRadius: 7 }}>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', color: 'var(--text)', margin: 0, lineHeight: 1.55 }}>{note.note}</p>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                              {note.doctor_name} · {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Add clinical note… (Enter to save)"
                        value={noteInputs[pred.id] || ''}
                        onChange={e => setNoteInputs(prev => ({ ...prev, [pred.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') handleNoteSubmit(pred.id) }}
                        style={{
                          flex: 1, padding: '0.48rem 0.75rem', borderRadius: 7,
                          border: '1px solid var(--border)', background: 'var(--surface-hover)',
                          color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem',
                          outline: 'none', transition: 'border-color 0.15s ease',
                        }}
                        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                      />
                      <button
                        onClick={() => handleNoteSubmit(pred.id)}
                        style={{
                          padding: '0.48rem 1rem', borderRadius: 7, border: 'none', cursor: 'pointer',
                          background: 'var(--accent)', color: 'var(--accent-text)',
                          fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.82rem',
                          transition: 'opacity 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
