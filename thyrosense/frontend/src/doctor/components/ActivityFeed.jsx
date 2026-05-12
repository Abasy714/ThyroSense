import ClassBadge from '../../patient/components/ClassBadge'

export default function ActivityFeed({ predictions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {predictions.map((pred, i) => (
        <div
          key={pred.id}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
            padding: '0.85rem 0',
            borderBottom: i < predictions.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.5" stroke="var(--text-muted)" strokeWidth="1.3" />
              <path d="M2.5 12c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="var(--text-muted)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.83rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {pred.patient?.name || 'Unknown'}
              </span>
              <ClassBadge diagnosisClass={pred.predicted_class} size="sm" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {new Date(pred.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {Math.round((pred.confidence || 0) * 100)}% confidence
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
