import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap', weight: ['400', '500', '600'] })
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'], display: 'swap', weight: ['500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Risly, agence digitale en Suisse romande',
  description: 'Création de sites web, automatisations IA, menus QR et cartes NFC pour les professionnels en Suisse romande.',
  keywords: ['agence digitale', 'site web', 'automatisation IA', 'menu QR', 'carte NFC', 'Suisse romande'],
  authors: [{ name: 'Risly' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon-32.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Risly',
  },
}

export const viewport: Viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
