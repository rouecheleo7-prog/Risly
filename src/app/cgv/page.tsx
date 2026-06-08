import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight"><span className="text-emerald-400">Ris</span>ly</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Retour</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <p className="text-xs font-medium text-emerald-500 tracking-widest uppercase mb-2">Légal</p>
        <h1 className="text-3xl font-bold mb-2">Conditions Générales de Vente</h1>
        <p className="text-sm text-gray-600 mb-12">Dernière mise à jour : 8 juin 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-gray-300">

          <section>
            <h2 className="text-base font-semibold text-white mb-3">1. Objet</h2>
            <p>Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation de la plateforme SaaS Risly, opérée par Risly, dont le siège est en Suisse. En vous abonnant à Risly, vous acceptez les présentes CGV dans leur intégralité.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">2. Description du service</h2>
            <p>Risly est une application web destinée aux revendeurs et entrepreneurs souhaitant suivre leurs ventes, marges, stock et objectifs. L'accès au service est conditionné à la souscription d'un abonnement payant.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">3. Offres et tarifs</h2>
            <p>Risly propose trois formules d'abonnement mensuel :</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li><strong className="text-white">Starter</strong> — 14 CHF/mois · limité à 50 articles</li>
              <li><strong className="text-white">Pro</strong> — 24 CHF/mois · articles illimités</li>
              <li><strong className="text-white">Business</strong> — 49 CHF/mois · fonctionnalités avancées</li>
            </ul>
            <p className="mt-3">Tous les prix sont indiqués en francs suisses (CHF), TVA incluse si applicable. Risly se réserve le droit de modifier ses tarifs, avec un préavis de 30 jours.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">4. Période d'essai</h2>
            <p>Tout nouvel abonnement bénéficie d'une période d'essai gratuite de 3 (trois) jours. Durant cette période, aucun montant n'est débité. À l'issue de l'essai, l'abonnement est activé et le paiement est prélevé automatiquement. Une carte bancaire valide est requise pour accéder à l'essai.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">5. Paiement</h2>
            <p>Le paiement est effectué via Stripe, prestataire de paiement sécurisé. Les moyens de paiement acceptés sont : carte bancaire (Visa, Mastercard), Apple Pay et Twint. L'abonnement est renouvelé automatiquement chaque mois à la date anniversaire.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">6. Résiliation</h2>
            <p>Vous pouvez résilier votre abonnement à tout moment depuis votre espace «&nbsp;Paramètres → Abonnement&nbsp;». La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement n'est accordé pour la période déjà facturée.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">7. Disponibilité du service</h2>
            <p>Risly s'engage à maintenir une disponibilité du service de 99,5% par mois. Des interruptions ponctuelles pour maintenance peuvent avoir lieu et seront notifiées 24h à l'avance si possible.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">8. Données personnelles</h2>
            <p>Le traitement de vos données personnelles est soumis à notre Politique de Confidentialité. Risly s'engage à ne jamais vendre vos données à des tiers.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">9. Limitation de responsabilité</h2>
            <p>Risly est un outil d'aide à la gestion. Les calculs fournis (marges, bénéfices) sont indicatifs et ne constituent pas un conseil fiscal ou comptable. Risly ne saurait être tenu responsable des décisions commerciales prises sur la base des données affichées.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">10. Droit applicable</h2>
            <p>Les présentes CGV sont soumises au droit suisse. Tout litige sera soumis à la compétence exclusive des tribunaux du canton de Genève, sous réserve de dispositions impératives contraires.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">11. Contact</h2>
            <p>Pour toute question relative aux présentes CGV : <a href="mailto:contact@risly.ch" className="text-emerald-400 hover:text-emerald-300">contact@risly.ch</a></p>
          </section>

        </div>
      </div>

      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <p>© 2026 Risly. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/cgv" className="text-emerald-500">CGV</Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
