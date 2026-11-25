import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { CategoryAvailability, VisitorInfo } from '@/components/home/visitor-info'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CategoryAvailability />
      <VisitorInfo />
    </>
  )
}
