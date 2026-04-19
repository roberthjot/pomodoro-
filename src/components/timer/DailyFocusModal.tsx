import { useState } from 'react'
import { Modal } from '@components/ui/Modal'
import { Button } from '@components/ui/Button'
import { useDailyFocusStore } from '@stores/dailyFocusStore'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function DailyFocusModal({ isOpen, onClose }: Props) {
  const { setTasks } = useDailyFocusStore()
  const [tasks, setLocalTasks] = useState<[string, string, string]>(['', '', ''])

  const handleChange = (i: number, value: string) => {
    const t = [...tasks] as [string, string, string]
    t[i] = value
    setLocalTasks(t)
  }

  const handleSave = () => {
    setTasks(tasks)
    onClose()
  }

  const handleSkip = () => {
    // Mark as set today so it doesn't reappear (with empty tasks)
    setTasks(['', '', ''])
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} title="🎯 Top 3 del día" size="sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          ¿Cuáles son las 3 cosas más importantes que tienes que hacer hoy?
        </p>

        <div className="flex flex-col gap-3">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <input
                value={tasks[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && i === 2) handleSave() }}
                placeholder={`Tarea ${i + 1}...`}
                autoFocus={i === 0}
                className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-accent/50 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="secondary" onClick={handleSkip}>Ahora no</Button>
          <Button onClick={handleSave} disabled={!tasks.some((t) => t.trim())}>
            Empezar el día
          </Button>
        </div>
      </div>
    </Modal>
  )
}
