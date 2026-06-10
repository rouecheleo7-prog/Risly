'use client'

import { useApp } from '@/lib/store'
import { Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  requiredPlan: 'pro' | 'business'
  children: React.ReactNode
  featureName: string
}

export default function PlanGate({ requiredPlan, children, featureName }: Props) {
  const { userPlan } = useApp()

  const hasAccess =
    userPlan === 'business' ||
    (requiredPlan === 'pro' && (userPlan === 'pro' || userPlan === 'business'))

  if (hasAccess) return <>{children}</>

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-emerald-700/30" style={{ background: 'rgba(5,150,105,0.08)' }}>
          <Lock size={24} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          Fonctionnalité Pro
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold text-emerald-400">{featureName}</span> est disponible à partir du plan Pro.
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Passez au plan Pro pour débloquer CRM, Factures, Fournisseurs, Calendrier drops et plus.
        </p>
        <Link
          href="/dashboard/parametres"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95"
        >
          Passer au plan Pro — 24 CHF/mois
          <ArrowRight size={15} />
        </Link>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>3 jours d&apos;essai gratuits</p>
      </div>
    </div>
  )
}
