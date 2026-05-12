import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/Toast'
import api from '../api'

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ padding: '0.7rem 0.9rem', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.18s ease' }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}

export default function DoctorProfile() {
  const { user } = useAuth()
  const toast = useToast()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [specialty, setSpecialty] = useState('Endocrinology')
  const [institution, setInstitution] = useState('General Hospital')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const uid = JSON.parse(localStorage.getItem('thyrosense-user') || '{}').id
      await api.put('/profile', { user_id: uid, full_name: name, specialty, hospital: institution })
      toast('Profile updated successfully', 'success')
    } catch {
      toast('Failed to save profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>
          My Profile
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0 }}>
          Manage your account settings
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          style={{ flex: '1 1 220px', maxWidth: 260, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', textAlign: 'center' }}
        >
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))', border: '2px solid color-mix(in srgb, var(--accent) 35%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: 'var(--accent)' }}>
            {name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DR'}
          </div>
          <div>
            <div style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
              Dr. {name || '—'}
            </div>
            <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 99, background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Doctor
            </span>
          </div>
          <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{specialty}</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{institution}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ flex: '2 1 320px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.75rem' }}
        >
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: '0 0 1.25rem' }}>
            Account Details
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Jane Smith" />
              <Field label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="doctor@hospital.com" />
              <Field label="Specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="Endocrinology" />
              <Field label="Institution" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="General Hospital" />
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button
                type="submit" disabled={saving}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ padding: '10px 24px', borderRadius: 9, border: 'none', background: saving ? 'var(--surface-hover)' : 'var(--accent)', color: saving ? 'var(--text-muted)' : 'var(--accent-text)', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.88rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease' }}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
