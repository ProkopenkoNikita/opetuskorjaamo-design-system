'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { useStore } from '@/lib/store'

function FooterValue({ label, value }: { label: string; value: string }) {
  return value ? (
    <span>{value}</span>
  ) : (
    <span className="rounded border border-dashed border-warning/70 px-1.5 py-0.5 text-sm text-warning">
      Vahvistettava: {label}
    </span>
  )
}

export function SiteFooter() {
  const { settings } = useStore()
  const { org } = settings
  return (
    <footer className="mt-auto bg-graphite text-graphite-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div className="flex flex-col gap-4">
          <Logo inverted />
          <p className="max-w-sm text-sm leading-relaxed text-graphite-foreground/75">
            Opetuskorjaamossa ajoneuvojen huolto- ja korjaustyöt tehdään opiskelijoiden harjoitustöinä
            opettajien ohjauksessa.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <h2 className="font-sans text-sm font-semibold">Yhteystiedot</h2>
          <dl className="flex flex-col gap-2 text-graphite-foreground/85">
            <div>
              <dt className="sr-only">Osoite</dt>
              <dd>
                <FooterValue label="osoite" value={org.address} />
              </dd>
            </div>
            <div>
              <dt className="sr-only">Sähköposti</dt>
              <dd>
                <FooterValue label="sähköposti" value={org.contactEmail} />
              </dd>
            </div>
            <div>
              <dt className="sr-only">Puhelin</dt>
              <dd>
                <FooterValue label="puhelin" value={org.contactPhone} />
              </dd>
            </div>
          </dl>
        </div>
        <nav aria-label="Alatunniste" className="flex flex-col gap-3 text-sm">
          <h2 className="font-sans text-sm font-semibold">Palvelu</h2>
          <ul className="flex flex-col gap-2">
            {[
              { href: '/palveluehdot', label: 'Palveluehdot' },
              { href: '/hakemus', label: 'Tarjoa työtä' },
              { href: '/opettaja', label: 'Opettajan näkymä' },
              { href: '/design-system', label: 'Design system' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-2 text-graphite-foreground/85 hover:text-graphite-foreground hover:underline"
                >
                  <ArrowRight className="size-3.5 text-warning" aria-hidden="true" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-graphite-foreground/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-graphite-foreground/60 md:px-6">
          Opetuskorjaamo on osa ammatillista koulutusta. Hakemuksen lähettäminen ei takaa työn
          vastaanottamista.
        </p>
      </div>
    </footer>
  )
}
