import { useStats } from '@hooks/useStats'
import { DailyBars } from '@components/stats/DailyBars'
import { DailyRings } from '@components/stats/DailyRings'
import { YearHeatmap } from '@components/stats/YearHeatmap'
import { Skeleton } from '@components/ui/Skeleton'
import { DAILY_TARGET_POMODOROS } from '@config/constants'
import { todayKey } from '@lib/dateUtils'

function formatFocus(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h${m}` : `${h}h`
}

function scoreLabel(score: number): string {
  if (score >= 70) return 'Productividad alta'
  if (score >= 40) return 'Productividad media'
  return 'Sigue sumando'
}

const card =
  'rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
const sectionLabel = 'text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-400 dark:text-[#5d6675]'

export function StatsPage() {
  const stats = useStats()

  const weekPomodoros = stats.weeklyData.reduce((sum, d) => sum + d.pomodoros, 0)
  const weekFocus = stats.weeklyData.reduce((sum, d) => sum + d.focusMinutes, 0)
  const score = stats.productivityScore

  const today = stats.dailyStats.find((s) => s.dateKey === todayKey())

  const ringCircumference = 2 * Math.PI * 42
  const dashoffset = ringCircumference * (1 - score / 100)

  if (stats.isLoading) {
    return (
      <div className="max-w-[760px] mx-auto flex flex-col gap-4 animate-fade-in">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="max-w-[760px] mx-auto flex flex-col gap-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-neutral-900 dark:text-[#f3f4f7]">Estadísticas</h1>
        <p className="text-sm text-neutral-400 dark:text-[#5d6675] mt-0.5">Tu semana de enfoque</p>
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-3">
        {/* Score card */}
        <div className={`${card} p-5 flex items-center gap-4`}>
          <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
            <svg width="96" height="96" className="rotate-[-90deg]">
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <circle cx="48" cy="48" r="42" fill="none" strokeWidth="8" className="stroke-neutral-100 dark:stroke-[#1c2533]" />
              <circle
                cx="48" cy="48" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={dashoffset}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-mono font-bold text-neutral-900 dark:text-[#f3f4f7]">{score}</span>
              <span className="text-[10px] uppercase tracking-wide text-neutral-400 dark:text-[#5d6675]">score</span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-[#f3f4f7]">{scoreLabel(score)}</p>
            <p className="text-sm text-neutral-400 dark:text-[#5d6675] mt-1">Tu ritmo de esta semana de enfoque.</p>
          </div>
        </div>

        {/* KPI: Foco total */}
        <div className={`${card} p-5 flex flex-col justify-center`}>
          <p className={sectionLabel}>Foco total</p>
          <p className="text-3xl font-mono font-bold text-neutral-900 dark:text-[#f3f4f7] mt-2">{formatFocus(weekFocus)}</p>
          <p className="text-xs text-green-500 mt-1">esta semana</p>
        </div>

        {/* KPI: Pomodoros */}
        <div className={`${card} p-5 flex flex-col justify-center`}>
          <p className={sectionLabel}>Pomodoros</p>
          <p className="text-3xl font-mono font-bold text-neutral-900 dark:text-[#f3f4f7] mt-2">{weekPomodoros}</p>
          <p className="text-xs text-neutral-400 dark:text-[#5d6675] mt-1">en 7 días</p>
        </div>
      </div>

      {/* Daily rings */}
      <DailyRings
        pomodoros={today?.pomodorosCompleted ?? 0}
        focusMinutes={today?.focusMinutes ?? 0}
        tasksCompleted={today?.tasksCompleted ?? 0}
        pomodoroTarget={DAILY_TARGET_POMODOROS}
      />

      {/* Bar chart */}
      <DailyBars dailyStats={stats.dailyStats} />

      {/* Year heatmap */}
      <YearHeatmap dailyStats={stats.dailyStats} />
    </div>
  )
}
