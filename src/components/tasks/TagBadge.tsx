import { Badge } from '@components/ui/Badge'

interface Props {
  tag: string
  color?: string
  onRemove?: () => void
}

export function TagBadge({ tag, color, onRemove }: Props) {
  return (
    <Badge color={color} className="gap-1">
      {tag}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70">×</button>
      )}
    </Badge>
  )
}
