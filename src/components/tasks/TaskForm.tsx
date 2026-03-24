import { useState } from 'react'
import { Modal } from '@components/ui/Modal'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { Slider } from '@components/ui/Slider'
import type { Task, CreateTaskInput, Project } from '@/types'
import { ACCENT_COLORS } from '@config/constants'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateTaskInput) => Promise<void>
  initialData?: Task
  projects: Project[]
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function TaskForm({ isOpen, onClose, onSubmit, initialData, projects }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [estimated, setEstimated] = useState(initialData?.estimatedPomodoros ?? 1)
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [tagColors, setTagColors] = useState<Record<string, string>>(initialData?.tagColors ?? {})
  const [projectId, setProjectId] = useState<string | null>(initialData?.projectId ?? null)
  const [dueDate, setDueDate] = useState(toDateString(initialData?.dueDate))
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 5) {
      const color = ACCENT_COLORS[tags.length % ACCENT_COLORS.length].value
      setTags([...tags, t])
      setTagColors({ ...tagColors, [t]: color })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
    const c = { ...tagColors }
    delete c[tag]
    setTagColors(c)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        notes,
        estimatedPomodoros: estimated,
        tags,
        tagColors,
        projectId,
        dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : null,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="What are you working on?" />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            rows={3}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none transition-all"
          />
        </div>

        <Slider label="Estimated pomodoros" value={estimated} min={1} max={20} onChange={setEstimated} />

        {/* Project selector */}
        {projects.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Project</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProjectId(null)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  !projectId
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                None
              </button>
              {projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProjectId(p.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    projectId === p.id ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                  style={{
                    borderColor: p.color,
                    backgroundColor: projectId === p.id ? p.color : 'transparent',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Due date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tags</label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag..."
              className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}>Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: (tagColors[tag] ?? '#ef4444') + '22', color: tagColors[tag] ?? '#ef4444' }}
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{initialData ? 'Save' : 'Create Task'}</Button>
        </div>
      </form>
    </Modal>
  )
}
