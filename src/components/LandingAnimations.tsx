'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, ReactNode } from 'react'

/* ── Fade-in au scroll ── */
export function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Scale-in au scroll ── */
export function ScaleIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Dashboard avec parallax léger ── */
export function DashboardParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const y = useSpring(rawY, { stiffness: 80, damping: 20 })

  return (
    <motion.div ref={ref} style={{ y }} className="relative max-w-5xl mx-auto mt-20">
      {children}
    </motion.div>
  )
}

/* ── Card hover interactive ── */
export function HoverCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger container ── */
export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Section title ── */
export function SectionTitle({ badge, title, sub }: { badge: string; title: string; sub?: string }) {
  return (
    <div className="text-center mb-16">
      <FadeUp>
        <p className="text-emerald-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">{badge}</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase">{title}</h2>
        {sub && <p className="text-gray-600 text-lg max-w-xl mx-auto">{sub}</p>}
      </FadeUp>
    </div>
  )
}
