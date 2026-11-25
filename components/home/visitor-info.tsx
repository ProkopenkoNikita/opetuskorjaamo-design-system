'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarClock, CarFront, CreditCard, KeyRound, MapPin, ParkingSquare } from 'lucide-react'
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/data'
import { useStore } from '@/lib/store'
import { CATEGORY_ICONS } from '@/components/shared/badges'
import { Pending } from '@/components/shared/pending'
import { cn } from '@/lib/utils'

export function CategoryAvailability() {
  const { availableCategories } = useStore()
  return (
    <section aria-labelledby="cat-title" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <h2 id="cat-title" className="font-heading text-2xl font-bold tracking-tight">
          Millaisia töitä otamme vastaan
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Työtyypin valinta ohjaa hakemuksen oikealle opettajaryhmälle. Tilanne vaihtelee opetusjaksojen mukaan.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {CATEGORY_ORDER.map((c) => {
            const Icon = CATEGORY_ICONS[c]
            const available = availableCategories.includes(c)
            return (
              <li
                key={c}
                className={cn(
                  'flex flex-col gap-3 rounded-xl border bg-card p-5',
                  !available && 'border-dashed bg-muted/60',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      'flex size-11 items-center justify-center rounded-lg',
                      available ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                      available
                        ? 'bg-success-soft text-success ring-success/30'
                        : 'bg-card text-muted-foreground ring-border',
                    )}
                  >
                    {available ? 'Otetaan vastaan' : 'Ei juuri nyt'}
                  </span>
                </div>
                <div>
                  <h3 className="font-sans text-base font-semibold">{CATEGORIES[c].label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{CATEGORIES[c].description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function VisitorInfo() {
  const { settings } = useStore()
  const { org } = settings
  const items = [
    { icon: MapPin, label: 'Osoite', value: org.address },
    { icon: CalendarClock, label: 'Aukioloajat', value: org.openingHours },
    { icon: ParkingSquare, label: 'Pysäköinti', value: org.parking },
    { icon: KeyRound, label: 'Ajoneuvon luovutus', value: org.handover },
    { icon: CarFront, label: 'Ajoneuvon nouto', value: org.pickup },
    { icon: CreditCard, label: 'Maksutavat', value: org.payment },
  ]
  return (
    <section aria-labelledby="visit-title" className="border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_1.3fr] md:px-6">
        <div className="flex flex-col gap-5">
          <h2 id="visit-title" className="font-heading text-2xl font-bold tracking-tight">
            Käytännön tiedot
          </h2>
          <p className="text-muted-foreground">
            Ajoneuvon luovutuksesta ja noudosta sovitaan aina erikseen opettajan kanssa, kun työ on hyväksytty.
          </p>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
            <Image
              src="/images/opiskelija-tyossa.jpg"
              alt="Opiskelija käyttää momenttiavainta auton pyörän parissa opettajan ohjauksessa."
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <Link
            href="/palveluehdot"
            className="inline-flex items-center gap-2 self-start font-semibold text-primary underline-offset-4 hover:underline"
          >
            Lue koko palveluehdot
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <dl className="grid content-start gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col gap-2 bg-card p-5">
              <dt className="flex items-center gap-2 text-sm font-semibold">
                <item.icon className="size-4 text-primary" aria-hidden="true" />
                {item.label}
              </dt>
              <dd className="text-sm text-foreground/85">
                <Pending label={item.label.toLowerCase()} value={item.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
