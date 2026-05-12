import {
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '8px 12px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.8rem',
      }}
    >
      <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 2 }}>{d.feature}</div>
      <div style={{ color: 'var(--text-muted)' }}>
        SHAP:{' '}
        <span style={{ color: d.shap_value >= 0 ? payload[0].fill : '#888' }}>
          {d.shap_value >= 0 ? '+' : ''}{d.shap_value.toFixed(3)}
        </span>
      </div>
    </div>
  )
}

export default function ShapChart({ features, classColor }) {
  if (!features?.length) return null

  const sorted = [...features].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))

  return (
    <div>
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
          marginTop: 0,
        }}
      >
        Positive values push toward this prediction · Negative values push away
      </p>
      <ResponsiveContainer width="100%" height={Math.max(160, sorted.length * 38)}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barCategoryGap="28%"
        >
          <XAxis
            type="number"
            tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, fill: 'var(--text-muted)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            tickFormatter={v => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))}
          />
          <YAxis
            type="category"
            dataKey="feature"
            width={80}
            tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: 'var(--text)', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine x={0} stroke="var(--border)" strokeWidth={1.5} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-hover)', opacity: 0.5 }} />
          <Bar dataKey="shap_value" radius={[0, 4, 4, 0]}>
            {sorted.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.shap_value >= 0 ? classColor : 'var(--text-muted)'}
                opacity={entry.shap_value >= 0 ? 1 : 0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
