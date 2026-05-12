export default function ECGLine({ speed = 3, opacity = 0.3, height = 80 }) {
  const w = height * 2.5 // one period width
  const totalWidth = w * 4

  const buildPath = () => {
    let d = ''
    for (let i = 0; i < 4; i++) {
      const o = i * w
      d += ` M ${o},${height * 0.69}`
      d += ` L ${o + height * 0.31},${height * 0.69}`
      d += ` Q ${o + height * 0.34},${height * 0.53} ${o + height * 0.40},${height * 0.69}`
      d += ` L ${o + height * 0.60},${height * 0.69}`
      d += ` L ${o + height * 0.63},${height * 0.78}`
      d += ` L ${o + height * 0.66},${height * 0.10}`
      d += ` L ${o + height * 0.70},${height * 0.88}`
      d += ` L ${o + height * 0.75},${height * 0.69}`
      d += ` L ${o + height * 0.90},${height * 0.69}`
      d += ` Q ${o + height * 1.00},${height * 0.47} ${o + height * 1.10},${height * 0.69}`
      d += ` L ${o + w},${height * 0.69}`
    }
    return d
  }

  const animName = `ecg-scroll-${Math.round(speed * 10)}`

  return (
    <div
      style={{
        width: '100%',
        height,
        overflow: 'hidden',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes ${animName} {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        style={{
          animation: `${animName} ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        <path
          d={buildPath()}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
