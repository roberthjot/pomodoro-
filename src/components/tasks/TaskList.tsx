import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { TaskItem } from './TaskItem'
import type { Task, Project } from '@/types'

interface Props {
  tasks: Task[]
  activeTask: Task | undefined
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onSetActive: (id: string | null) => Promise<void>
  onReorder: (sourceIndex: number, destinationIndex: number) => Promise<void>
  projects: Project[]
}

export function TaskList({ tasks, activeTask, onUpdate, onDelete, onSetActive, onReorder, projects }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      await onReorder(oldIndex, newIndex)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={activeTask?.id === task.id}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onSetActive={onSetActive}
              projects={projects}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
