import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// TODO: render top SHAP feature importance bars
export default function ShapChart({ features = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={features} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="feature" type="category" width={120} />
        <Tooltip />
        <Bar dataKey="value" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  )
}
