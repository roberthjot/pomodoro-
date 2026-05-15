import { useState } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { ambientMusic } from '@lib/ambientMusic'
import { useSettingsStore } from '@stores/settingsStore'
import { cn } from '@lib/utils'
import type { TimerStatus } from '@/types'

interface Props {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ status, onStart, onPause, onResume, onReset, onSkip }: Props) {
  const ambientSound = useSettingsStore((s) => s.sound.ambientSound)
  const [muted, setMuted] = useState(() => ambientMusic.isMuted())

  const handleToggleMute = () => {
    const nowMuted = ambientMusic.toggleMute()
    setMuted(nowMuted)
  }

  const showMuteBtn = ambientSound !== 'none'

  return (
    <div className="flex items-center justify-center gap-3">
      <Button variant="ghost" size="icon" onClick={onReset} title="Reset (R)">
        <RotateCcw size={18} />
      </Button>

      {status === 'idle' || status === 'finished' ? (
        <Button size="lg" onClick={onStart} className="px-10">
          <Play size={18} />
          Start
        </Button>
      ) : status === 'running' ? (
        <Button size="lg" onClick={onPause} className="px-10">
          <Pause size={18} />
          Pause
        </Button>
      ) : (
        <Button size="lg" onClick={onResume} className="px-10">
          <Play size={18} />
          Resume
        </Button>
      )}

      <Button variant="ghost" size="icon" onClick={onSkip} title="Skip (S)">
        <SkipForward size={18} />
      </Button>

      {showMuteBtn && (
        <button
          onClick={handleToggleMute}
          title={muted ? 'Activar música ambient' : 'Silenciar música ambient'}
          className={cn(
            'p-2 rounded-lg transition-all text-sm',
            muted
              ? 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              : 'text-accent hover:opacity-70',
          )}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}
    </div>
  )
}
