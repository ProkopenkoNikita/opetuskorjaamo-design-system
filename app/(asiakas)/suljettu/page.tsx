import type { Metadata } from 'next'
import { ClosedView } from '@/components/site/closed-view'

export const metadata: Metadata = { title: 'Hakemusten vastaanotto' }

export default function ClosedPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <ClosedView />
    </div>
  )
}
