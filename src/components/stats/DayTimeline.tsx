import { useEffect, useState } from 'react'
import { useAuthStore } from '@stores/authStore'
import { getSessionsForDay } from '@services/stats.service'
import { getModeAccent } from '@lib/modeAccent'
import { todayKey } from '@lib/dateUtils'
import type { PomodoroSession } from '@/types'

const card =
  'rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] p-5 shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]'

export function DayTimeline({ refreshKey }: { refreshKey?: number }) {
  const { user } = useAuthStore()
  const [sessions, setSessions] = useState<PomodoroSession[]>([])

  useEffect(() => {
    if (!user) return
    getSessionsForDay(user.uid, todayKey()).then(setSessions).catch(() => {})
  }, [user?.uid, refreshKey])

  // Window: from 6:00 (or earliest session) to 24:00 (or latest)
  const hoursOf = (d: Date) => d.getHours() + d.getMinutes() / 60
  const startHour = Math.min(6, ...sessions.map((s) => Math.floor(hoursOf(s.startedAt))))
  const endHour = Math.max(22, ...sessions.map((s) => Math.ceil(hoursOf(s.completedAt))))
  const span = Math.max(endHour - startHour, 1)

  const ticks: number[] = []
  for (let h = Math.ceil(startHour); h <= endHour; h += 3) ticks.push(h)

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-[#f3f4f7]">Tu día</h3>
        <span className="text-xs text-neutral-400 dark:text-[#5d6675]">
          {sessions.filter((s) => s.mode === 'pomodoro' || s.mode === 'hyperfocus').length} sesiones de foco
        </span>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-[#5d6675] py-4 text-center">
          Aún no hay sesiones hoy. ¡Inicia un pomodoro!
        </p>
      ) : (
        <div className="pt-2">
          <div className="relative h-9 rounded-lg bg-neutral-100 dark:bg-[#1c2533]">
            {sessions.map((s) => {
              const left = ((hoursOf(s.startedAt) - startHour) / span) * 100
              const width = Math.max((s.durationMinutes / 60 / span) * 100, 1.2)
              const { a, b } = getModeAccent(s.mode)
              return (
                <div
                  key={s.id}
                  className="absolute top-1 bottom-1 rounded-md group"
                  style={{ left: `${left}%`, width: `${width}%`, background: `linear-gradient(135deg, ${a}, ${b})` }}
                  title={`${s.taskTitle ?? s.mode} · ${s.durationMinutes}min · ${s.startedAt.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`}
                />
              )
            })}
          </div>
          <div className="relative h-4 mt-1">
            {ticks.map((h) => (
              <span
                key={h}
                className="absolute text-[10px] text-neutral-400 dark:text-[#5d6675] -translate-x-1/2"
                style={{ left: `${((h - startHour) / span) * 100}%` }}
              >
                {h}:00
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
