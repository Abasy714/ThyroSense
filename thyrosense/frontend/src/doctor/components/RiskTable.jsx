import { useNavigate } from 'react-router-dom'
import ClassBadge from '../../patient/components/ClassBadge'
import { getLatestClass } from '../../data/mockPatients'

const RISK_COLORS = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' }

export default function RiskTable({ patients }) {
  const navigate = useNavigate()

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Patient', 'Age', 'Diagnosis', 'Risk', 'Last Visit'].map(h => (
              <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontFamily: 'DM Sans, sans-serif', fontSize: '0.67rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr
              key={p.id}
              onClick={() => navigate(`/doctor/patients/${p.id}`)}
              style={{
                borderBottom: i < patients.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ padding: '0.75rem 0.75rem' }}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.83rem', color: 'var(--text)' }}>{p.name}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.email}</div>
              </td>
              <td style={{ padding: '0.75rem 0.75rem', fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', color: 'var(--text-muted)' }}>{p.age}</td>
              <td style={{ padding: '0.75rem 0.75rem' }}><ClassBadge diagnosisClass={getLatestClass(p)} size="sm" /></td>
              <td style={{ padding: '0.75rem 0.75rem' }}>
                <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 99, fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: RISK_COLORS[p.riskLevel] || 'var(--text-muted)', background: `color-mix(in srgb, ${RISK_COLORS[p.riskLevel] || 'var(--text-muted)'} 12%, transparent)` }}>
                  {p.riskLevel}
                </span>
              </td>
              <td style={{ padding: '0.75rem 0.75rem', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {new Date(p.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
