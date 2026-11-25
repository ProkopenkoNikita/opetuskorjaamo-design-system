import { Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ inverted = false, subtitle = 'Salon seudun ammattiopisto' }: { inverted?: boolean; subtitle?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          'flex size-9 items-center justify-center rounded-lg',
          inverted ? 'bg-graphite-foreground text-graphite' : 'bg-primary text-primary-foreground',
        )}
        aria-hidden="true"
      >
        <Wrench className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-lg font-bold tracking-tight',
            inverted ? 'text-graphite-foreground' : 'text-foreground',
          )}
        >
          Opetuskorjaamo
        </span>
        <span
          className={cn(
            'mt-1 text-[0.7rem] font-medium uppercase tracking-wider',
            inverted ? 'text-graphite-foreground/70' : 'text-muted-foreground',
          )}
        >
          {subtitle}
        </span>
      </span>
    </span>
  )
}
