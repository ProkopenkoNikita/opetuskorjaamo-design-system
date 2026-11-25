import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tone = 'info' | 'success' | 'warning' | 'error'

const TONES: Record<Tone, { box: string; icon: typeof Info; iconClass: string }> = {
  info: { box: 'bg-info-soft border-primary/20', icon: Info, iconClass: 'text-primary' },
  success: { box: 'bg-success-soft border-success/30', icon: CheckCircle2, iconClass: 'text-success' },
  warning: { box: 'bg-warning-soft border-warning/50', icon: AlertTriangle, iconClass: 'text-warning-foreground' },
  error: { box: 'bg-destructive-soft border-destructive/30', icon: OctagonAlert, iconClass: 'text-destructive' },
}

export function Notice({
  tone = 'info',
  title,
  children,
  className,
  action,
  role,
}: {
  tone?: Tone
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
  action?: React.ReactNode
  role?: 'alert' | 'status'
}) {
  const { box, icon: Icon, iconClass } = TONES[tone]
  return (
    <div role={role} className={cn('flex gap-3 rounded-lg border p-4 text-sm', box, className)}>
      <Icon className={cn('mt-0.5 size-5 shrink-0', iconClass)} aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="font-semibold text-foreground">{title}</p>}
        {children && <div className="leading-relaxed text-foreground/85">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  )
}
