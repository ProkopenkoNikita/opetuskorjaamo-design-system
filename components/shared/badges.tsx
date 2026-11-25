import { Archive, Car, CheckCircle2, CircleDot, Clock3, Hammer, Truck, XCircle } from 'lucide-react'
import { CATEGORIES, STATUSES } from '@/lib/data'
import type { Category, RequestStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<RequestStatus, { className: string; icon: typeof CircleDot }> = {
  uusi: { className: 'bg-info-soft text-secondary-foreground ring-primary/25', icon: CircleDot },
  kasittelyssa: { className: 'bg-warning-soft text-warning-foreground ring-warning/40', icon: Clock3 },
  hyvaksytty: { className: 'bg-success-soft text-success ring-success/30', icon: CheckCircle2 },
  hylatty: { className: 'bg-destructive-soft text-destructive ring-destructive/25', icon: XCircle },
  arkistoitu: { className: 'bg-muted text-muted-foreground ring-border', icon: Archive },
}

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const { className: tone, icon: Icon } = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        tone,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {STATUSES[status].label}
    </span>
  )
}

export const CATEGORY_ICONS: Record<Category, typeof Car> = {
  kevyt: Car,
  raskas: Truck,
  kori: Hammer,
}

const CATEGORY_TONES: Record<Category, string> = {
  kevyt: 'bg-secondary text-secondary-foreground',
  raskas: 'bg-graphite text-graphite-foreground',
  kori: 'bg-card text-foreground ring-1 ring-inset ring-foreground/25',
}

export function CategoryBadge({
  category,
  size = 'sm',
  className,
}: {
  category: Category
  size?: 'sm' | 'md'
  className?: string
}) {
  const Icon = CATEGORY_ICONS[category]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-semibold whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        CATEGORY_TONES[category],
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'size-3.5' : 'size-4'} aria-hidden="true" />
      {CATEGORIES[category].label}
    </span>
  )
}
