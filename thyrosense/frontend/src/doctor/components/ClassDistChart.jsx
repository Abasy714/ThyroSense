import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CLASS_COLORS = {
  healthy: '#10B981',
  hypothyroid: '#3B82F6',
  hyperthyroid: '#EF4444',
  binding_protein_disorder: '#8B5CF6',
}

const LABELS = {
  healthy: 'Healthy',
  hypothyroid: 'Hypothyroid',
  hyperthyroid: 'Hyperthyroid',
  binding_protein_disorder: 'Binding Protein',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '0.55rem 0.85rem', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'var(--text)' }}>
      <strong>{LABELS[name] || name}</strong>: {value} patients
    </div>
  )
}

export default function ClassDistChart({ counts }) {
  const data = Object.entries(counts).map(([key, value]) => ({ name: key, value }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={52} outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map(({ name }) => (
            <Cell key={name} fill={CLASS_COLORS[name] || '#6B7280'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {LABELS[value] || value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
