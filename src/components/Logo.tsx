function RislyMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="28" height="28" rx="7" fill="#059669" />
      <polyline
        points="4,21 9,14 14,18 22,7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="17,7 22,7 22,12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export function LogoFull({ size = 'md' }: LogoProps) {
  const config = {
    sm: { mark: 22, text: 'text-base' },
    md: { mark: 28, text: 'text-xl' },
    lg: { mark: 34, text: 'text-2xl' },
  }
  const c = config[size]
  return (
    <div className="flex items-center gap-2">
      <RislyMark size={c.mark} />
      <span className={`font-bold tracking-tight ${c.text}`}>
        <span className="text-emerald-400">Ris</span>
        <span className="text-white">ly</span>
      </span>
    </div>
  )
}

export default RislyMark
