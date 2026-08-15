'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { QrCode, Nfc } from 'lucide-react'

export default function HeroMockup() {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), springConfig)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="pointer-events-none absolute -inset-x-10 -top-10 h-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <motion.div
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/40"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="ml-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200">
            lecomptoir-lausanne.ch
          </span>
        </div>
        <div className="space-y-4 p-6">
          <div className="h-28 rounded-xl bg-gradient-to-br from-indigo-100 via-indigo-50 to-white" />
          <div className="h-3 w-3/4 rounded-full bg-slate-200" />
          <div className="h-3 w-1/2 rounded-full bg-slate-100" />
          <div className="flex gap-3 pt-2">
            <div className="h-9 w-28 rounded-full bg-indigo-600" />
            <div className="h-9 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute -left-8 bottom-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-200/60 sm:-left-12"
      >
        <QrCode className="h-5 w-5 text-indigo-600" />
        <span className="text-xs font-semibold text-slate-700">Menu QR</span>
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -right-6 top-10 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-200/60 sm:-right-10"
      >
        <Nfc className="h-5 w-5 text-indigo-600" />
        <span className="text-xs font-semibold text-slate-700">Carte NFC</span>
      </motion.div>
    </motion.div>
  )
}
