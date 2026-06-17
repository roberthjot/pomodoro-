import { CheckSquare } from 'lucide-react'
import { Button } from '@components/ui/Button'

export function EmptyTaskState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <CheckSquare size={28} className="text-neutral-400" />
      </div>
      <div>
        <p className="font-medium text-neutral-700 dark:text-neutral-300">Aún no hay tareas</p>
        <p className="text-sm text-neutral-400 mt-1">Agrega una tarea para registrar tus pomodoros</p>
      </div>
      <Button onClick={onAdd} size="sm">Agrega tu primera tarea</Button>
    </div>
  )
}
