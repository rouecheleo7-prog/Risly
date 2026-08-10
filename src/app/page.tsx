import Link from 'next/link'
import { QrCode, Nfc, Star, Camera, Globe, Music2, ArrowRight } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/LandingAnimations'

const WA = 'https://wa.me/41774382967'

const services = [
  {
    title: 'Sites Web',
    price: 'dès 450 CHF',
    unit: 'paiement unique',
    description: 'Site vitrine moderne, responsive et pensé pour convertir.',
  },
  {
    title: 'Automatisations IA',
    price: 'dès 2’500 CHF',
    unit: 'paiement unique',
    description: 'Workflows intelligents qui qualifient et relancent vos leads.',
  },
  {
    title: 'Menu QR Restaurant',
    price: 'dès 250 CHF',
    unit: '+ 15 CHF/table',
    description: 'Menu digital élégant, modifiable en un clic, sans réimpression.',
  },
  {
    title: 'Carte NFC',
    price: '50 CHF',
    unit: 'configurée',
    description: 'Un tap pour partager Google, Instagram, TikTok et votre site.',
  },
]

const sitesPricing = [
  {
    title: 'Basique',
    price: '450 CHF',
    unit: 'Paiement unique',
    features: ['Site one-page professionnel', 'Design moderne et responsive', 'Optimisé mobile et Google', 'Formulaire de contact', 'Livré en 5-7 jours'],
  },
  {
    title: 'Complet',
    price: '800 CHF',
    unit: 'Paiement unique',
    badge: 'Le + demandé',
    features: ['Site multi-pages sur mesure', 'Tout du Basique inclus', 'Réservation en ligne intégrée', 'Galerie photos / portfolio', 'Fiche Google Business optimisée', 'Livré en 7-10 jours'],
  },
  {
    title: 'Système Digital IA',
    price: 'dès 2’500 CHF',
    unit: 'Paiement unique · sur devis',
    features: ['Tout du Complet inclus', 'Automatisations IA sur mesure', 'Rappels et confirmations SMS', 'Qualification de leads automatique', 'Agent vocal IA en option', 'Formation de 30 min incluse'],
  },
]

const methodSteps = [
  { step: '01', title: 'On échange', detail: 'Un appel ou un café de 20 min pour comprendre votre activité.' },
  { step: '02', title: 'Je construis', detail: 'Je crée votre site et vos outils, vous validez à chaque étape.' },
  { step: '03', title: 'C’est en ligne', detail: 'Mise en ligne, formation rapide, tout est entre vos mains.' },
]

