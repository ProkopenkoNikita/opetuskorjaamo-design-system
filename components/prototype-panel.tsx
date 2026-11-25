'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FlaskConical, X } from 'lucide-react'
import { type IntakePreset, useStore } from '@/lib/store'
import type { ListPreviewState } from '@/lib/types'
import { cn } from '@/lib/utils'

const PRESETS: { id: IntakePreset; label: string }[] = [
  { id: 'open', label: 'Avoinna' },
  { id: 'loma', label: 'Suljettu: loma' },
  { id: 'ruuhka', label: 'Suljettu: ruuhka' },
  { id: 'partial', label: 'Osa töistä ei käy' },
]

const LIST_STATES: { id: ListPreviewState; label: string }[] = [
  { id: 'normal', label: 'Normaali' },
  { id: 'loading', label: 'Lataus' },
  { id: 'empty', label: 'Tyhjä' },
  { id: 'error', label: 'Virhe' },
]

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        active ? 'border-foreground bg-foreground text-background' : 'bg-card hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}

/** Prototype-only controls for previewing states described in the design brief. Not part of the product UI. */
export function PrototypePanel() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const {
    activePreset,
    applyIntakePreset,
    simulateSubmitError,
    setSimulateSubmitError,
    listPreviewState,
    setListPreviewState,
  } = useStore()
  const isAdmin = pathname.startsWith('/opettaja')

  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden">
      {open ? (
        <section
          aria-label="Prototyypin tilat"
          className="w-72 rounded-xl border bg-card p-4 text-sm shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 font-semibold">
              <FlaskConical className="size-4 text-primary" aria-hidden="true" />
              Prototyypin tilat
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 hover:bg-muted"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Sulje</span>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-xs font-medium text-muted-foreground">Hakemusten vastaanotto</legend>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <Chip key={p.id} active={activePreset === p.id} onClick={() => applyIntakePreset(p.id)}>
                    {p.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={simulateSubmitError}
                onChange={(e) => setSimulateSubmitError(e.target.checked)}
              />
              Simuloi lähetysvirhe
            </label>
            {isAdmin && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-xs font-medium text-muted-foreground">Hakemuslistan tila</legend>
                <div className="flex flex-wrap gap-1.5">
                  {LIST_STATES.map((s) => (
                    <Chip key={s.id} active={listPreviewState === s.id} onClick={() => setListPreviewState(s.id)}>
                      {s.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            )}
            <p className="text-xs leading-relaxed text-muted-foreground">
              Vain prototyypissä. Tiedot tallentuvat selaimen muistiin ja nollautuvat sivun latauksessa.
            </p>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-xs font-semibold shadow-md hover:bg-muted"
        >
          <FlaskConical className="size-4 text-primary" aria-hidden="true" />
          Prototyyppi
        </button>
      )}
    </div>
  )
}
