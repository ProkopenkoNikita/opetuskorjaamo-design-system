'use client'

import { AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
      {children}
      {required ? (
        <span className="text-xs font-medium text-destructive">
          <span aria-hidden="true">*</span> Pakollinen
        </span>
      ) : (
        <span className="text-xs font-normal text-muted-foreground">Valinnainen</span>
      )}
    </label>
  )
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}

const controlBase =
  'w-full rounded-md border bg-card px-3 text-base text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/80 hover:border-foreground/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70'

interface BaseFieldProps {
  id: string
  label: string
  required?: boolean
  hint?: React.ReactNode
  error?: string
  className?: string
}

export function TextField({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...input
}: BaseFieldProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'required'>) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <input
        id={id}
        name={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={cn(
          controlBase,
          'h-11',
          error ? 'border-destructive ring-3 ring-destructive/15' : 'border-input',
        )}
        {...input}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  )
}

export function TextAreaField({
  id,
  label,
  required,
  hint,
  error,
  className,
  maxLength,
  value,
  ...rest
}: BaseFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'required'> & { value: string }) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {hint && (
        <div id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </div>
      )}
      <textarea
        id={id}
        name={id}
        value={value}
        maxLength={maxLength}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={cn(
          controlBase,
          'min-h-40 resize-y py-2.5 leading-relaxed',
          error ? 'border-destructive ring-3 ring-destructive/15' : 'border-input',
        )}
        {...rest}
      />
      <div className="flex items-start justify-between gap-4">
        <FieldError id={`${id}-error`}>{error}</FieldError>
        {maxLength && (
          <p className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

export function CheckboxField({
  id,
  checked,
  onChange,
  children,
  description,
  error,
  className,
  disabled,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
  description?: React.ReactNode
  error?: string
  className?: string
  disabled?: boolean
}) {
  const errorId = error ? `${id}-error` : undefined
  const descId = description ? `${id}-desc` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          'group flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:border-primary/50 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/30',
          checked ? 'border-primary bg-info-soft' : error ? 'border-destructive' : 'border-input',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error ? true : undefined}
            aria-describedby={[descId, errorId].filter(Boolean).join(' ') || undefined}
            className="peer size-5 cursor-pointer appearance-none rounded border-2 border-input bg-card transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none group-hover:border-primary/60 disabled:cursor-not-allowed"
          />
          <Check
            className="pointer-events-none absolute size-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-snug text-foreground">{children}</span>
          {description && (
            <span id={descId} className="text-sm text-muted-foreground">
              {description}
            </span>
          )}
        </span>
      </label>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  )
}
