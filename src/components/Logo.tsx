interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export function LogoFull({ size = 'md' }: LogoProps) {
  const config = {
    sm: { mark: 22, text: 'text-base' },
    md: { mark: 28, text: 'text-xl' },
    lg: { mark: 34, text: 'text-2xl' },
  }[size]

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200/40">
        <span className="text-lg font-semibold">R</span>
      </div>
      <span className={`font-display font-semibold tracking-tight ${config.text}`}>
        Risly.
      </span>
    </div>
  )
}

export default LogoFull
