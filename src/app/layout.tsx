import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Risly — Pilotez votre business',
  description: "Suivez vos ventes et bénéfices en temps réel. L'outil SaaS ultra-simple pour les revendeurs et entrepreneurs ambitieux.",
  keywords: ['revendeur', 'business', 'ventes', 'bénéfices', 'SaaS', 'entrepreneur'],
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
    startupImage: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
