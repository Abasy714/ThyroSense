import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api'
import { useToast } from '../components/Toast'

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

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <LabelText>{label}</LabelText>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, type = 'text', placeholder, min, max }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '10px 12px', borderRadius: 9, boxSizing: 'border-box',
        border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
        background: 'var(--surface)', color: 'var(--text)',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none',
        boxShadow: focused ? '0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    />
  )
}

export default function PatientProfile() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    full_name: '', email: '', dob: '', phone: '', age: '', sex: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('thyrosense-user') || '{}')
    api.get(`/patients/me?user_id=${user.id}`)
      .then(res => {
        setFormData({
          full_name: res.data.full_name || '',
          email: res.data.email || '',
          dob: res.data.dob || '',
          phone: res.data.phone || '',
          age: res.data.age != null ? String(res.data.age) : '',
          sex: res.data.sex || '',
        })
      })
      .catch(() => {
        const u = JSON.parse(localStorage.getItem('thyrosense-user') || '{}')
        setFormData(f => ({ ...f, full_name: u.full_name || '', email: u.email || '' }))
      })
  }, [])

  const set = (key) => (e) => setFormData(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const user = JSON.parse(localStorage.getItem('thyrosense-user') || '{}')
      await api.put('/profile', { user_id: user.id, ...formData })
      const updated = { ...user, full_name: formData.full_name }
      localStorage.setItem('thyrosense-user', JSON.stringify(updated))
      toast('Profile updated', 'success')
    } catch {
      toast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
      style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>
          My Profile
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0 }}>
          Personal information and health data used for predictions
        </p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '2rem' }}>
        <Field label="Full Name">
          <TextInput value={formData.full_name} onChange={set('full_name')} placeholder="Your full name" />
        </Field>

        <Field label="Email">
          <TextInput value={formData.email} onChange={set('email')} type="email" placeholder="your@email.com" />
        </Field>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Field label="Date of Birth">
              <TextInput value={formData.dob} onChange={set('dob')} type="date" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Phone">
              <TextInput value={formData.phone} onChange={set('phone')} placeholder="+1 555 0000" />
            </Field>
          </div>
        </div>

        <Field label="Age">
          <TextInput value={formData.age} onChange={set('age')} type="number" placeholder="e.g. 34" min="1" max="120" />
        </Field>

        <Field label="Biological Sex">
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[
              { val: 'M', label: 'Male', icon: (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="13" cy="19" r="7" stroke="currentColor" strokeWidth="2" />
                  <line x1="18" y1="14" x2="25" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <polyline points="21,7 25,7 25,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )},
              { val: 'F', label: 'Female', icon: (
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="13" r="7" stroke="currentColor" strokeWidth="2" />
                  <line x1="16" y1="20" x2="16" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="11" y1="25" x2="21" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )},
            ].map(({ val, label, icon }) => {
              const sel = formData.sex === val
              return (
                <button
                  key={val} type="button"
                  onClick={() => setFormData(f => ({ ...f, sex: val }))}
                  style={{
                    flex: 1, padding: '1.1rem', borderRadius: 12,
                    border: `2px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                    background: sel ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))' : 'var(--surface)',
                    color: sel ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 50%, var(--border))' }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  {icon}
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.88rem' }}>{label}</span>
                </button>
              )
            })}
          </div>
        </Field>

        <div style={{ marginTop: '0.5rem' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none',
              background: saving ? 'var(--border)' : 'var(--accent)',
              color: saving ? 'var(--text-muted)' : 'var(--accent-text)',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.92rem',
              cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.background = 'var(--accent)' }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
