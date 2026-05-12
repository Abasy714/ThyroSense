import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import StepIndicator from './components/StepIndicator'

const STEPS = ['Personal Info', 'Lab Results', 'Clinical History']

const HORMONES = [
  { key: 'TSH', label: 'TSH', unit: 'mIU/L', range: '0.4–4.0' },
  { key: 'T3', label: 'T3', unit: 'nmol/L', range: '0.8–2.0' },
  { key: 'TT4', label: 'TT4', unit: 'nmol/L', range: '60–150' },
  { key: 'T4U', label: 'T4U', unit: '', range: '0.7–1.1' },
  { key: 'FTI', label: 'FTI', unit: '', range: '60–150' },
]

const HORMONE_RANGES = {
  TSH: [0.4, 4.0], T3: [0.8, 2.0], TT4: [60, 150], T4U: [0.7, 1.1], FTI: [60, 150],
}

const FLAGS = [
  { key: 'on_thyroxine', label: 'On Thyroxine', icon: '💊' },
  { key: 'query_on_thyroxine', label: 'Queried on Thyroxine', icon: '❓' },
  { key: 'on_antithyroid_medication', label: 'Antithyroid Medication', icon: '💉' },
  { key: 'sick', label: 'Currently Sick', icon: '🤒' },
  { key: 'pregnant', label: 'Pregnant', icon: '🤰' },
  { key: 'thyroid_surgery', label: 'Prior Thyroid Surgery', icon: '🏥' },
  { key: 'I131_treatment', label: 'I131 Treatment', icon: '☢️' },
  { key: 'query_hypothyroid', label: 'Suspected Hypothyroid', icon: '🔻' },
  { key: 'query_hyperthyroid', label: 'Suspected Hyperthyroid', icon: '🔺' },
  { key: 'lithium', label: 'On Lithium', icon: '⚗️' },
  { key: 'goitre', label: 'Goitre Present', icon: '🔬' },
  { key: 'tumor', label: 'Tumor Present', icon: '🧬' },
  { key: 'hypopituitary', label: 'Hypopituitary', icon: '🧠' },
  { key: 'psych', label: 'Psychological Condition', icon: '🧘' },
]

const initForm = () => ({
  age: '',
  sex: '',
  TSH: { measured: true, value: '' },
  T3: { measured: true, value: '' },
  TT4: { measured: true, value: '' },
  T4U: { measured: true, value: '' },
  FTI: { measured: true, value: '' },
  on_thyroxine: false,
  query_on_thyroxine: false,
  on_antithyroid_medication: false,
  sick: false,
  pregnant: false,
  thyroid_surgery: false,
  I131_treatment: false,
  query_hypothyroid: false,
  query_hyperthyroid: false,
  lithium: false,
  goitre: false,
  tumor: false,
  hypopituitary: false,
  psych: false,
})

function isOutOfRange(key, val) {
  const r = HORMONE_RANGES[key]
  if (!r || val === '' || val === null) return false
  const n = Number(val)
  return isNaN(n) ? false : n < r[0] || n > r[1]
}

const slideVariants = {
  enter: d => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: d => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
}

