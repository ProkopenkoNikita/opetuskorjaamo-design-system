import type { Metadata } from 'next'
import { FormGate } from '@/components/form/form-gate'

export const metadata: Metadata = {
  title: 'Hakemus',
  description: 'Tarjoa ajoneuvosi huolto- tai korjaustyö opetuskorjaamon opiskelijoiden harjoitustyöksi.',
}

export default function ApplicationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <FormGate />
    </div>
  )
}
