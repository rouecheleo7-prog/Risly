'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Lock } from 'lucide-react'

const WA = 'https://wa.me/41779021764'

export default function Navbar() {
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1])

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="#hero" className="font-display text-xl font-semibold tracking-tight text-slate-950">
          Risly<span className="text-indigo-600">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#services" className="transition hover:text-slate-900">Services</a>
          <a href="#tarifs" className="transition hover:text-slate-900">Tarifs</a>
          <a href="#methode" className="transition hover:text-slate-900">Méthode</a>
          <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
          <a href="#apropos" className="transition hover:text-slate-900">À propos</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-950/10 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset] transition hover:bg-slate-800"
          >
            <Lock className="h-4 w-4 flex-shrink-0 text-indigo-400 transition group-hover:text-indigo-300" strokeWidth={2} />
            <span className="text-slate-300">Risly</span>
            <span className="text-white">Pro</span>
          </Link>
          <Link
            href={`${WA}?text=${encodeURIComponent('Bonjour Risly 👋 Je souhaite recevoir une maquette gratuite pour mon projet.')}`}
            className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:bg-indigo-700"
            target="_blank"
            rel="noreferrer"
          >
            Maquette gratuite
          </Link>
        </div>
      </div>
    </header>
  )
}
