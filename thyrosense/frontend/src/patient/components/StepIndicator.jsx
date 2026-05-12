export default function StepIndicator({ steps, currentStep }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < currentStep
        const active = n === currentStep
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: done ? 'var(--accent)' : 'transparent',
                  border: done || active ? '2px solid var(--accent)' : '2px solid var(--border)',
                  color: done ? 'var(--accent-text)' : active ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'Clash Display, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  n
                )}
              </div>
              <span
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 80,
                  height: 2,
                  marginBottom: 22,
                  marginLeft: 6,
                  marginRight: 6,
                  background: n < currentStep ? 'var(--accent)' : 'var(--border)',
                  borderRadius: 2,
                  transition: 'background 0.3s ease',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