const guarantees = [
  { label: '0 CHF/mois', value: 'Aucun abonnement' },
  { label: '100% clé en main', value: 'Prêt à l’usage' },
  { label: '5-14 jours', value: 'Délais rapides' },
  { label: 'Hébergement Suisse', value: 'Performance locale' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="#hero" className="font-display text-xl font-semibold tracking-tight text-slate-950">
            Risly<span className="text-indigo-600">.</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="transition hover:text-slate-900">Services</a>
            <a href="#tarifs" className="transition hover:text-slate-900">Tarifs</a>
            <a href="#methode" className="transition hover:text-slate-900">Méthode</a>
            <a href="#apropos" className="transition hover:text-slate-900">À propos</a>
            <a href="#contact" className="transition hover:text-slate-900">Contact</a>
          </nav>
          <Link
            href={`${WA}?text=${encodeURIComponent('Bonjour Risly 👋 Je souhaite discuter de mon projet.')}`}
            className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:bg-indigo-700"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative pt-40 pb-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-gradient-to-b from-indigo-50 via-indigo-50/40 to-transparent" />
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <FadeUp>
            <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
              Basé en Suisse romande
            </span>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-8 font-display text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Votre business mérite<br className="hidden sm:block" /> une vitrine à la hauteur.
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Sites web, automatisations IA, menus digitaux et cartes NFC pour les professionnels en Suisse romande.
              Prestation unique, sans abonnement.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-10 flex flex-col items-center gap-4">
              <Link
                href={`${WA}?text=${encodeURIComponent('Bonjour Risly 👋 Je souhaite discuter de mon projet.')}`}
                className="btn-primary group"
                target="_blank"
                rel="noreferrer"
              >
                Discuter de mon projet
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <p className="text-sm text-slate-500">Réponse sous 24h · Sans engagement</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Services (aperçu) ── */}
      <section id="services" className="border-t border-slate-200/70 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeUp>
            <div className="section-title mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Services</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Des offres complètes pour votre présence digitale.</h2>
            </div>
          </FadeUp>
          <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <div className="card-surface h-full p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">{service.title}</div>
                  <p className="mt-5 text-3xl font-semibold text-slate-950">{service.price}</p>
                  <p className="mt-1 text-sm font-medium text-slate-400">{service.unit}</p>
                  <p className="mt-5 text-sm leading-7 text-slate-600">{service.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Tarifs sites web ── */}
      <section id="tarifs" className="border-t border-slate-200/70 bg-slate-100/60 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeUp>
            <div className="section-title mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Sites web</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Des packages clairs pour démarrer vite.</h2>
            </div>
          </FadeUp>
          <StaggerContainer className="mt-16 grid gap-6 lg:grid-cols-3">
            {sitesPricing.map((plan) => (
              <StaggerItem key={plan.title}>
                <div className={`h-full rounded-[2rem] border p-8 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${plan.badge ? 'border-indigo-200 bg-white ring-1 ring-indigo-100' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-semibold">{plan.title}</h3>
                    {plan.badge ? <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">{plan.badge}</span> : null}
                  </div>
                  <p className="mt-6 text-4xl font-semibold text-slate-950">{plan.price}</p>
                  <p className="mt-1 text-sm font-medium text-slate-400">{plan.unit}</p>
                  <ul className="mt-8 space-y-4 text-sm leading-7 text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Menu QR Restaurant ── */}
      <section id="menu-qr" className="border-t border-slate-200/70 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Menu QR restaurant</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Votre menu, à jour en un clic. Plus jamais réimprimé.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Un menu digital élégant, accessible en scannant un QR code sur chaque table. Vous modifiez vos plats et vos prix
                vous-même, en temps réel — sans attendre ni repayer une impression.
              </p>
              <ul className="mt-8 space-y-4 text-sm leading-7 text-slate-600">
                {['Création du menu digital sur mesure', 'QR codes personnalisés à votre image', 'Supports de table prêts à poser'].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-3xl font-semibold text-slate-950">250 CHF <span className="text-lg font-medium text-slate-400">+ 15 CHF/table</span></p>
                </div>
                <Link
                  href={`${WA}?text=${encodeURIComponent('Bonjour Risly 👋 Je souhaite un menu QR pour mon restaurant.')}`}
                  className="btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Écrire sur WhatsApp
                </Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="relative mx-auto max-w-sm rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
                <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[2rem] bg-gradient-to-b from-indigo-50 to-transparent" />
                <div className="relative flex flex-col items-center gap-5 text-center">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">Table 4</span>
                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 p-3">
                    <QrCode className="h-full w-full text-white" strokeWidth={1.25} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Scannez pour voir le menu</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Carte NFC ── */}
      <section id="carte-nfc" className="border-t border-slate-200/70 bg-slate-100/60 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <FadeUp className="order-2 lg:order-1">
              <div className="relative mx-auto flex max-w-sm flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
                <div className="mb-2 flex items-center gap-3 rounded-2xl bg-slate-950 p-5 text-white">
                  <Nfc className="h-6 w-6" />
                  <span className="font-display text-sm font-semibold tracking-tight">Risly<span className="text-indigo-400">.</span> Card</span>
                </div>
                {[
                  { icon: Star, label: 'Avis Google' },
                  { icon: Camera, label: 'Instagram' },
                  { icon: Music2, label: 'TikTok' },
                  { icon: Globe, label: 'Site web' },
                ].map((link) => (
                  <div key={link.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <link.icon className="h-4 w-4 text-indigo-600" />
                    {link.label}
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.1} className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Carte NFC</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Un tap, et tous vos liens s’ouvrent.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Une carte physique que vos clients approchent de leur téléphone pour accéder instantanément à votre fiche Google,
                Instagram, TikTok et votre site web — sans app à installer.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                De quoi booster votre visibilité et récolter plus facilement des avis Google.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <p className="text-3xl font-semibold text-slate-950">50 CHF <span className="text-lg font-medium text-slate-400">/ carte configurée</span></p>
                <Link
                  href={`${WA}?text=${encodeURIComponent('Bonjour Risly 👋 Je souhaite une carte NFC pour mon commerce.')}`}
                  className="btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Écrire sur WhatsApp
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Extras ── */}
      <section id="extras" className="border-t border-slate-200/70 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeUp>
            <div className="card-surface flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Camera className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Shooting photo</h3>
                  <p className="mt-1 text-sm text-slate-600">Pour les commerces qui n’ont pas encore de photos professionnelles.</p>
                </div>
              </div>
              <span className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Sur devis</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Méthode ── */}
      <section id="methode" className="border-t border-slate-200/70 bg-slate-100/60 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeUp>
            <div className="section-title mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Méthode</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Un process simple, rapide et transparent.</h2>
            </div>
          </FadeUp>
          <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-3">
            {methodSteps.map((item) => (
              <StaggerItem key={item.step}>
                <div className="h-full rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-950 shadow-sm">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-50 text-2xl font-semibold text-indigo-600">{item.step}</div>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── À propos ── */}
      <section id="apropos" className="border-t border-slate-200/70 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
            <FadeUp>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">À propos</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Développeur et entrepreneur en Suisse romande.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Je suis Léo, développeur et entrepreneur basé en Suisse romande. Je crée des solutions digitales concrètes pour
                les professionnels qui veulent une présence en ligne efficace — sans se ruiner et sans dépendre d’une agence.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Chaque outil que je mets en place vous appartient. Pas d’abonnement, pas de dépendance.
              </p>
            </FadeUp>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {guarantees.map((item) => (
                <StaggerItem key={item.label}>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">{item.label}</p>
                    <p className="mt-3 text-lg font-semibold text-slate-950">{item.value}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── Contact final ── */}
      <section id="contact" className="relative overflow-hidden bg-slate-950 py-28 text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-full bg-gradient-to-b from-indigo-950/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
          <FadeUp>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Prêt à passer au digital ?</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Échangeons sur votre projet et construisons une présence digitale qui convertit vos clients en Suisse romande.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`${WA}?text=${encodeURIComponent('Bonjour Risly 👋 Je souhaite discuter de mon projet.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500"
              >
                Discuter sur WhatsApp
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="mailto:risly.ch@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/5">
                risly.ch@gmail.com
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/70 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-6 text-sm text-slate-500 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Risly · Suisse romande · risly.ch@gmail.com</p>
        </div>
      </footer>
    </main>
  )
}
