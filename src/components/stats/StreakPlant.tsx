interface Stage {
  min: number
  emoji: string
  name: string
  message: string
}

const STAGES: Stage[] = [
  { min: 0, emoji: '🌰', name: 'Semilla', message: 'Inicia una sesión para plantar tu semilla.' },
  { min: 1, emoji: '🌱', name: 'Brote', message: '¡Tu enfoque empieza a brotar!' },
  { min: 3, emoji: '🌿', name: 'Plántula', message: 'Sigue así, está creciendo.' },
  { min: 7, emoji: '🌷', name: 'En flor', message: 'Una semana entera. ¡Floreciste!' },
  { min: 14, emoji: '🌳', name: 'Árbol', message: 'Tu hábito ya tiene raíces fuertes.' },
  { min: 30, emoji: '🌴', name: 'Frondoso', message: '¡Un mes imparable de enfoque!' },
]

function currentStage(streak: number): { stage: Stage; next: Stage | null } {
  let idx = 0
  for (let i = 0; i < STAGES.length; i++) {
    if (streak >= STAGES[i].min) idx = i
  }
  return { stage: STAGES[idx], next: STAGES[idx + 1] ?? null }
}

export function StreakPlant({ streak }: { streak: number }) {
  const { stage, next } = currentStage(streak)
  const daysToNext = next ? next.min - streak : 0

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] p-5 shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)] flex items-center gap-5">
      <div
        className="shrink-0 w-24 h-24 rounded-2xl flex items-center justify-center"
        style={{ background: 'radial-gradient(circle at 50% 70%, #22c55e22, transparent 70%)' }}
      >
        <span className="text-5xl animate-pulse-slow">{stage.emoji}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-neutral-400 dark:text-[#5d6675]">Tu planta de enfoque</p>
        <p className="text-lg font-bold text-neutral-900 dark:text-[#f3f4f7] mt-0.5">
          {stage.name} · <span className="text-orange-500">🔥 {streak}</span>
        </p>
        <p className="text-sm text-neutral-500 dark:text-[#9aa3b2] mt-1">{stage.message}</p>
        {next && (
          <p className="text-xs text-neutral-400 dark:text-[#5d6675] mt-1.5">
            {daysToNext} {daysToNext === 1 ? 'día' : 'días'} más para {next.emoji} {next.name}
          </p>
        )}
      </div>
    </div>
  )
}
