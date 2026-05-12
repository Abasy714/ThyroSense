import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

const RADIUS = 80
const FULL_ARC = Math.PI * RADIUS // ≈ 251.33

export default function ConfidenceGauge({ value, color, label }) {
  const [progress, setProgress] = useState(0)
  const [displayVal, setDisplayVal] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setProgress(v)
        setDisplayVal(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [value])

  const dashOffset = FULL_ARC * (1 - progress / 100)
  // at 0%: needle at -180deg (left end), at 100%: 0deg (right end)
  const needleAngle = progress * 1.8 - 180

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 200 115" style={{ width: '100%', maxWidth: 240, overflow: 'visible' }}>
        {/* Background track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--border)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={FULL_ARC}
          strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        {/* Needle */}
        <g style={{ transformOrigin: '100px 100px', transform: `rotate(${needleAngle}deg)` }}>
          <line x1="100" y1="100" x2="168" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <line x1="100" y1="100" x2="82" y2="100" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </g>
        {/* Center hub */}
        <circle cx="100" cy="100" r="6" fill={color} />
        <circle cx="100" cy="100" r="3" fill="var(--bg)" />
        {/* Percentage */}
        <text
          x="100" y="78"
          textAnchor="middle"
          fill="var(--text)"
          style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 30 }}
        >
          {displayVal}%
        </text>
        {/* Label below */}
        <text
          x="100" y="112"
          textAnchor="middle"
          fill="var(--text-muted)"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11 }}
        >
          {label}
        </text>
        <text x="16" y="114" textAnchor="middle" fill="var(--text-muted)" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9 }}>0%</text>
        <text x="184" y="114" textAnchor="middle" fill="var(--text-muted)" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9 }}>100%</text>
      </svg>
    </div>
  )
}
