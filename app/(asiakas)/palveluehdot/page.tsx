import type { Metadata } from 'next'
import { Steps } from '@/components/form/steps'
import { ConsentPanel } from '@/components/terms/consent-panel'
import { TermsContent } from '@/components/terms/terms-content'

export const metadata: Metadata = {
  title: 'Palveluehdot',
  description: 'Lue opetuskorjaamon palveluehdot ennen hakemuksen täyttämistä.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <Steps current={0} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <TermsContent />
        <div className="lg:sticky lg:top-24">
          <ConsentPanel />
        </div>
      </div>
    </div>
  )
}
