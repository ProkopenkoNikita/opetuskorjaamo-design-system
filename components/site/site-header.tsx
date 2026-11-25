'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/shared/logo'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/#tietoa', label: 'Tietoa korjaamosta' },
  { href: '/palveluehdot', label: 'Palveluehdot' },
  { href: '/hakemus', label: 'Hakemus' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { settings } = useStore()
  const ctaHref = settings.intakeOpen ? '/hakemus' : '/suljettu'

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:h-18 md:px-6">
        <Link href="/" className="rounded-md" aria-label="Opetuskorjaamo – etusivu">
          <Logo />
        </Link>

        <nav aria-label="Päävalikko" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.href === pathname
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  active && 'text-foreground underline decoration-primary decoration-2 underline-offset-8',
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Link href={ctaHref} className={cn(buttonVariants({ size: 'lg' }), 'ml-3 h-10 px-4 font-semibold')}>
            Tarjoa työtä
            <ArrowRight aria-hidden="true" />
          </Link>
        </nav>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-md border md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          <span className="sr-only">{open ? 'Sulje valikko' : 'Avaa valikko'}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Päävalikko" className="border-t bg-card px-4 pb-4 md:hidden">
          <ul className="flex flex-col py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-base font-medium hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ size: 'xl' }), 'w-full')}
          >
            Tarjoa työtä
            <ArrowRight aria-hidden="true" />
          </Link>
        </nav>
      )}
    </header>
  )
}
