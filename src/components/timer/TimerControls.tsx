import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from '@components/ui/Button'
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
    </div>
  )
}
