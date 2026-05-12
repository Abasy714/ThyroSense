import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'

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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, padding: '0.6rem 0.9rem', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem' }}>
      <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: 'var(--text)' }}>{LABELS[label] || label}</p>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>Avg TSH: <strong style={{ color: 'var(--text)' }}>{payload[0].value} mIU/L</strong></p>
    </div>
  )
}

export default function HormoneChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, fill: 'var(--text-muted)' }}
          tickFormatter={(v) => LABELS[v]?.split(' ')[0] || v}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, fill: 'var(--text-muted)' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'color-mix(in srgb, var(--surface-hover) 60%, transparent)' }} />
        <ReferenceLine y={4.5} stroke="var(--warning)" strokeDasharray="4 3" strokeWidth={1.2} label={{ value: 'Upper Normal', position: 'insideTopRight', fill: 'var(--warning)', fontSize: 9, fontFamily: 'DM Sans, sans-serif' }} />
        <ReferenceLine y={0.4} stroke="var(--success)" strokeDasharray="4 3" strokeWidth={1.2} />
        <Bar dataKey="avgTSH" radius={[5, 5, 0, 0]} maxBarSize={44}>
          {data.map(({ name }) => (
            <Cell key={name} fill={CLASS_COLORS[name] || '#6B7280'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
