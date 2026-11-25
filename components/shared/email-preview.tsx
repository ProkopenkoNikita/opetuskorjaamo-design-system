import { Mail } from 'lucide-react'
import { CATEGORIES } from '@/lib/data'
import { fillTemplate, reviewPeriodLabel } from '@/lib/format'
import type { ServiceRequest, Settings } from '@/lib/types'
import { cn } from '@/lib/utils'

type Template = { subject: string; body: string }

export function EmailPreview({
  kind,
  template,
  request,
  settings,
  className,
}: {
  kind: 'confirmation' | 'rejection'
  template: Template
  request: Partial<ServiceRequest>
  settings: Settings
  className?: string
}) {
  const review = reviewPeriodLabel(settings)
  const summary =
    request.description && request.description.length > 180
      ? `${request.description.slice(0, 180).trimEnd()}…`
      : request.description

  return (
    <article
      aria-label={kind === 'confirmation' ? 'Esimerkki vahvistusviestistä' : 'Esimerkki hylkäysviestistä'}
      className={cn('overflow-hidden rounded-xl border bg-card text-sm shadow-xs', className)}
    >
      <header className="flex flex-col gap-1 border-b bg-muted/60 px-5 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="size-3.5" aria-hidden="true" />
          Lähettäjä: Opetuskorjaamo · {settings.org.contactEmail || '[Vahvistettava: lähettäjän osoite]'}
        </p>
        <p className="text-xs text-muted-foreground">Vastaanottaja: {request.email || 'asiakas@example.fi'}</p>
        <p className="mt-1 font-semibold text-foreground">{fillTemplate(template.subject, request, settings)}</p>
      </header>
      <div className="flex flex-col gap-4 px-5 py-5">
        <p className="whitespace-pre-line leading-relaxed text-foreground/85">
          {fillTemplate(template.body, request, settings)}
        </p>
        {kind === 'confirmation' && (
          <>
            <dl className="grid gap-3 rounded-lg border bg-background p-4 sm:grid-cols-[10rem_1fr]">
              <dt className="text-xs font-medium text-muted-foreground">Hakemusnumero</dt>
              <dd className="font-mono font-semibold">{request.number || 'OK-2026-0000'}</dd>
              <dt className="text-xs font-medium text-muted-foreground">Työn luokka</dt>
              <dd className="font-medium">{request.category ? CATEGORIES[request.category].label : '—'}</dd>
              <dt className="text-xs font-medium text-muted-foreground">Rekisterinumero</dt>
              <dd className="font-mono">{request.registration || 'ABC-123'}</dd>
              <dt className="text-xs font-medium text-muted-foreground">Työn kuvaus</dt>
              <dd className="text-foreground/85">{summary || 'Asiakkaan kuvaus vika- tai korjaustarpeesta.'}</dd>
              <dt className="text-xs font-medium text-muted-foreground">Käsittelyaika</dt>
              <dd>{review ?? '[Vahvistettava: käsittelyaika]'}</dd>
            </dl>
            <p className="rounded-md bg-warning-soft px-3 py-2 font-medium text-warning-foreground">
              Hakemus ei tarkoita, että ajoneuvo on otettu työhön. Älä tuo ajoneuvoa ennen kuin opettaja on sopinut
              siitä kanssasi.
            </p>
          </>
        )}
      </div>
    </article>
  )
}
