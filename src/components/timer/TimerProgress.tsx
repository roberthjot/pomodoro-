interface TimerProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}

export function TimerProgress({ progress, size = 280, strokeWidth = 8, color = 'var(--accent-color)' }: TimerProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - Math.min(progress, 1))

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-neutral-200 dark:text-neutral-800"
      />
      {/* Progress */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  )
}
