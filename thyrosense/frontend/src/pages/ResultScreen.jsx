import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ShapChart from '../components/ShapChart'

const CLASS_CONFIG = {
  healthy: {
    label: 'Healthy',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    barColor: '#10B981',
    sub: 'No disorder detected',
  },
  hypothyroid: {
    label: 'Hypothyroid',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    barColor: '#3B82F6',
    sub: 'Underactive thyroid',
  },
  hyperthyroid: {
    label: 'Hyperthyroid',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    barColor: '#F97316',
    sub: 'Overactive thyroid',
  },
  binding_protein_disorder: {
    label: 'Binding Protein Disorder',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    barColor: '#8B5CF6',
    sub: 'Protein binding anomaly',
  },
}

export default function ResultScreen() {
  const location = useLocation()
  const navigate  = useNavigate()
  const result    = location.state?.result

  useEffect(() => {
    if (!result) navigate('/', { replace: true })
  }, [result, navigate])

  if (!result) return null

  const cfg = CLASS_CONFIG[result.predicted_class] ?? CLASS_CONFIG.healthy
  const pct = Math.round(result.confidence * 100)

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-10 px-4">
      <div className="max-w-[720px] mx-auto">

        {/* Header row */}
        <div className="fade-up-1 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase leading-none">
                ThyroSense
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-none">
                Thyroid Disorder Detection
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-medium text-slate-400 hover:text-slate-700
                       border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5
                       transition-all bg-white shadow-sm"
          >
            ← New Patient
          </button>
        </div>

        <div className="fade-up-2 mb-7">
          <h1 className="text-[1.6rem] font-semibold text-slate-800 leading-snug">
            Analysis Result
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Cluster {result.cluster_id} · {result.top_features.length} features analysed
          </p>
        </div>

        <div className="space-y-4">

          {/* ── Diagnosis badge ── */}
          <div className={`fade-up-3 ${cfg.bg} border ${cfg.border} rounded-2xl p-6 shadow-sm`}>
            <div className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-3">
              Diagnosis
            </div>
            <div className="flex items-end gap-3">
              <span className={`text-3xl font-bold tracking-tight ${cfg.text}`}>
                {cfg.label}
              </span>
              <span className={`text-sm ${cfg.text} opacity-70 mb-0.5`}>
                {cfg.sub}
              </span>
            </div>
          </div>

          {/* ── Confidence ── */}
          <div className="fade-up-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-3">
              Model Confidence
            </div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-bold text-slate-800">{pct}%</span>
              <span className="text-sm text-slate-400 mb-0.5">confidence score</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="confidence-bar h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: cfg.barColor }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-slate-300">0%</span>
              <span className="text-[11px] text-slate-300">100%</span>
            </div>
          </div>

          {/* ── SHAP chart ── */}
          {result.top_features.length > 0 && (
            <div className="fade-up-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-1">
                Feature Importance
              </div>
              <p className="text-xs text-slate-400 mb-5">
                SHAP values — contribution of each feature to this prediction
              </p>
              <ShapChart features={result.top_features} color={cfg.barColor} />
            </div>
          )}

          {/* ── Clinical interpretation ── */}
          <div className="fade-up-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-3">
              Clinical Interpretation
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.clinical_interpretation}
            </p>
          </div>

          {/* ── CTA ── */}
          <div className="fade-up-6 pb-2">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900
                         text-white text-sm font-medium py-3.5 px-6 rounded-xl
                         transition-all shadow-sm"
            >
              ← New Patient Assessment
            </button>
          </div>

        </div>

        <p className="fade-up-6 text-center text-xs text-slate-400 mt-4 pb-8">
          ThyroSense v0.1 · Research use only · Not a substitute for clinical diagnosis
        </p>
      </div>
    </div>
  )
}
