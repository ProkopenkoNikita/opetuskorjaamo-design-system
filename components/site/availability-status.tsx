'use client'

import { CircleCheck, CirclePause, CircleSlash } from 'lucide-react'
import { CATEGORIES, CLOSURE_REASONS } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Pending } from '@/components/shared/pending'

export type Availability = 'open' | 'partial' | 'closed'

export function useAvailability(): Availability {
  const { settings } = useStore()
  if (!settings.intakeOpen) return 'closed'
  if (settings.disabledCategories.length > 0) return 'partial'
  return 'open'
}

/** Compact pill used in the hero and header areas. */
export function AvailabilityPill({ className }: { className?: string }) {
  const availability = useAvailability()
  const { settings } = useStore()
  const config = {
    open: { icon: CircleCheck, text: 'Hakemusten vastaanotto on avoinna', tone: 'bg-success-soft text-success ring-success/30' },
    partial: { icon: CircleSlash, text: 'Vastaanotto avoinna – osa töistä ei tällä hetkellä käy', tone: 'bg-warning-soft text-warning-foreground ring-warning/50' },
    closed: {
      icon: CirclePause,
      text: `Vastaanotto keskeytetty${settings.closureReason ? ` – ${CLOSURE_REASONS[settings.closureReason].toLowerCase()}` : ''}`,
      tone: 'bg-destructive-soft text-destructive ring-destructive/25',
    },
  }[availability]
  const Icon = config.icon
  return (
    <p
      role="status"
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset',
        config.tone,
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {config.text}
    </p>
  )
}

/** Detailed status block explaining restrictions, reason and next intake period. */
export function AvailabilityDetails({ className }: { className?: string }) {
  const availability = useAvailability()
  const { settings } = useStore()

  if (availability === 'open') return null

  if (availability === 'partial') {
    return (
      <div className={cn('rounded-lg border border-warning/50 bg-warning-soft p-4 text-sm', className)}>
        <p className="font-semibold text-foreground">Osa työtyypeistä ei ole tällä hetkellä haettavissa</p>
        <p className="mt-1 text-foreground/85">
          Emme ota tällä hetkellä vastaan hakemuksia seuraaviin työtyyppeihin:{' '}
          <strong>{settings.disabledCategories.map((c) => CATEGORIES[c].label).join(', ')}</strong>. Muihin
          työtyyppeihin voit jättää hakemuksen normaalisti.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-destructive/30 bg-destructive-soft p-4 text-sm', className)}>
      <p className="font-semibold text-foreground">Uusia hakemuksia ei oteta tällä hetkellä vastaan</p>
      {settings.closureMessage && <p className="mt-1 text-foreground/85">{settings.closureMessage}</p>}
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Syy</dt>
          <dd className="font-medium">
            {settings.closureReason ? CLOSURE_REASONS[settings.closureReason] : <Pending label="syy" />}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Seuraava hakuaika</dt>
          <dd className="font-medium">
            <Pending label="seuraava hakuaika" value={settings.nextIntakePeriod} />
          </dd>
        </div>
      </dl>
    </div>
  )
}