function fieldStyle(focused) {
  return {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 9,
    border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
    background: 'var(--surface)',
    color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.92rem',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: 'none',
        background: checked ? 'var(--accent)' : 'var(--border)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s ease', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

function LabelText({ children }) {
  return (
    <label style={{
      display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem',
      fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase',
      letterSpacing: '0.06em', marginBottom: '0.4rem',
    }}>
      {children}
    </label>
  )
}

function StepHeading({ title, sub }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.35rem', color: 'var(--text)', letterSpacing: '-0.02em', margin: '0 0 0.3rem' }}>
        {title}
      </h2>
      <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.87rem', margin: 0 }}>{sub}</p>
    </div>
  )
}

function Step1({ form, setForm }) {
  const [ageFocused, setAgeFocused] = useState(false)
  return (
    <div>
      <StepHeading title="Patient Information" sub="Basic demographic information for this analysis" />
      <div style={{ marginBottom: '1.5rem' }}>
        <LabelText>Age</LabelText>
        <input
          type="number" min={1} max={100}
          value={form.age}
          onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
          placeholder="e.g. 45"
          style={fieldStyle(ageFocused)}
          onFocus={() => setAgeFocused(true)}
          onBlur={() => setAgeFocused(false)}
        />
      </div>
      <div>
        <LabelText>Biological Sex</LabelText>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { val: 'M', label: 'Male', icon: (
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <circle cx="13" cy="19" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="18" y1="14" x2="25" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <polyline points="21,7 25,7 25,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )},
            { val: 'F', label: 'Female', icon: (
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="13" r="7" stroke="currentColor" strokeWidth="2" />
                <line x1="16" y1="20" x2="16" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="11" y1="25" x2="21" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )},
          ].map(({ val, label, icon }) => {
            const sel = form.sex === val
            return (
              <button
                key={val} type="button"
                onClick={() => setForm(f => ({ ...f, sex: val }))}
                style={{
                  flex: 1, padding: '1.25rem', borderRadius: 12,
                  border: `2px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                  background: sel ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))' : 'var(--surface)',
                  color: sel ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 50%, var(--border))' }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                {icon}
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Step2({ form, setForm }) {
  const [focused, setFocused] = useState(null)
  return (
    <div>
      <StepHeading title="Thyroid Panel Results" sub="Enter available measurements. Toggle off any that were not performed." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {HORMONES.map(({ key, label, unit, range }) => {
          const measured = form[key].measured
          const val = form[key].value
          const warn = measured && isOutOfRange(key, val)
          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              padding: '0.9rem 1rem', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 12,
              opacity: measured ? 1 : 0.55, transition: 'opacity 0.2s',
            }}>
              <div style={{ flex: '0 0 90px' }}>
                <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{label}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  Ref: {range}{unit ? ` ${unit}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ToggleSwitch
                  checked={measured}
                  onChange={v => setForm(f => ({ ...f, [key]: { ...f[key], measured: v, value: v ? f[key].value : '' } }))}
                />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', color: 'var(--text-muted)', minWidth: 52 }}>
                  {measured ? 'Measured' : 'Not done'}
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input
                  type="number" step="any"
                  disabled={!measured}
                  value={val}
                  onChange={e => setForm(f => ({ ...f, [key]: { ...f[key], value: e.target.value } }))}
                  placeholder={measured ? '0.00' : '—'}
                  style={{
                    ...fieldStyle(focused === key),
                    flex: 1, opacity: measured ? 1 : 0.4,
                    cursor: measured ? 'text' : 'not-allowed',
                  }}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                />
                {unit && measured && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: 38, flexShrink: 0 }}>{unit}</span>}
                {warn && (
                  <span title="Value outside reference range" style={{ color: 'var(--warning)', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M7.5 1.5L13.5 12H1.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <line x1="7.5" y1="6.5" x2="7.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="7.5" cy="10.5" r="0.65" fill="currentColor" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Step3({ form, setForm }) {
  return (
    <div>
      <StepHeading title="Clinical History" sub="Check all that apply" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
        {FLAGS.map(({ key, label, icon }) => {
          const checked = form[key]
          return (
            <button
              key={key} type="button"
              onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
              style={{
                padding: '0.8rem 0.9rem', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                background: checked ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))' : 'var(--surface)',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                textAlign: 'left', transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { if (!checked) e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 45%, var(--border))' }}
              onMouseLeave={e => { if (!checked) e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{icon}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: checked ? 'var(--accent)' : 'var(--text)', lineHeight: 1.3 }}>
                {label}
              </span>
              {checked && (
                <span style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--accent)' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1.5 6.5l3.5 3.5L11.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function PredictionForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [form, setForm] = useState(initForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function goNext() { setDirection(1); setStep(s => s + 1) }
  function goPrev() { setDirection(-1); setStep(s => s - 1) }

  const canContinue = step === 1 ? (!!form.age && Number(form.age) > 0 && !!form.sex) : true

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        data: {
          age: Number(form.age),
          sex: form.sex,
          TSH: form.TSH.measured && form.TSH.value !== '' ? Number(form.TSH.value) : null,
          T3: form.T3.measured && form.T3.value !== '' ? Number(form.T3.value) : null,
          TT4: form.TT4.measured && form.TT4.value !== '' ? Number(form.TT4.value) : null,
          T4U: form.T4U.measured && form.T4U.value !== '' ? Number(form.T4U.value) : null,
          FTI: form.FTI.measured && form.FTI.value !== '' ? Number(form.FTI.value) : null,
          on_thyroxine: form.on_thyroxine,
          query_on_thyroxine: form.query_on_thyroxine,
          on_antithyroid_medication: form.on_antithyroid_medication,
          sick: form.sick,
          pregnant: form.pregnant,
          thyroid_surgery: form.thyroid_surgery,
          I131_treatment: form.I131_treatment,
          query_hypothyroid: form.query_hypothyroid,
          query_hyperthyroid: form.query_hyperthyroid,
          lithium: form.lithium,
          goitre: form.goitre,
          tumor: form.tumor,
          hypopituitary: form.hypopituitary,
          psych: form.psych,
        },
      }
      const { data } = await axios.post('/api/predict', payload)
      const result = {
        id: Date.now(),
        date: new Date().toISOString(),
        predicted_class: data.predicted_class,
        confidence: data.confidence,
        cluster_id: data.cluster_id,
        top_features: data.top_features,
        clinical_interpretation: data.clinical_interpretation,
        form_data: payload.data,
      }
      localStorage.setItem('thyrosense-last-result', JSON.stringify(result))
      const history = (() => { try { return JSON.parse(localStorage.getItem('thyrosense-history') || '[]') } catch { return [] } })()
      history.push(result)
      localStorage.setItem('thyrosense-history', JSON.stringify(history))
      navigate('/patient/result')
    } catch {
      setError('Analysis failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 660, margin: '0 auto' }}>
      <StepIndicator steps={STEPS} currentStep={step} />

      <div style={{ position: 'relative' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '2rem' }}>
              {step === 1 && <Step1 form={form} setForm={setForm} />}
              {step === 2 && <Step2 form={form} setForm={setForm} />}
              {step === 3 && <Step3 form={form} setForm={setForm} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <div style={{
          marginTop: '1rem', padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--danger) 12%, var(--surface))',
          border: '1px solid color-mix(in srgb, var(--danger) 35%, var(--border))',
          borderRadius: 10, fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.85rem', color: 'var(--danger)',
        }}>
          {error}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', gap: '1rem' }}>
        {step > 1 ? (
          <button
            type="button" onClick={goPrev}
            style={{
              padding: '11px 22px', borderRadius: 10,
              border: '1.5px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        ) : <div />}

        {step < 3 ? (
          <motion.button
            type="button" onClick={goNext} disabled={!canContinue}
            whileHover={canContinue ? { scale: 1.02 } : {}}
            whileTap={canContinue ? { scale: 0.98 } : {}}
            style={{
              padding: '11px 26px', borderRadius: 10, border: 'none',
              background: canContinue ? 'var(--accent)' : 'var(--border)',
              color: canContinue ? 'var(--accent-text)' : 'var(--text-muted)',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9rem',
              cursor: canContinue ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { if (canContinue) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { if (canContinue) e.currentTarget.style.background = 'var(--accent)' }}
          >
            Continue
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        ) : (
          <motion.button
            type="button" onClick={handleSubmit} disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              flex: 1, padding: '13px', borderRadius: 10, border: 'none',
              background: loading ? 'var(--border)' : 'var(--accent)',
              color: loading ? 'var(--text-muted)' : 'var(--accent-text)',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.6rem', transition: 'background 0.2s ease',
            }}
          >
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2.2" strokeDasharray="22 10" strokeLinecap="round" />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}
