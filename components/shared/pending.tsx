import { PencilLine } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Shows the organization-provided value, or a clearly marked editable placeholder when it is not yet confirmed. */
export function Pending({
  label,
  value,
  className,
}: {
  label: string
  value?: string | null
  className?: string
}) {
  if (value) return <span className={className}>{value}</span>
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-dashed border-warning bg-warning-soft px-2 py-0.5 text-sm font-medium text-warning-foreground',
        className,
      )}
    >
      <PencilLine className="size-3.5 shrink-0" aria-hidden="true" />
      <span>
        <span className="sr-only">Tieto puuttuu. </span>Vahvistettava: {label}
      </span>
    </span>
  )
}

export function PendingTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-dashed border-warning bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning-foreground',
        className,
      )}
    >
      <PencilLine className="size-3" aria-hidden="true" />
      Vahvistettava
    </span>
  )
}
