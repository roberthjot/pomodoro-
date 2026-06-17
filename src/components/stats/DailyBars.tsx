import { getLast7DayKeys } from '@lib/dateUtils'
import { DAILY_TARGET_POMODOROS } from '@config/constants'
import type { DailyStats } from '@/types'

const DAY_LETTER = ['D', 'L', 'M', 'X', 'J', 'V', 'S'] // 0=Sunday

interface Props {
  dailyStats: DailyStats[]
}

export function DailyBars({ dailyStats }: Props) {
  const keys = getLast7DayKeys()
  const todayKey = keys[keys.length - 1]

  const days = keys.map((key) => {
    const stat = dailyStats.find((s) => s.dateKey === key)
    const [y, m, d] = key.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return {
      key,
      letter: DAY_LETTER[date.getDay()],
      value: stat?.pomodorosCompleted ?? 0,
      isToday: key === todayKey,
    }
  })

  const max = Math.max(...days.map((d) => d.value), DAILY_TARGET_POMODOROS)

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] p-5 shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-[#f3f4f7]">Pomodoros por día</h3>
        <span className="text-xs text-neutral-400 dark:text-[#5d6675]">meta {DAILY_TARGET_POMODOROS}/día</span>
      </div>

      <div className="flex items-end justify-between gap-2 h-44">
        {days.map((d) => {
          const heightPct = max > 0 ? (d.value / max) * 100 : 0
          return (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-2 h-full">
              <span className="text-xs font-mono text-neutral-500 dark:text-[#9aa3b2]">{d.value || ''}</span>
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full transition-[height] duration-500"
                  style={{
                    height: `${Math.max(heightPct, 4)}%`,
                    borderRadius: '7px 7px 4px 4px',
                    background: d.isToday
                      ? 'linear-gradient(180deg, #ef4444, #f97316)'
                      : undefined,
                  }}
                >
                  {!d.isToday && (
                    <div className="w-full h-full rounded-[7px_7px_4px_4px] bg-neutral-100 dark:bg-[#1c2533]" />
                  )}
                </div>
              </div>
              <span
                className={`text-xs ${d.isToday ? 'font-bold text-accent' : 'text-neutral-400 dark:text-[#5d6675]'}`}
              >
                {d.letter}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
