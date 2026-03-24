interface Props {
  completed: number
  estimated: number
  minutesPerPomodoro?: number
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function PomodoroCounter({ completed, estimated, minutesPerPomodoro }: Props) {
  const remaining = estimated - completed
  const remainingMinutes = minutesPerPomodoro != null ? remaining * minutesPerPomodoro : null
  const totalMinutes = minutesPerPomodoro != null ? estimated * minutesPerPomodoro : null

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: estimated }).map((_, i) => (
          <span key={i} className={`text-sm ${i < completed ? 'opacity-100' : 'opacity-25'}`}>🍅</span>
        ))}
      </div>
      <span className="text-xs text-neutral-400">{completed}/{estimated}</span>
      {totalMinutes !== null && (
        <span className="text-xs text-neutral-400">
          ·{' '}
          {remainingMinutes === 0
            ? 'done'
            : remainingMinutes !== totalMinutes
            ? `~${formatDuration(remainingMinutes!)} left`
            : `~${formatDuration(totalMinutes)}`}
        </span>
      )}
    </div>
  )
}
