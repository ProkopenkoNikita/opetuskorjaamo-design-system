import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { StoreProvider } from '@/lib/store'
import { PrototypePanel } from '@/components/prototype-panel'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Opetuskorjaamo – Tarjoa autosi opetustyöksi',
    template: '%s | Opetuskorjaamo',
  },
  description:
    'Opetuskorjaamo ottaa vastaan ajoneuvojen huolto- ja korjaustöitä opiskelijoiden harjoitustöiksi. Työt tehdään opettajien ohjauksessa osana opetusta.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f7f9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fi" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <StoreProvider>
          {children}
          <PrototypePanel />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
