import { useState } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { ambientMusic } from '@lib/ambientMusic'
import { useSettingsStore } from '@stores/settingsStore'
import { getModeAccent, modeGradient } from '@lib/modeAccent'
import { cn } from '@lib/utils'
import type { TimerStatus, TimerMode } from '@/types'

interface Props {
  status: TimerStatus
  mode: TimerMode
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onSkip: () => void
}

const iconBtn =
  'flex items-center justify-center w-[46px] h-[46px] rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] text-neutral-500 dark:text-[#9aa3b2] hover:text-neutral-900 dark:hover:text-[#f3f4f7] hover:border-neutral-300 dark:hover:border-[#2a3645] transition-all'

export function TimerControls({ status, mode, onStart, onPause, onResume, onReset, onSkip }: Props) {
  const ambientSound = useSettingsStore((s) => s.sound.ambientSound)
  const [muted, setMuted] = useState(() => ambientMusic.isMuted())
  const { a } = getModeAccent(mode)
  const hasAmbient = ambientSound !== 'none'

  const handleToggleMute = () => setMuted(ambientMusic.toggleMute())

  const mainLabel =
    status === 'running' ? 'Pausar' : status === 'paused' ? 'Reanudar' : 'Iniciar'
  const onMain = status === 'running' ? onPause : status === 'paused' ? onResume : onStart

  return (
    <div className="flex items-center justify-center gap-3">
      <button onClick={onReset} className={iconBtn} title="Reiniciar (R)">
        <RotateCcw size={18} />
      </button>

      <button
        onClick={onMain}
        className="flex items-center justify-center gap-2 h-[52px] px-10 rounded-2xl text-white font-semibold text-base transition-transform active:scale-[0.98]"
        style={{ background: modeGradient(mode), boxShadow: `0 8px 22px ${a}50` }}
      >
        {status === 'running' ? <Pause size={18} /> : <Play size={18} />}
        {mainLabel}
      </button>

      <button onClick={onSkip} className={iconBtn} title="Saltar (S)">
        <SkipForward size={18} />
      </button>

      <button
        onClick={hasAmbient ? handleToggleMute : undefined}
        title={
          !hasAmbient
            ? 'Activa un sonido ambient en Ajustes'
            : muted
              ? 'Activar sonido ambient'
              : 'Silenciar sonido ambient'
        }
        className={cn(
          'flex items-center justify-center w-[46px] h-[46px] rounded-2xl transition-all',
          !hasAmbient && 'opacity-30 cursor-default text-neutral-400',
          hasAmbient && !muted && 'text-white',
          hasAmbient && muted && 'bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] text-neutral-400',
        )}
        style={hasAmbient && !muted ? { background: modeGradient(mode), boxShadow: `0 6px 16px ${a}40` } : undefined}
      >
        {muted || !hasAmbient ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  )
}
