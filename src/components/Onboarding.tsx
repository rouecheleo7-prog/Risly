'use client'

import Link from 'next/link'
import { TrendingUp, Package, Target, BarChart3, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Enregistrez votre première vente',
    desc: 'Ajoutez un article vendu avec son prix d\'achat et de vente pour voir vos marges en temps réel.',
    href: '/dashboard/ventes',
    cta: 'Ajouter une vente',
  },
  {
    icon: Package,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Gérez votre stock',
    desc: 'Ajoutez les articles que vous possédez et suivez votre bénéfice potentiel avant même de vendre.',
    href: '/dashboard/ventes',
    cta: 'Gérer le stock',
  },
  {
    icon: Target,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    title: 'Définissez vos objectifs',
    desc: 'Fixez-vous des objectifs mensuels de chiffre d\'affaires ou de bénéfice et suivez votre progression.',
    href: '/dashboard/objectifs',
    cta: 'Créer un objectif',
  },
  {
    icon: BarChart3,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: 'Analysez vos performances',
    desc: 'Découvrez vos catégories les plus rentables, vos meilleures marges et vos tops produits.',
    href: '/dashboard/rapports',
    cta: 'Voir les rapports',
  },
]

export default function Onboarding() {
  return (
    <div className="glass-dashboard rounded-2xl p-6 md:p-8 border border-emerald-500/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center">
          <TrendingUp size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Bienvenue sur Risly !</h2>
          <p className="text-xs text-gray-600 mt-0.5">Voici comment démarrer en 4 étapes</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {STEPS.map((step, i) => (
          <Link
            key={i}
            href={step.href}
            className="group flex items-start gap-3 p-4 rounded-xl border border-white/[0.05] hover:border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
          >
            <div className={`w-8 h-8 rounded-xl ${step.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <step.icon size={14} strokeWidth={1.75} className={step.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/90">{step.title}</p>
                <ArrowRight size={12} strokeWidth={2} className="text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
              <span className={`inline-block mt-2.5 text-xs font-semibold ${step.color}`}>{step.cta} →</span>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-700 text-center mt-5">
        Ce guide disparaîtra une fois votre première vente enregistrée.
      </p>
    </div>
  )
}
