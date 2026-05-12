const CLASS_COLORS = {
  healthy: '#10B981',
  hypothyroid: '#3B82F6',
  hyperthyroid: '#EF4444',
  binding_protein_disorder: '#8B5CF6',
}

const SIZES = {
  sm: { fontSize: '0.68rem', padding: '2px 8px', borderRadius: 99 },
  md: { fontSize: '0.78rem', padding: '4px 12px', borderRadius: 99 },
  lg: { fontSize: '1rem', padding: '7px 18px', borderRadius: 99 },
}

function prettify(cls) {
  if (!cls) return 'Unknown'
  return cls
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function ClassBadge({ diagnosisClass, size = 'md' }) {
  const color = CLASS_COLORS[diagnosisClass] || '#6B7280'
  const sz = SIZES[size] || SIZES.md
  return (
    <span
      style={{
        display: 'inline-block',
        background: color + '22',
        color: color,
        border: `1.5px solid ${color}55`,
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 700,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...sz,
      }}
    >
      {prettify(diagnosisClass)}
    </span>
  )
}
