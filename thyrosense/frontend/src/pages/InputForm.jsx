import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const HORMONE_FIELDS = [
  { key: 'TSH',  label: 'TSH',  unit: 'mU/L',   hint: 'Normal: 0.4 – 4.0'  },
  { key: 'T3',   label: 'T3',   unit: 'nmol/L',  hint: 'Normal: 1.2 – 2.8'  },
  { key: 'TT4',  label: 'TT4',  unit: 'nmol/L',  hint: 'Normal: 58 – 161'   },
  { key: 'T4U',  label: 'T4U',  unit: 'ratio',   hint: 'Normal: 0.7 – 1.1'  },
  { key: 'FTI',  label: 'FTI',  unit: 'index',   hint: 'Normal: 65 – 155'   },
]

const FLAG_FIELDS = [
  { key: 'on_thyroxine',              label: 'On Thyroxine'              },
  { key: 'query_on_thyroxine',        label: 'Query On Thyroxine'        },
  { key: 'on_antithyroid_medication', label: 'On Antithyroid Medication' },
  { key: 'sick',                      label: 'Sick'                      },
  { key: 'pregnant',                  label: 'Pregnant'                  },
  { key: 'thyroid_surgery',           label: 'Thyroid Surgery'           },
  { key: 'I131_treatment',            label: 'I131 Treatment'            },
  { key: 'query_hypothyroid',         label: 'Query Hypothyroid'         },
  { key: 'query_hyperthyroid',        label: 'Query Hyperthyroid'        },
  { key: 'lithium',                   label: 'Lithium'                   },
  { key: 'goitre',                    label: 'Goitre'                    },
  { key: 'tumor',                     label: 'Tumor'                     },
  { key: 'hypopituitary',             label: 'Hypopituitary'             },
  { key: 'psych',                     label: 'Psych'                     },
]

const initLabs  = () => Object.fromEntries(HORMONE_FIELDS.map(f => [f.key, { value: '', notMeasured: false }]))
const initFlags = () => Object.fromEntries(FLAG_FIELDS.map(f => [f.key, false]))

export default function InputForm() {
  const navigate = useNavigate()
  const [age, setAge]         = useState('')
  const [sex, setSex]         = useState('')
  const [labs, setLabs]       = useState(initLabs)
  const [flags, setFlags]     = useState(initFlags)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const updateLab = (key, field, value) =>
    setLabs(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }))

  const handleNotMeasured = (key, checked) =>
    setLabs(prev => ({
      ...prev,
      [key]: { value: checked ? '' : prev[key].value, notMeasured: checked },
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const labValues = Object.fromEntries(
      HORMONE_FIELDS.map(f => [
        f.key,
        labs[f.key].notMeasured || labs[f.key].value === ''
          ? null
          : parseFloat(labs[f.key].value),
      ])
    )

    const payload = {
      data: {
        age:  age !== '' ? parseInt(age, 10) : null,
        sex:  sex || null,
        ...labValues,
        ...flags,
      },
    }

    try {
      const res = await axios.post('/api/predict', payload)
      navigate('/result', { state: { result: res.data } })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not reach the server. Make sure the backend is running on port 8000.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-10 px-4">
      <div className="max-w-[720px] mx-auto">

        {/* Wordmark */}
        <div className="fade-up-1 flex items-center gap-2.5 mb-8">
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

        <div className="fade-up-2 mb-7">
          <h1 className="text-[1.6rem] font-semibold text-slate-800 leading-snug">
            Patient Assessment
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Complete all available fields. Lab values may be marked as not measured.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Section 1: Patient Info ── */}
          <div className="fade-up-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <SectionLabel index="01" title="Patient Information" />
            <div className="grid grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Age <span className="text-slate-400 font-normal">(1 – 100)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300
                             placeholder:text-slate-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Sex</label>
                <div className="flex gap-6 mt-3">
                  {['Male', 'Female'].map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="sex"
                        value={s[0]}
                        checked={sex === s[0]}
                        onChange={() => setSex(s[0])}
                        className="w-4 h-4 accent-slate-700"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Lab Results ── */}
          <div className="fade-up-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <SectionLabel index="02" title="Laboratory Results" />
            <div className="mt-4 space-y-2.5">
              {HORMONE_FIELDS.map(({ key, label, unit, hint }) => (
                <div key={key} className="flex items-center gap-3 py-0.5">
                  <span className="w-10 text-sm font-semibold text-slate-700 shrink-0">{label}</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      step="any"
                      value={labs[key].value}
                      onChange={e => updateLab(key, 'value', e.target.value)}
                      disabled={labs[key].notMeasured}
                      placeholder={labs[key].notMeasured ? '—' : hint}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300
                                 placeholder:text-slate-300 transition-all
                                 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                    />
                  </div>
                  <span className="w-14 text-xs text-slate-400 shrink-0">{unit}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={labs[key].notMeasured}
                      onChange={e => handleNotMeasured(key, e.target.checked)}
                      className="w-3.5 h-3.5 accent-slate-500"
                    />
                    <span className="text-xs text-slate-400 select-none">Not measured</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 3: Clinical Flags ── */}
          <div className="fade-up-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <SectionLabel index="03" title="Clinical Flags" />
            <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-6">
              {FLAG_FIELDS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={flags[key]}
                    onChange={e => setFlags(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-4 h-4 accent-slate-700 shrink-0"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors select-none">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="fade-up-6 pb-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900
                         text-white text-sm font-medium py-3.5 px-6 rounded-xl
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analysing…
                </>
              ) : (
                'Run Analysis →'
              )}
            </button>
          </div>

        </form>

        <p className="fade-up-6 text-center text-xs text-slate-400 mt-4 pb-8">
          ThyroSense v0.1 · Research use only · Not a substitute for clinical diagnosis
        </p>
      </div>
    </div>
  )
}

function SectionLabel({ index, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">{index}</span>
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
    </div>
  )
}
