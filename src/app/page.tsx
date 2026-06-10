import Link from 'next/link'
import { ChevronRight, Check, Star, TrendingUp, BarChart3, Target, Globe, Smartphone, Zap, ArrowRight, Calculator, Truck, Receipt, Users, CalendarDays, FileText } from 'lucide-react'
import AnimatedCounter from '@/components/AnimatedCounter'
import { LogoFull } from '@/components/Logo'
import HeroAnimated from '@/components/HeroAnimated'
import { FadeUp, ScaleIn, StaggerContainer, StaggerItem, SectionTitle, HoverCard, DashboardParallax } from '@/components/LandingAnimations'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-emerald-500/10 blur-[180px]" />
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/6 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-700/5 blur-[100px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center top, transparent 0%, #030303 70%)' }} />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04]" style={{ background: 'rgba(3,3,3,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoFull size="sm" />
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#temoignages" className="hover:text-white transition-colors">Avis</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-white transition-colors px-4 py-2 hidden sm:block">
              Connexion
            </Link>
            <Link href="/auth/signup" className="text-sm text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 border border-emerald-600/50 hover:border-emerald-500 bg-emerald-600/10 hover:bg-emerald-600/20 transition-all">
              <span>Essai gratuit</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <HeroAnimated />
        </div>

        {/* Dashboard preview avec parallax */}
        <DashboardParallax>
          <div id="demo" className="relative">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-emerald-500/15 blur-[60px] rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-white/6" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 50px 200px rgba(5,150,105,0.1), 0 0 0 1px rgba(255,255,255,0.04)' }}>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-gray-500">risly.ch/dashboard</span>
                </div>
                <div className="w-16" />
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Bénéfice net', value: 'CHF 1 240', change: '+18%', glow: 'rgba(5,150,105,0.15)', border: 'rgba(5,150,105,0.2)', text: '#10b981' },
                    { label: 'CA total', value: 'CHF 2 940', change: '+22%', glow: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa' },
                    { label: 'Ventes', value: '9 ventes', change: '+3', glow: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: '#a78bfa' },
                    { label: 'Marge moy.', value: '42%', change: '+5%', glow: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', text: '#fb923c' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl p-4" style={{ background: stat.glow, border: `1px solid ${stat.border}` }}>
                      <p className="text-xs text-gray-500 mb-2">{stat.label}</p>
                      <p className="text-base md:text-lg font-bold" style={{ color: stat.text }}>{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp size={9} color="#10b981" />
                        <p className="text-xs text-emerald-500">{stat.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-4 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-300">Évolution des bénéfices</span>
                    <span className="text-xs text-emerald-500 px-2 py-0.5 rounded-full" style={{ background: 'rgba(5,150,105,0.15)' }}>Juin 2026</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-24">
                    {[15, 28, 22, 45, 38, 55, 48, 65, 58, 78, 70, 88, 82, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm relative" style={{ height: `${h}%`, background: `linear-gradient(to top, #059669${i === 13 ? 'ff' : '50'}, #10b981${i === 13 ? '60' : '10'})` }}>
                        {i === 13 && (
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">+CHF 88</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardParallax>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-16 px-6 border-y border-white/[0.04]">
        <StaggerContainer className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 1200, suffix: '+', label: 'Revendeurs actifs' },
            { value: 4700000, suffix: '', label: 'CHF de ventes suivis' },
            { value: 98, suffix: '%', label: 'Satisfaction client' },
            { value: 3, suffix: ' min', label: 'Pour tout configurer', prefix: '<' },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <p className="text-3xl md:text-4xl font-black text-white mb-1">
                {s.prefix}<AnimatedCounter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-gray-600">{s.label}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── FEATURES ── */}
      <section id="fonctionnalites" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle badge="Fonctionnalités" title="Tout ce qu'il faut." sub="Une interface pensée pour aller vite. Pas pour vous noyer dans les menus." />

          {/* Ligne 1 — Hero feature */}
          <StaggerContainer className="grid md:grid-cols-3 gap-4 mb-4">
            <StaggerItem className="md:col-span-2">
              <HoverCard className="rounded-2xl p-6 relative overflow-hidden border border-white/5 h-full" style={{ background: 'rgba(5,150,105,0.05)' }}>
                <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-3xl" style={{ background: 'rgba(5,150,105,0.08)' }} />
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-emerald-700/30" style={{ background: 'rgba(5,150,105,0.1)' }}>
                  <TrendingUp size={20} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Suivi des ventes en temps réel</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Enregistrez chaque vente en 10 secondes. Prix d&apos;achat, prix de vente, marge nette — tout est calculé instantanément.</p>
                <div className="mt-5 flex items-center gap-2 flex-wrap">
                  {['Auto-calcul marge', 'Historique complet', 'Stock intégré'].map(t => (
                    <span key={t} className="text-xs border border-emerald-800/40 text-emerald-400 px-2.5 py-1 rounded-full" style={{ background: 'rgba(5,150,105,0.08)' }}>{t}</span>
                  ))}
                </div>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard className="rounded-2xl p-6 relative overflow-hidden border border-white/5 h-full" style={{ background: 'rgba(234,179,8,0.03)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-yellow-700/30" style={{ background: 'rgba(234,179,8,0.1)' }}>
                  <Zap size={20} className="text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Conseils IA</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">Risly analyse vos données et vous donne des conseils chaque semaine.</p>
                <div className="rounded-xl p-3 text-xs text-yellow-400/80 border border-yellow-800/20" style={{ background: 'rgba(234,179,8,0.06)' }}>
                  💡 &ldquo;Vos Jordan se vendent mieux le vendredi. Publiez ce week-end.&rdquo;
                </div>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>

          {/* Ligne 2 — 3 tools */}
          <StaggerContainer className="grid md:grid-cols-3 gap-4 mb-4">
            <StaggerItem>
              <HoverCard className="rounded-2xl p-6 border border-white/5 h-full" style={{ background: 'rgba(59,130,246,0.04)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-blue-700/30" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <Calculator size={20} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Calculateur de rentabilité</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Simulez vos profits avant d&apos;acheter. Calculez votre seuil de rentabilité et comparez jusqu&apos;à 5 scénarios.</p>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard className="rounded-2xl p-6 border border-white/5 h-full" style={{ background: 'rgba(139,92,246,0.04)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-purple-700/30" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <Users size={20} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">CRM Clients</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Gérez vos acheteurs réguliers. Historique d&apos;achats, relances, statut VIP — tout au même endroit.</p>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard className="rounded-2xl p-6 border border-white/5 h-full" style={{ background: 'rgba(249,115,22,0.03)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-orange-700/30" style={{ background: 'rgba(249,115,22,0.1)' }}>
                  <Receipt size={20} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Générateur de factures</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Créez des factures professionnelles en 30 secondes. Aperçu live, export PDF prêt à envoyer.</p>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>

          {/* Ligne 3 — 3 features */}
          <StaggerContainer className="grid md:grid-cols-3 gap-4">
            <StaggerItem>
              <HoverCard className="rounded-2xl p-6 border border-white/5 h-full" style={{ background: 'rgba(20,184,166,0.03)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-teal-700/30" style={{ background: 'rgba(20,184,166,0.1)' }}>
                  <Truck size={20} className="text-teal-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Historique fournisseurs</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Notez vos fournisseurs, suivez les dépenses par source et repérez les meilleurs partenaires.</p>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard className="rounded-2xl p-6 border border-white/5 h-full" style={{ background: 'rgba(236,72,153,0.03)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-pink-700/30" style={{ background: 'rgba(236,72,153,0.1)' }}>
                  <CalendarDays size={20} className="text-pink-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Calendrier de drops</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Planifiez vos achats et ventes à venir. Ne ratez plus aucun drop avec les alertes intégrées.</p>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard className="rounded-2xl p-6 border border-white/5 h-full" style={{ background: 'rgba(249,115,22,0.03)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border border-orange-700/30" style={{ background: 'rgba(249,115,22,0.1)' }}>
                  <Globe size={20} className="text-orange-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">CHF & Euro · App mobile</h3>
                <p className="text-gray-500 text-sm">Basculez en un clic. Installez Risly sur votre téléphone comme une vraie application.</p>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-6 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <SectionTitle badge="Comment ça marche" title="3 minutes." />
          <StaggerContainer className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33%+20px)] right-[calc(33%+20px)] h-px" style={{ background: 'linear-gradient(90deg, rgba(5,150,105,0.3), rgba(5,150,105,0.6), rgba(5,150,105,0.3))' }} />
            {[
              { step: '01', title: 'Créez votre compte', desc: "Inscription en 2 minutes. Choisissez votre plan et commencez votre essai." },
              { step: '02', title: 'Enregistrez vos ventes', desc: 'Prix achat, vente, quantité — tout en quelques secondes.' },
              { step: '03', title: 'Pilotez votre business', desc: 'Bénéfices en temps réel, objectifs, suggestions IA.' },
            ].map((step) => (
              <StaggerItem key={step.step}>
                <HoverCard className="rounded-2xl p-6 text-center border border-white/5 h-full" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-700/30 font-mono font-black text-emerald-400" style={{ background: 'rgba(5,150,105,0.08)', fontSize: '14px' }}>
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="tarifs" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionTitle badge="Tarifs" title="Simple." sub="3 jours gratuits. Pas de carte requise. Annulez à tout moment." />
          <StaggerContainer className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Starter', price: '14', desc: 'Parfait pour débuter', features: ["Jusqu'à 50 ventes/mois", 'Bénéfices temps réel', 'Calculateur rentabilité', 'CHF & Euro', 'App mobile PWA'], popular: false },
              { name: 'Pro', price: '24', desc: 'Le plus populaire', features: ['Ventes illimitées', 'CRM Clients', 'Fournisseurs', 'Factures PDF', 'Calendrier de drops', 'Conseils IA', 'Objectifs illimités'], popular: true },
              { name: 'Business', price: '49', desc: 'Pour les sérieux', features: ['Tout Pro inclus', 'Multi-utilisateurs ×3', 'Analyses IA poussées', 'Export comptable CSV', 'Rapports avancés', 'Support prioritaire'], popular: false },
            ].map((plan) => (
              <StaggerItem key={plan.name}>
                <HoverCard className="relative rounded-3xl p-6 h-full flex flex-col" style={{
                  background: plan.popular ? 'rgba(5,150,105,0.07)' : 'rgba(255,255,255,0.02)',
                  border: plan.popular ? '1px solid rgba(5,150,105,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: plan.popular ? '0 0 60px rgba(5,150,105,0.08)' : 'none'
                }}>
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                      ⭐ Recommandé
                    </span>
                  )}
                  <div className="mb-6">
                    <h3 className="font-black text-xl mb-1 uppercase">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-5">{plan.desc}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-black">{plan.price}</span>
                      <span className="text-gray-600 text-sm mb-2">CHF/mois</span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">3 jours d&apos;essai offerts.</p>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(5,150,105,0.15)' }}>
                          <Check size={9} className="text-emerald-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup" className="block text-center py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-95" style={plan.popular ? { background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white' } : { background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Essayer 3 jours gratuits
                  </Link>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="temoignages" className="relative z-10 py-24 px-6 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <SectionTitle badge="Témoignages" title="Ils ont scalé." />
          <StaggerContainer className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Maxime R.', role: 'Revendeur sneakers · Genève', text: "Avant Risly je gérais tout sur Excel. Maintenant j'ai mes bénéfices en temps réel depuis mon téléphone. Gain de temps incroyable.", stars: 5, avatar: 'M' },
              { name: 'Sofia M.', role: 'Revendeuse tech · Lausanne', text: "L'interface est dingue. Les objectifs mensuels m'ont aidé à doubler mon CA en 2 mois. Je m'en passe plus.", stars: 5, avatar: 'S' },
              { name: 'Karim B.', role: 'Multi-revendeur · Zurich', text: "Le switch CHF/EUR est exactement ce qu'il me fallait. Je vends en Suisse et en France, enfin un outil qui suit mes deux marchés.", stars: 5, avatar: 'K' },
            ].map((t) => (
              <StaggerItem key={t.name}>
                <HoverCard className="rounded-2xl p-6 border border-white/5 h-full flex flex-col" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold border border-emerald-700/30" style={{ background: 'rgba(5,150,105,0.1)' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-gray-600">{t.role}</p>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px]" style={{ background: 'rgba(5,150,105,0.12)' }} />
        </div>
        <ScaleIn>
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-6 uppercase leading-[0.9]">
              Votre business<br />
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #059669, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 40px rgba(16,185,129,0.3))'
              }}>mérite mieux.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
              Rejoignez plus de 1 200 revendeurs qui utilisent Risly.
            </p>
            <Link href="/auth/signup" className="inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-emerald-900/40 hover:scale-[1.03] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
              <span>Démarrer gratuitement — 3 jours</span>
              <ArrowRight size={20} />
            </Link>
            <p className="text-xs text-gray-800 mt-4">Paiement sécurisé · Annulable en 1 clic · 3 jours offerts</p>
          </div>
        </ScaleIn>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <LogoFull size="sm" />
          <p className="text-sm text-gray-800">© 2026 Risly. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm text-gray-700">
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <a href="mailto:contact@risly.ch" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  )
}
