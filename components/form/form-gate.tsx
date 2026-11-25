'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Notice } from '@/components/shared/notice'
import { AvailabilityDetails, useAvailability } from '@/components/site/availability-status'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ApplicationForm } from './application-form'
import { Steps } from './steps'

export function FormGate() {
  const { consent } = useStore()
  const availability = useAvailability()

  if (availability === 'closed') {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Hakemuksia ei oteta vastaan</h1>
        <AvailabilityDetails />
        <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'xl' }), 'self-start')}>
          Etusivulle
        </Link>
      </div>
    )
  }

  if (!consent.accepted) {
    return (
      <div className="flex flex-col gap-6">
        <Steps current={0} />
        <h1 className="font-heading text-3xl font-bold tracking-tight">Hyväksy ensin palveluehdot</h1>
        <Notice tone="info">
          Hakemuksen voi täyttää vasta, kun olet lukenut ja hyväksynyt palveluehdot. Ehdoissa kerrotaan, miten
          opetuskorjaamo toimii.
        </Notice>
        <Link href="/palveluehdot" className={cn(buttonVariants({ size: 'xl' }), 'self-start')}>
          Lue palveluehdot
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Steps current={1} />
      <header className="flex flex-col gap-3">
        <h1 id="form-title" className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Hakemus opetustyöksi
        </h1>
        <p className="text-pretty text-muted-foreground">
          Pakolliset kentät on merkitty. Hakemuksen lähettäminen ei vielä varaa aikaa – opettaja ottaa
          yhteyttä, jos työ sopii opetukseen.
        </p>
        <AvailabilityDetails />
      </header>
      <ApplicationForm />
    </div>
  )
}
