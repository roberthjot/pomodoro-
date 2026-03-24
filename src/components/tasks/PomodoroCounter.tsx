interface Props {
  completed: number
  estimated: number
}

export function PomodoroCounter({ completed, estimated }: Props) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {Array.from({ length: estimated }).map((_, i) => (
        <span key={i} className={`text-base ${i < completed ? 'opacity-100' : 'opacity-25'}`}>🍅</span>
      ))}
      <span className="text-xs text-neutral-400 ml-1">{completed}/{estimated}</span>
    </div>
  )
}
