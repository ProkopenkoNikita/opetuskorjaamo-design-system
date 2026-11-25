'use client'

import { CATEGORIES, CATEGORY_ORDER } from '@/lib/data'
import type { Category } from '@/lib/types'
import { CATEGORY_ICONS } from '@/components/shared/badges'
import { FieldError } from './fields'
import { cn } from '@/lib/utils'

export function CategoryPicker({
  value,
  onChange,
  available,
  error,
}: {
  value: Category | ''
  onChange: (c: Category) => void
  available: Category[]
  error?: string
}) {
  return (
    <fieldset
      id="category"
      tabIndex={-1}
      aria-describedby={error ? 'category-error' : 'category-hint'}
      aria-invalid={error ? true : undefined}
      className="flex flex-col gap-1.5 outline-none"
    >
      <legend className="mb-1.5 flex flex-wrap items-center gap-2 text-sm font-semibold">
        Työtyyppi
        <span className="text-xs font-medium text-destructive">
          <span aria-hidden="true">*</span> Pakollinen
        </span>
      </legend>
      <p id="category-hint" className="text-sm text-muted-foreground">
        Valinta ohjaa hakemuksen oikealle opettajaryhmälle.
      </p>
      <div className="mt-1 grid gap-3 sm:grid-cols-3">
        {CATEGORY_ORDER.map((c) => {
          const Icon = CATEGORY_ICONS[c]
          const disabled = !available.includes(c)
          const checked = value === c
          return (
            <label
              key={c}
              className={cn(
                'relative flex cursor-pointer flex-col gap-2 rounded-lg border-2 bg-card p-4 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
                checked ? 'border-primary bg-info-soft' : 'border-input hover:border-primary/50',
                error && !checked && 'border-destructive/60',
                disabled && 'cursor-not-allowed border-dashed bg-muted opacity-70 hover:border-input',
              )}
            >
              <input
                type="radio"
                name="category"
                value={c}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(c)}
                className="sr-only"
                aria-describedby={`cat-${c}-desc`}
              />
              <span className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-md',
                    checked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
                    disabled && 'bg-card text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full border-2',
                    checked ? 'border-primary' : 'border-input',
                  )}
                  aria-hidden="true"
                >
                  {checked && <span className="size-2.5 rounded-full bg-primary" />}
                </span>
              </span>
              <span className="font-semibold">{CATEGORIES[c].label}</span>
              <span id={`cat-${c}-desc`} className="text-sm leading-snug text-muted-foreground">
                {disabled ? 'Ei oteta vastaan juuri nyt.' : CATEGORIES[c].description}
              </span>
            </label>
          )
        })}
      </div>
      <FieldError id="category-error">{error}</FieldError>
    </fieldset>
  )
}
