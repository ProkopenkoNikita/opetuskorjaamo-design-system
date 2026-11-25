'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AvailabilityDetails, AvailabilityPill, useAvailability } from '@/components/site/availability-status'
import { cn } from '@/lib/utils'

export function Hero() {
  const availability = useAvailability()
  const closed = availability === 'closed'

  return (
    <section aria-labelledby="hero-title" className="border-b bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-12 md:px-6 md:py-20">
        <div className="flex flex-col items-start gap-6">
          <AvailabilityPill />
          <h1
            id="hero-title"
            className="text-balance font-heading text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
          >
            Tarjoa autosi opetustyöksi
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Opetuskorjaamossa ajoneuvojen huolto- ja korjaustyöt tehdään opiskelijoiden harjoitustöinä
            opettajien ohjauksessa. Lähetä hakemus, niin opettajat arvioivat, sopiiko työ opiskelijaryhmien
            opetukseen.
          </p>

          <AvailabilityDetails className="w-full max-w-xl" />

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {closed ? (
              <Link href="/suljettu" className={cn(buttonVariants({ size: 'xl' }), 'w-full sm:w-auto')}>
                Miksi hakemuksia ei oteta vastaan?
                <ArrowRight aria-hidden="true" />
              </Link>
            ) : (
              <Link href="/palveluehdot" className={cn(buttonVariants({ size: 'xl' }), 'w-full sm:w-auto')}>
                Aloita hakemus
                <ArrowRight aria-hidden="true" />
              </Link>
            )}
            <Link
              href="#tietoa"
              className={cn(buttonVariants({ variant: 'outline', size: 'xl' }), 'w-full sm:w-auto')}
            >
              Miten palvelu toimii
            </Link>
          </div>
          {!closed && (
            <p className="text-sm text-muted-foreground">
              Hakemus alkaa palveluehtojen lukemisella. Täyttäminen vie noin 5 minuuttia.
            </p>
          )}
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/images/opetuskorjaamo-hero.jpg"
              alt="Opiskelija tekee jarrutöitä nostimella olevaan autoon opetuskorjaamon hallissa."
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-xl border bg-card p-4 shadow-md sm:left-auto sm:right-6 sm:max-w-xs">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm leading-snug">
              <span className="font-semibold">Opetus on aina etusijalla.</span>{' '}
              <span className="text-muted-foreground">Emme tee kiireellisiä korjauksia.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
