import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function MentionsLegalesPage() {
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
        <h1 className="text-3xl font-bold mb-2">Mentions Légales</h1>
        <p className="text-sm text-gray-600 mb-12">Dernière mise à jour : 8 juin 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-300">

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Éditeur du site</h2>
            <div className="space-y-1">
              <p><span className="text-gray-500">Raison sociale :</span> Risly</p>
              <p><span className="text-gray-500">Pays :</span> Suisse</p>
              <p><span className="text-gray-500">Email :</span> <a href="mailto:contact@risly.ch" className="text-emerald-400 hover:text-emerald-300">contact@risly.ch</a></p>
              <p><span className="text-gray-500">Site web :</span> <span className="text-white">risly.ch</span></p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Hébergement</h2>
            <div className="space-y-1">
              <p><span className="text-gray-500">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="text-gray-500">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><span className="text-gray-500">Site :</span> vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Paiements</h2>
            <p>Les paiements sont traités par <strong className="text-white">Stripe</strong>, prestataire de services de paiement agréé. Risly ne stocke aucune donnée bancaire sur ses serveurs.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, graphiques, logo, icônes, code) est la propriété exclusive de Risly et est protégé par les lois suisses relatives à la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Protection des données (LPD)</h2>
            <p>Conformément à la Loi fédérale sur la protection des données (LPD) et au Règlement Général sur la Protection des Données (RGPD) applicable aux résidents de l'Union Européenne, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
            <p className="mt-2">Pour exercer ces droits, contactez : <a href="mailto:contact@risly.ch" className="text-emerald-400 hover:text-emerald-300">contact@risly.ch</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Cookies</h2>
            <p>Risly utilise des cookies essentiels au fonctionnement du service (session utilisateur) et des cookies analytiques anonymes pour améliorer l'expérience. Aucun cookie publicitaire n'est utilisé.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Limitation de responsabilité</h2>
            <p>Les informations contenues sur ce site sont fournies à titre indicatif. Risly ne garantit pas l'exactitude, l'exhaustivité ou l'adéquation des informations à vos besoins spécifiques. L'utilisation des informations se fait sous votre entière responsabilité.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Droit applicable et juridiction compétente</h2>
            <p>Le présent site et ses mentions légales sont régis par le droit suisse. En cas de litige, les tribunaux du canton de Genève sont seuls compétents.</p>
          </section>

        </div>
      </div>

      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <p>© 2026 Risly. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/mentions-legales" className="text-emerald-500">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
