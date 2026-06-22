interface RingDef {
  label: string
  value: number
  target: number
  color: string
  unit?: string
}

function Ring({ radius, stroke, color, pct }: { radius: number; stroke: number; color: string; pct: number }) {
  const c = 2 * Math.PI * radius
  const offset = c * (1 - Math.min(pct, 1))
  return (
    <>
      <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-neutral-100 dark:text-[#1c2533]" />
      <circle
        cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </>
  )
}

export function DailyRings({ pomodoros, focusMinutes, tasksCompleted, pomodoroTarget }: {
  pomodoros: number
  focusMinutes: number
  tasksCompleted: number
  pomodoroTarget: number
}) {
  const rings: RingDef[] = [
    { label: 'Pomodoros', value: pomodoros, target: pomodoroTarget, color: '#ef4444' },
    { label: 'Foco', value: focusMinutes, target: pomodoroTarget * 25, color: '#14b8a6', unit: 'min' },
    { label: 'Tareas', value: tasksCompleted, target: 5, color: '#8b5cf6' },
  ]

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] p-5 shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)] flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" className="rotate-[-90deg]">
          <Ring radius={70} stroke={12} color={rings[0].color} pct={rings[0].value / rings[0].target} />
          <Ring radius={54} stroke={12} color={rings[1].color} pct={rings[1].value / rings[1].target} />
          <Ring radius={38} stroke={12} color={rings[2].color} pct={rings[2].value / rings[2].target} />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-neutral-800 dark:text-[#f3f4f7]">Anillos de hoy</p>
        {rings.map((r) => (
          <div key={r.label} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
            <span className="text-sm text-neutral-600 dark:text-[#9aa3b2] w-20">{r.label}</span>
            <span className="text-sm font-mono font-semibold text-neutral-900 dark:text-[#f3f4f7]">
              {r.value}
              <span className="text-neutral-400 dark:text-[#5d6675] font-sans"> / {r.target}{r.unit ? ` ${r.unit}` : ''}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
