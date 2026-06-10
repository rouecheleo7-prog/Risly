'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Clock } from 'lucide-react'

const words = ['Pilotez.', 'Vendez.', 'Gagnez.']

export default function HeroAnimated() {
  return (
    <div className="text-center">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex justify-center mb-8"
      >
        <div className="inline-flex items-center gap-2 border border-emerald-700/40 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full" style={{ background: 'rgba(5,150,105,0.08)' }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          Essai gratuit 3 jours — Aucun paiement maintenant
        </div>
      </motion.div>

      {/* Headline staggered */}
      <div className="mb-8">
        <h1 className="font-black tracking-tight leading-[0.85] uppercase">
          {words.map((word, i) => (
            <motion.span
              key={word}
              className="block text-[clamp(60px,12vw,160px)]"
              initial={{ opacity: 0, y: 60, skewY: 4 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={i === 1 ? {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 40%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 60px rgba(16,185,129,0.4))'
              } : { color: 'white' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed"
      >
        Ventes, bénéfices, objectifs — tout en temps réel.<br className="hidden sm:block" />
        L&apos;outil que chaque revendeur attendait.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
      >
        <Link href="/auth/signup" className="group w-full sm:w-auto flex items-center justify-center gap-2 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-2xl shadow-emerald-900/40 hover:scale-[1.03] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
          <span>Démarrer gratuitement</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <a href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-400 hover:text-white px-8 py-4 rounded-2xl border border-white/8 hover:border-white/20 transition-all text-base hover:scale-[1.02]" style={{ backdropFilter: 'blur(10px)' }}>
          Voir la démo
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-xs text-gray-700 flex items-center justify-center gap-4"
      >
        <span className="flex items-center gap-1"><Shield size={11} className="text-emerald-800" /> 3 jours d&apos;essai offerts</span>
        <span className="text-gray-800">·</span>
        <span className="flex items-center gap-1"><Clock size={11} className="text-emerald-800" /> Annulable à tout moment</span>
      </motion.p>
    </div>
  )
}
