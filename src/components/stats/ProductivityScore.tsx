interface Props { score: number }

export function ProductivityScore({ score }: Props) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  const circumference = 2 * Math.PI * 36
  const dashoffset = circumference * (1 - score / 100)

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-2">
      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Score</span>
      <div className="flex items-center gap-3">
        <svg width="56" height="56" className="-rotate-90">
          <circle cx="28" cy="28" r="36" fill="none" />
          <circle cx="28" cy="28" r="22" fill="none" stroke="#e5e7eb" strokeWidth="6" className="dark:stroke-neutral-700" />
          <circle
            cx="28" cy="28" r="22" fill="none"
            stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div>
          <span className="text-2xl font-bold font-mono" style={{ color }}>{score}</span>
          <p className="text-xs text-neutral-400">/ 100</p>
        </div>
      </div>
    </div>
  )
}
