import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

function formatFocus(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

interface Props {
  pomodoros: number
  focusMinutes: number
  tasksCompleted: number
  streak: number
}

export function DailySummaryCard({ pomodoros, focusMinutes, tasksCompleted, streak }: Props) {
  const [copied, setCopied] = useState(false)

  const text =
    `🍅 Mi día de enfoque\n` +
    `• ${pomodoros} pomodoros\n` +
    `• ${formatFocus(focusMinutes)} concentrado\n` +
    `• ${tasksCompleted} tareas completadas\n` +
    `• 🔥 racha de ${streak} días`

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text })
        return
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* noop */
    }
  }

  return (
    <div
      className="rounded-2xl p-5 text-white relative overflow-hidden shadow-[0_8px_24px_rgba(239,68,68,0.25)]"
      style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -right-2 top-10 w-20 h-20 rounded-full bg-white/10" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold opacity-90">Mi día de enfoque</p>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-medium transition-colors"
          >
            {copied ? <><Check size={13} /> Copiado</> : <><Share2 size={13} /> Compartir</>}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-3xl font-mono font-bold leading-none">{pomodoros}</p>
            <p className="text-xs opacity-80 mt-1">pomodoros</p>
          </div>
          <div>
            <p className="text-3xl font-mono font-bold leading-none">{formatFocus(focusMinutes)}</p>
            <p className="text-xs opacity-80 mt-1">en foco</p>
          </div>
          <div>
            <p className="text-3xl font-mono font-bold leading-none">{tasksCompleted}</p>
            <p className="text-xs opacity-80 mt-1">tareas</p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium">
          🔥 racha de {streak} {streak === 1 ? 'día' : 'días'}
        </div>
      </div>
    </div>
  )
}
