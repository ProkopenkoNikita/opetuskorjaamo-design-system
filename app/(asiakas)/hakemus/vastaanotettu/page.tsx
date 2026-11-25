import type { Metadata } from 'next'
import { Confirmation } from '@/components/form/confirmation'

export const metadata: Metadata = { title: 'Hakemus vastaanotettu' }

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <Confirmation />
    </div>
  )
}
