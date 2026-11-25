'use client'

import Link from 'next/link'
import { ArrowRight, CirclePause } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AvailabilityDetails, useAvailability } from './availability-status'
import { Pending } from '@/components/shared/pending'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ClosedView() {
  const availability = useAvailability()
  const { settings } = useStore()

  if (availability !== 'closed') {
    return (
      <div className="flex flex-col items-start gap-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Hakemusten vastaanotto on avoinna</h1>
        <p className="text-muted-foreground">Voit jättää hakemuksen normaalisti.</p>
        <Link href="/palveluehdot" className={buttonVariants({ size: 'xl' })}>
          Aloita hakemus
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive-soft text-destructive">
        <CirclePause className="size-7" aria-hidden="true" />
      </span>
      <h1 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">
        Hakemusten vastaanotto on tilapäisesti keskeytetty
      </h1>
      <AvailabilityDetails className="w-full" />
      <p className="text-foreground/85">
        Jo lähetetyt hakemukset käsitellään normaalisti. Tarkista tilanne tältä sivulta myöhemmin uudelleen.
      </p>
      <section aria-labelledby="contact-title" className="w-full rounded-xl border bg-card p-5">
        <h2 id="contact-title" className="font-sans text-base font-semibold">
          Yhteystiedot
        </h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted-foreground">Sähköposti</dt>
          <dd>
            <Pending label="sähköposti" value={settings.org.contactEmail || null} />
          </dd>
          <dt className="text-muted-foreground">Puhelin</dt>
          <dd>
            <Pending label="puhelinnumero" value={settings.org.contactPhone || null} />
          </dd>
          <dt className="text-muted-foreground">Osoite</dt>
          <dd>
            <Pending label="osoite" value={settings.org.address || null} />
          </dd>
        </dl>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}>
          Etusivulle
        </Link>
        <Link href="/palveluehdot" className={cn(buttonVariants({ variant: 'ghost', size: 'xl' }))}>
          Lue palveluehdot
        </Link>
      </div>
    </div>
  )
}
