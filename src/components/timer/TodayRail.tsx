import { useEffect, useState } from 'react'
import { useStats } from '@hooks/useStats'
import { useAuthStore } from '@stores/authStore'
import { getRecentSessions } from '@services/stats.service'
import { getModeAccent } from '@lib/modeAccent'
import { DAILY_TARGET_POMODOROS } from '@config/constants'
import { todayKey } from '@lib/dateUtils'
import type { PomodoroSession, TimerMode } from '@/types'

function formatFocus(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h${m.toString().padStart(2, '0')}`
}

function formatClock(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

const label = 'text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-400 dark:text-[#5d6675]'
const card =
  'rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]'

export function TodayRail({ mode }: { mode: TimerMode }) {
  const stats = useStats()
  const { user } = useAuthStore()
  const { a, b } = getModeAccent(mode)
  const [recent, setRecent] = useState<PomodoroSession[]>([])

  useEffect(() => {
    if (!user) return
    getRecentSessions(user.uid, 4).then(setRecent).catch(() => {})
  }, [user?.uid, stats.totalSessions]) // eslint-disable-line react-hooks/exhaustive-deps

  const today = stats.dailyStats.find((s) => s.dateKey === todayKey())
  const pomodorosToday = today?.pomodorosCompleted ?? 0
  const focusToday = today?.focusMinutes ?? 0
  const pct = Math.min(pomodorosToday / DAILY_TARGET_POMODOROS, 1) * 100

  return (
    <div className="flex flex-col gap-3 w-[264px]">
      <p className={label}>Hoy</p>

      {/* Pomodoros progress */}
      <div className={`${card} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-500 dark:text-[#9aa3b2]">Pomodoros</span>
          <span className="text-sm font-mono font-semibold text-neutral-900 dark:text-[#f3f4f7]">
            {pomodorosToday} / {DAILY_TARGET_POMODOROS}
          </span>
        </div>
        <div className="h-2 rounded-full bg-neutral-100 dark:bg-[#1c2533] overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${a}, ${b})` }}
          />
        </div>
      </div>

      {/* Two stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`${card} p-4`}>
          <p className="text-xl font-mono font-bold text-neutral-900 dark:text-[#f3f4f7]">{formatFocus(focusToday)}</p>
          <p className="text-xs text-neutral-400 dark:text-[#5d6675] mt-0.5">en foco</p>
        </div>
        <div className={`${card} p-4`}>
          <p className="text-xl font-mono font-bold text-neutral-900 dark:text-[#f3f4f7]">{stats.currentStreak}</p>
          <p className="text-xs text-neutral-400 dark:text-[#5d6675] mt-0.5">racha</p>
        </div>
      </div>

      {/* Recent sessions */}
      <div className={`${card} p-4`}>
        <p className="text-sm font-medium text-neutral-700 dark:text-[#f3f4f7] mb-3">Sesiones recientes</p>
        {recent.length === 0 ? (
          <p className="text-xs text-neutral-400 dark:text-[#5d6675]">Aún no hay sesiones.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((s) => (
              <div key={s.id} className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: getModeAccent(s.mode).a }}
                />
                <span className="text-sm text-neutral-600 dark:text-[#9aa3b2] flex-1 truncate">
                  {s.taskTitle ?? (s.mode === 'pomodoro' ? 'Pomodoro' : 'Descanso')}
                </span>
                <span className="text-xs font-mono text-neutral-400 dark:text-[#5d6675] shrink-0">
                  {formatClock(s.durationMinutes)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
