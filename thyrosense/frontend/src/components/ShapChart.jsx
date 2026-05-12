import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'

export default function ShapChart({ features = [], color = '#64748b' }) {
  const data = [...features]
    .sort((a, b) => b.shap_value - a.shap_value)
    .map(f => ({ name: f.feature, value: parseFloat(f.shap_value.toFixed(3)) }))

  const chartHeight = Math.max(data.length * 46 + 20, 80)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm text-xs">
        <span className="font-semibold text-slate-700">{payload[0].payload.name}</span>
        <span className="text-slate-400 ml-2">SHAP {payload[0].value.toFixed(3)}</span>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
        barCategoryGap="28%"
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => v.toFixed(2)}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={110}
          tick={{ fontSize: 13, fill: '#475569', fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Bar dataKey="value" radius={[0, 5, 5, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={color}
              fillOpacity={Math.max(1 - i * 0.14, 0.4)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
