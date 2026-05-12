export default function LoadingSpinner({ size = 36, color = 'var(--accent)' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 36 36" fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="18" cy="18" r="14" stroke={color} strokeWidth="3" strokeOpacity="0.15" />
      <path d="M18 4 A14 14 0 0 1 32 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
