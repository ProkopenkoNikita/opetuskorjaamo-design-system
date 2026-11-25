import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Palveluehdot', 'Hakemus', 'Vahvistus']

export function Steps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <nav aria-label="Hakemuksen vaiheet">
      <ol className="flex items-center gap-2 text-sm">
        {STEPS.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 font-medium',
                  active ? 'text-foreground' : done ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                    active && 'bg-primary text-primary-foreground',
                    done && 'bg-secondary text-primary',
                    !active && !done && 'border bg-card',
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className={cn(!active && 'hidden sm:inline')}>
                  {label}
                  {done && <span className="sr-only"> (valmis)</span>}
                </span>
              </span>
              {i < STEPS.length - 1 && <span className="h-px w-6 bg-border sm:w-10" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
