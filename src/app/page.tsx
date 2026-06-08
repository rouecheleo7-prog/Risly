import Link from 'next/link'
import { ChevronRight, Check, Star, TrendingUp, BarChart3, Target, Globe, Smartphone, Zap, ArrowRight, Shield, Clock } from 'lucide-react'
import AnimatedCounter from '@/components/AnimatedCounter'
import RislyMark, { LogoFull } from '@/components/Logo'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* ── BACKGROUND ORBS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="animate-pulse-orb absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-600/8 blur-[120px]" />
        <div className="animate-pulse-orb delay-300 absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-emerald-800/6 blur-[100px]" />
        <div className="animate-pulse-orb delay-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-emerald-950/20 blur-[150px]" />
        <div className="grid-bg absolute inset-0 opacity-100" />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoFull size="sm" />
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#fonctionnalites" className="hover:text-white transition-colors hover:text-emerald-300">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-white transition-colors hover:text-emerald-300">Tarifs</a>
            <a href="#temoignages" className="hover:text-white transition-colors hover:text-emerald-300">Avis</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 hidden sm:block">
              Connexion
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-1.5">
              <span>Essai gratuit</span>
              <ChevronRight size={14} className="relative z-10" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-700/30 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full mb-10 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Essai gratuit 3 jours — Aucun paiement maintenant
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
            Pilotez votre
            <br />
            <span className="shimmer-text">business.</span>
          </h1>

          <p className="animate-fade-up delay-200 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Ventes, bénéfices, objectifs — tout en temps réel.
            L'outil que chaque revendeur attendait.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/auth/signup" className="btn-primary group w-full sm:w-auto flex items-center justify-center gap-2 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-emerald-900/30">
              <span>Démarrer gratuitement</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-400 hover:text-white px-8 py-4 rounded-2xl border border-white/8 hover:border-white/20 backdrop-blur transition-all text-base">
              Voir la démo
            </a>
          </div>

          <p className="animate-fade-up delay-400 text-xs text-gray-600 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><Shield size={11} className="text-emerald-700" /> 3 jours d&apos;essai offerts</span>
            <span className="text-gray-800">·</span>
            <span className="flex items-center gap-1"><Clock size={11} className="text-emerald-700" /> Annulable à tout moment</span>
          </p>

        </div>

        {/* ── DASHBOARD PREVIEW ── */}
        <div id="demo" className="relative max-w-5xl mx-auto mt-24">
          {/* Glow under the card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-emerald-600/15 blur-[60px] rounded-full" />

          <div className="animate-float relative rounded-3xl overflow-hidden border border-white/8 bg-[#0d0d0d]/90 backdrop-blur-xl shadow-[0_50px_200px_rgba(5,150,105,0.12)]">
            {/* Scan line effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
              <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" style={{ animation: 'scan-line 6s linear infinite' }} />
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/30">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-4 rounded-full bg-emerald-600/60" />
                <div className="w-1 h-4 rounded-full bg-emerald-600/30" />
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-gray-500">risly.ch/dashboard</span>
              </div>
              <div className="w-16" />
            </div>

            <div className="p-6 md:p-8">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Bénéfice net', value: 'CHF 1 240', change: '+18%', color: 'from-emerald-500/10 to-emerald-600/5', text: 'text-emerald-400', border: 'border-emerald-800/20' },
                  { label: 'CA total', value: 'CHF 2 940', change: '+22%', color: 'from-blue-500/10 to-blue-600/5', text: 'text-blue-400', border: 'border-blue-800/20' },
                  { label: 'Ventes', value: '9 ventes', change: '+3', color: 'from-purple-500/10 to-purple-600/5', text: 'text-purple-400', border: 'border-purple-800/20' },
                  { label: 'Marge moy.', value: '42%', change: '+5%', color: 'from-orange-500/10 to-orange-600/5', text: 'text-orange-400', border: 'border-orange-800/20' },
                ].map((stat) => (
                  <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border ${stat.border}`}>
                    <p className="text-xs text-gray-500 mb-2">{stat.label}</p>
                    <p className={`text-base md:text-lg font-bold ${stat.text}`}>{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={9} className="text-emerald-500" />
                      <p className="text-xs text-emerald-500">{stat.change}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-300">Évolution des bénéfices</span>
                  <span className="text-xs text-emerald-500 bg-emerald-950/50 px-2 py-0.5 rounded-full">Juin 2026</span>
                </div>
                <div className="flex items-end gap-1.5 h-24">
                  {[15, 28, 22, 45, 38, 55, 48, 65, 58, 78, 70, 88, 82, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all relative group"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, #059669${i === 13 ? 'ff' : '60'}, #10b981${i === 13 ? '80' : '20'})`,
                      }}
                    >
                      {i === 13 && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                          +CHF 88
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STATS ── */}
      <section className="relative z-10 py-16 px-6 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 1200, suffix: '+', label: 'Revendeurs actifs', prefix: '' },
            { value: 4700000, suffix: '', label: 'CHF de ventes suivis', prefix: '' },
            { value: 98, suffix: '%', label: 'Satisfaction client', prefix: '' },
            { value: 3, suffix: ' min', label: 'Pour tout configurer', prefix: '<' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                {s.prefix}<AnimatedCounter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section id="fonctionnalites" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-500 text-sm font-semibold tracking-widest uppercase mb-3">Fonctionnalités</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Tout ce qu&apos;il vous faut.</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Une interface pensée pour aller vite. Pas pour vous noyer dans les menus.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Big card */}
            <div className="md:col-span-2 glass-card gradient-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-600/5 rounded-full blur-3xl" />
              <div className="w-11 h-11 bg-emerald-600/15 rounded-2xl flex items-center justify-center mb-4 border border-emerald-700/20">
                <TrendingUp size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Suivi des ventes en temps réel</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Enregistrez chaque vente en 10 secondes. Prix d&apos;achat, prix de vente, marge nette — tout est calculé instantanément. Visualisez votre performance du jour, de la semaine et du mois.</p>
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                {['Auto-calcul marge', 'Historique complet', 'Export CSV'].map(t => (
                  <span key={t} className="text-xs bg-emerald-950/50 border border-emerald-800/30 text-emerald-400 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>

            <div className="glass-card gradient-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
              <div className="w-11 h-11 bg-blue-600/15 rounded-2xl flex items-center justify-center mb-4 border border-blue-700/20">
                <BarChart3 size={20} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Graphiques avancés</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Courbes de progression, comparaisons mensuelles, tendances IA.</p>
            </div>

            <div className="glass-card gradient-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl" />
              <div className="w-11 h-11 bg-purple-600/15 rounded-2xl flex items-center justify-center mb-4 border border-purple-700/20">
                <Target size={20} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Objectifs personnalisés</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Fixez vos objectifs mensuels, modifiez-les à tout moment, suivez votre progression.</p>
            </div>

            {/* Big card 2 */}
            <div className="md:col-span-2 glass-card gradient-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-600/4 rounded-full blur-3xl" />
              <div className="w-11 h-11 bg-yellow-600/15 rounded-2xl flex items-center justify-center mb-4 border border-yellow-700/20">
                <Zap size={20} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Intelligence Artificielle intégrée</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">Risly analyse vos données de vente et prédit les meilleures périodes pour vendre. Recevez des suggestions personnalisées pour maximiser vos marges et anticiper les tendances de votre niche.</p>
              <div className="bg-yellow-950/20 border border-yellow-800/20 rounded-xl p-3 text-xs text-yellow-400/80">
                💡 &ldquo;Vos ventes Air Jordan progressent de 34% les vendredis. Idéal pour publier ce week-end.&rdquo;
              </div>
            </div>

            <div className="glass-card gradient-border rounded-2xl p-6">
              <div className="w-11 h-11 bg-orange-600/15 rounded-2xl flex items-center justify-center mb-4 border border-orange-700/20">
                <Globe size={20} className="text-orange-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">CHF & Euro</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Basculez en un clic entre franc suisse et euro.</p>
            </div>

            <div className="glass-card gradient-border rounded-2xl p-6">
              <div className="w-11 h-11 bg-pink-600/15 rounded-2xl flex items-center justify-center mb-4 border border-pink-700/20">
                <Smartphone size={20} className="text-pink-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">App mobile (PWA)</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Ajoutez Risly à votre écran d&apos;accueil depuis Chrome. Aucune installation requise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-6 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-500 text-sm font-semibold tracking-widest uppercase mb-3">Comment ça marche</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Opérationnel en 3 minutes.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33%+20px)] right-[calc(33%+20px)] h-px bg-gradient-to-r from-emerald-600/30 via-emerald-600/60 to-emerald-600/30" />
            {[
              { step: '01', title: 'Créez votre compte', desc: "Inscription en 2 minutes. Choisissez votre plan et commencez votre essai gratuit.", icon: '✦' },
              { step: '02', title: 'Enregistrez vos ventes', desc: 'Ajoutez vos ventes en quelques secondes. Prix achat, vente, quantité — tout est là.', icon: '✦' },
              { step: '03', title: 'Pilotez votre business', desc: "Suivez vos bénéfices en temps réel, atteignez vos objectifs, écoutez l'IA.", icon: '✦' },
            ].map((step) => (
              <div key={step.step} className="glass-card rounded-2xl p-6 text-center relative">
                <div className="w-14 h-14 bg-emerald-600/10 border border-emerald-700/20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 text-emerald-400 font-mono font-bold text-sm">
                  {step.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="tarifs" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-500 text-sm font-semibold tracking-widest uppercase mb-3">Tarifs</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple et transparent.</h2>
            <p className="text-gray-500 text-lg">3 jours gratuits. Pas de carte requise. Annulez à tout moment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Starter', price: '14', desc: 'Parfait pour débuter',
                features: ['Jusqu\'à 50 articles', 'Bénéfices temps réel', '3 objectifs', 'CHF & Euro', 'App mobile PWA'],
                popular: false, color: 'border-white/8',
              },
              {
                name: 'Pro', price: '24', desc: 'Le plus populaire',
                features: ['Articles illimités', 'Objectifs illimités', 'Graphiques avancés', 'Suggestions IA', 'Export CSV', 'Support prioritaire'],
                popular: true, color: 'border-emerald-600/50',
              },
              {
                name: 'Business', price: '49', desc: 'Pour les sérieux',
                features: ['Tout Pro inclus', 'Multi-utilisateurs ×3', 'Analyses IA poussées', 'Rapports PDF', 'API access', 'Onboarding dédié'],
                popular: false, color: 'border-white/8',
              },
            ].map((plan) => (
              <div key={plan.name} className={`relative rounded-3xl p-6 border ${plan.color} ${plan.popular ? 'bg-[#0d1a14] shadow-[0_0_60px_rgba(5,150,105,0.12)]' : 'bg-[#0d0d0d]'}`}>
                {plan.popular && (
                  <>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-600/5 to-transparent pointer-events-none" />
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-900/50">
                      ⭐ Recommandé
                    </span>
                  </>
                )}
                <div className="mb-6 relative">
                  <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-5">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-gray-500 text-sm mb-2">CHF/mois</span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">3 jours d&apos;essai offerts. Annulable à tout moment.</p>
                </div>
                <ul className="space-y-2.5 mb-8 relative">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-600/15 flex items-center justify-center shrink-0">
                        <Check size={9} className="text-emerald-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all relative ${plan.popular ? 'btn-primary text-white' : 'bg-white/6 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'}`}>
                  <span>Essayer 3 jours gratuits</span>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="temoignages" className="relative z-10 py-24 px-6 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-500 text-sm font-semibold tracking-widest uppercase mb-3">Témoignages</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ils sont passés au niveau supérieur.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Maxime R.', role: 'Revendeur sneakers · Genève', text: "Avant Risly je gérais tout sur Excel. Maintenant j'ai mes bénéfices en temps réel depuis mon téléphone. Gain de temps incroyable. Je recommande à 100%.", stars: 5, avatar: 'M' },
              { name: 'Sofia M.', role: 'Revendeuse tech · Lausanne', text: "L'interface est dingue, ça ressemble vraiment à une app Apple. Les objectifs mensuels m'ont aidé à doubler mon CA en 2 mois. Je m'en passe plus.", stars: 5, avatar: 'S' },
              { name: 'Karim B.', role: 'Multi-revendeur · Zurich', text: 'Le switch CHF/EUR est exactement ce qu\'il me fallait. Je vends en Suisse et en France, enfin un outil qui suit mes deux marchés.', stars: 5, avatar: 'K' },
            ].map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-700/30 flex items-center justify-center text-emerald-400 text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-600">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-32 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-600/8 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-emerald-500 text-sm font-semibold tracking-widest uppercase mb-4">Commencer maintenant</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Votre business mérite<br />
            <span className="shimmer-text">mieux qu&apos;Excel.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez plus de 1 200 revendeurs qui utilisent Risly pour prendre les bonnes décisions, au bon moment.
          </p>
          <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-900/40">
            <span>Démarrer gratuitement — 3 jours</span>
            <ArrowRight size={20} className="relative z-10" />
          </Link>
          <p className="text-xs text-gray-700 mt-4">Paiement sécurisé · Annulable en 1 clic · 3 jours offerts</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <LogoFull size="sm" />
          <p className="text-sm text-gray-700">© 2026 Risly. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <a href="mailto:contact@risly.ch" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  )
}
