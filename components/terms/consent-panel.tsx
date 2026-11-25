'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import { Button, buttonVariants } from '@/components/ui/button'
import { CheckboxField } from '@/components/form/fields'
import { useAvailability } from '@/components/site/availability-status'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ConsentPanel() {
  const router = useRouter()
  const { consent, setConsentAccepted, settings } = useStore()
  const availability = useAvailability()
  const [error, setError] = useState<string>()

  if (availability === 'closed') {
    return (
      <aside className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive-soft p-5">
        <p className="font-semibold">Hakemusten vastaanotto on keskeytetty</p>
        <p className="text-sm text-foreground/85">
          Voit lukea palveluehdot, mutta uutta hakemusta ei voi tällä hetkellä lähettää.
        </p>
        <Link href="/suljettu" className={cn(buttonVariants({ variant: 'outline', size: 'xl' }), 'w-full')}>
          Lue lisää
        </Link>
      </aside>
    )
  }

  const onContinue = () => {
    if (!consent.accepted) {
      setError('Hyväksy palveluehdot valitsemalla ruutu. Hakemukseen ei voi siirtyä ilman hyväksyntää.')
      document.getElementById('consent')?.focus()
      return
    }
    router.push('/hakemus')
  }

  return (
    <aside aria-labelledby="consent-title" className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div>
        <h2 id="consent-title" className="font-sans text-base font-semibold">
          Palveluehtojen hyväksyminen
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ehdoista näet, miten opetuskorjaamo toimii ja mitä hakemuksen lähettäminen tarkoittaa.
        </p>
      </div>
      <CheckboxField
        id="consent"
        checked={consent.accepted}
        onChange={(v) => {
          setConsentAccepted(v)
          if (v) setError(undefined)
        }}
        error={error}
        description="Hyväksyntäsi ja sen ajankohta tallennetaan hakemuksen yhteyteen."
      >
        Olen tutustunut palveluehtoihin ja hyväksyn ne.
      </CheckboxField>
      {consent.accepted && consent.at && (
        <p role="status" className="flex items-center gap-2 text-sm font-medium text-success">
          <CircleCheck className="size-4" aria-hidden="true" />
          Hyväksytty {formatDateTime(consent.at)} · versio {settings.termsVersion}
        </p>
      )}
      <Button size="xl" className="w-full" onClick={onContinue}>
        Jatka hakemukseen
        <ArrowRight aria-hidden="true" />
      </Button>
    </aside>
  )
}
