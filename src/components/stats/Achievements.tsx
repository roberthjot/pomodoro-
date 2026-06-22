import { Lock } from 'lucide-react'
import { ACHIEVEMENTS, type AchievementCtx } from '@lib/achievements'
import { cn } from '@lib/utils'

const card =
  'rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] p-5 shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]'

export function Achievements(ctx: AchievementCtx) {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked(ctx)).length

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-[#f3f4f7]">Logros</h3>
        <span className="text-xs text-neutral-400 dark:text-[#5d6675]">
          {unlockedCount}/{ACHIEVEMENTS.length} desbloqueados
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = a.unlocked(ctx)
          const { current, target } = a.progress(ctx)
          const pct = Math.min((current / target) * 100, 100)
          return (
            <div
              key={a.id}
              className={cn(
                'flex flex-col items-center text-center gap-1.5 p-3 rounded-xl border transition-all',
                unlocked
                  ? 'border-accent/30 bg-accent/[0.06] dark:bg-accent/10'
                  : 'border-neutral-200/70 dark:border-[#1f2836] bg-neutral-50 dark:bg-[#0f1420]',
              )}
              title={a.description}
            >
              <div className="relative">
                <span className={cn('text-3xl', !unlocked && 'grayscale opacity-40')}>{a.emoji}</span>
                {!unlocked && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neutral-200 dark:bg-[#1c2533] flex items-center justify-center">
                    <Lock size={9} className="text-neutral-400 dark:text-[#5d6675]" />
                  </span>
                )}
              </div>
              <p className={cn('text-xs font-semibold leading-tight', unlocked ? 'text-neutral-800 dark:text-[#f3f4f7]' : 'text-neutral-400 dark:text-[#5d6675]')}>
                {a.title}
              </p>
              {unlocked ? (
                <span className="text-[10px] text-accent font-medium">¡Logrado!</span>
              ) : (
                <div className="w-full mt-0.5">
                  <div className="h-1 rounded-full bg-neutral-200 dark:bg-[#1c2533] overflow-hidden">
                    <div className="h-full rounded-full bg-accent/60" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-neutral-400 dark:text-[#5d6675]">{current}/{target}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
