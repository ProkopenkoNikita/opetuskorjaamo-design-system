'use client'

import Link from 'next/link'
import { CheckCircle2, Mail } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CategoryBadge } from '@/components/shared/badges'
import { Pending } from '@/components/shared/pending'
import { useStore } from '@/lib/store'
import { EmailPreview } from '@/components/shared/email-preview'
import { formatDateTime, reviewPeriodLabel } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Steps } from './steps'

export function Confirmation() {
  const { lastSubmitted: r, settings } = useStore()

  if (!r) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Ei lähetettyä hakemusta</h1>
        <p className="text-muted-foreground">Tällä istunnolla ei ole lähetetty hakemusta.</p>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'xl' }), 'self-start')}>
          Etusivulle
        </Link>
      </div>
    )
  }

  const review = reviewPeriodLabel(settings)

  return (
    <div className="flex flex-col gap-8">
      <Steps current={2} />
      <header className="flex flex-col items-start gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl" tabIndex={-1}>
          Hakemus lähetetty onnistuneesti
        </h1>
        <p className="text-lg text-foreground/85">
          Kiitos, {r.name.split(' ')[0]}. Lähetimme vahvistuksen osoitteeseen <strong>{r.email}</strong>. Opettaja
          ottaa sinuun yhteyttä sähköpostitse.
        </p>
        <p className="text-sm text-muted-foreground">
          Hakemus on vastaanotettu – ajoneuvoa ei ole vielä otettu työhön.
        </p>
      </header>

      <dl className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
        <div className="bg-card p-5">
          <dt className="text-xs font-medium text-muted-foreground">Hakemusnumero</dt>
          <dd className="mt-1 font-mono text-lg font-semibold">{r.number}</dd>
        </div>
        <div className="bg-card p-5">
          <dt className="text-xs font-medium text-muted-foreground">Ajoneuvo</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <span className="font-mono font-semibold tracking-wider">{r.registration}</span>
            <CategoryBadge category={r.category} />
          </dd>
        </div>
        <div className="bg-card p-5">
          <dt className="text-xs font-medium text-muted-foreground">Lähetetty</dt>
          <dd className="mt-1 font-medium">{formatDateTime(r.createdAt)}</dd>
        </div>
      </dl>

      <section aria-labelledby="next-title" className="rounded-xl border bg-card p-5 md:p-7">
        <h2 id="next-title" className="font-sans text-lg font-semibold">
          Mitä seuraavaksi tapahtuu
        </h2>
        <ol className="mt-4 flex flex-col gap-4">
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">1</span>
            <p>Opettaja arvioi, sopiiko työ opiskelijaryhmän opetukseen.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">2</span>
            <p>
              Saat vastauksen sähköpostitse, tavoitteena{' '}
              <Pending label="käsittelyaika" value={review} />.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">3</span>
            <p>Jos työ hyväksytään, sovimme ajoneuvon luovutuksesta erikseen. Älä tuo autoa ennen sitä.</p>
          </li>
        </ol>
        <p className="mt-5 rounded-lg border-l-4 border-primary bg-info-soft px-4 py-3 text-sm leading-relaxed">
          Jos et saa hyväksyntää käsittelyajan kuluessa, työ ei tällä kertaa sovi nykyisille
          opiskelijaryhmille. Tämä ei kerro ajoneuvosi kunnosta – opetusjaksot vain rajaavat, millaisia töitä voimme
          ottaa vastaan.
        </p>
      </section>

      <details className="group rounded-xl border bg-muted/50 p-5">
        <summary className="flex cursor-pointer items-center gap-2 font-medium">
          <Mail className="size-4 text-primary" aria-hidden="true" />
          Näytä sähköpostiin lähetetty vahvistus
        </summary>
        <EmailPreview
          kind="confirmation"
          template={settings.confirmationEmail}
          request={r}
          settings={settings}
          className="mt-4"
        />
      </details>

      <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'xl' }), 'self-start')}>
        Palaa etusivulle
      </Link>
    </div>
  )
}
