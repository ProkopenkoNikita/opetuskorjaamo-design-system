'use client'

import { useStore } from '@/lib/store'
import { formatDate } from '@/lib/format'
import { Pending, PendingTag } from '@/components/shared/pending'

export function TermsContent() {
  const { settings } = useStore()
  const { org } = settings

  const handoverRows = [
    { label: 'Luovutuspaikka', value: org.handover },
    { label: 'Noutopaikka', value: org.pickup },
    { label: 'Luovutus- ja noutoajat', value: org.handoverHours },
    { label: 'Ajan sopiminen', value: org.scheduling },
  ]

  return (
    <article aria-labelledby="terms-title" className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 id="terms-title" className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Palveluehdot
        </h1>
        <p className="text-sm text-muted-foreground">
          Versio {settings.termsVersion} · Päivitetty {formatDate(settings.termsUpdatedAt)}
        </p>
        <p className="text-pretty text-lg leading-relaxed text-foreground/85">{settings.preFormText}</p>
      </header>

      <ol className="flex flex-col divide-y rounded-xl border bg-card">
        {settings.terms.map((section, i) => (
          <li key={section.id} className="flex gap-4 p-5 md:p-6">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary tabular-nums">
              {i + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-sans text-base font-semibold">{section.title}</h2>
                {section.needsConfirmation && <PendingTag />}
              </div>
              <p className="leading-relaxed text-foreground/85">{section.body}</p>
              {section.id === 'luovutus' && (
                <dl className="mt-2 grid gap-3 rounded-lg bg-muted/60 p-4 sm:grid-cols-2">
                  {handoverRows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-1">
                      <dt className="text-xs font-medium text-muted-foreground">{row.label}</dt>
                      <dd className="text-sm">
                        <Pending label={row.label.toLowerCase()} value={row.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
