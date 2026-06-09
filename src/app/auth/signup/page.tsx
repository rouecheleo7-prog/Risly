'use client'

import { useState, lazy, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
import { LogoFull } from '@/components/Logo'
import { createClient } from '@/lib/supabase'

const PaymentStep = lazy(() => import('@/components/PaymentStep'))

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '14 CHF/mois',
    features: ["Jusqu'à 50 articles", '3 objectifs', 'CHF & Euro'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '24 CHF/mois',
    features: ['Articles illimités', 'Suggestions IA', 'Export CSV'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '49 CHF/mois',
    features: ['Multi-utilisateurs', 'Rapports PDF', 'API access'],
  },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan)!

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setStep(2)
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create Supabase account first
      const supabase = createClient()
      const { error: signupError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } },
      })
      if (signupError && signupError.message !== 'User already registered') {
        throw new Error(signupError.message)
      }

      // Then create Stripe subscription
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, plan: selectedPlan, promoCode: promoCode.trim() || undefined }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')

      if (data.clientSecret) {
        if (promoCode.trim()) setPromoApplied(true)
        setClientSecret(data.clientSecret)
        setStep(3)
      } else {
        router.push('/onboarding')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ['Compte', 'Plan', 'Paiement']

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-12">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px] animate-pulse-orb" />
        <div className="grid-bg absolute inset-0 opacity-100" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-white transition-colors mb-10">
          <ArrowLeft size={15} />
          Retour
        </Link>

        <div className="mb-8">
          <LogoFull size="md" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8">
          {stepLabels.map((label, i) => {
            const s = i + 1
            const active = s === step
            const done = s < step
            return (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-emerald-600 text-white' : active ? 'bg-emerald-600/20 border border-emerald-600 text-emerald-400' : 'bg-white/5 text-gray-600'}`}>
                    {done ? <Check size={11} /> : s}
                  </div>
                  <span className={`text-xs transition-colors ${active ? 'text-white font-medium' : done ? 'text-emerald-500' : 'text-gray-600'}`}>{label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-px mx-1 transition-colors ${done ? 'bg-emerald-600' : 'bg-white/8'}`} />}
              </div>
            )
          })}
        </div>

        {/* Step 1 — Account */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black mb-1">Créer votre compte</h1>
            <p className="text-gray-500 text-sm mb-6">3 jours gratuits, sans carte bancaire</p>
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Nom complet</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jean Dupont" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="vous@exemple.ch" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="8 caractères minimum" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20">
                Continuer →
              </button>
            </form>
          </div>
        )}

        {/* Step 2 — Plan */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-black mb-1">Choisir votre plan</h1>
            <p className="text-gray-500 text-sm mb-6">Essai gratuit 3 jours sur tous les plans</p>
            <form onSubmit={handleStep2} className="space-y-3">
              {PLANS.map((plan) => (
                <label key={plan.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-emerald-600 bg-emerald-950/20' : 'border-white/8 bg-white/[0.02] hover:border-white/15'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${selectedPlan === plan.id ? 'border-emerald-600 bg-emerald-600' : 'border-gray-700'}`}>
                    {selectedPlan === plan.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{plan.name}</span>
                      {plan.popular && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">Populaire</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 mt-0.5">
                      {plan.features.map(f => <span key={f} className="text-xs text-gray-600">{f}</span>)}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-300 shrink-0">{plan.price}</span>
                  <input type="radio" name="plan" value={plan.id} checked={selectedPlan === plan.id} onChange={() => setSelectedPlan(plan.id)} className="sr-only" />
                </label>
              ))}

              <div className="bg-emerald-950/20 border border-emerald-800/20 rounded-xl p-3 text-center mt-2">
                <p className="text-xs text-emerald-500">✓ 3 jours gratuits · Votre carte ne sera débitée qu&apos;après l&apos;essai</p>
              </div>

              {/* Promo code */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Code promo (optionnel)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoApplied(false) }}
                    placeholder="ex : RISLY20"
                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors uppercase tracking-wider"
                  />
                </div>
                {promoApplied && (
                  <p className="text-xs text-emerald-500 mt-1.5">✓ Code appliqué — la réduction sera visible au paiement</p>
                )}
              </div>

              {error && (
                <div className="bg-red-950/30 border border-red-800/30 rounded-xl p-3 text-sm text-red-400">{error}</div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20">
                {loading ? 'Préparation...' : 'Continuer vers le paiement →'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-600 hover:text-gray-400 py-1">← Retour</button>
            </form>
          </div>
        )}

        {/* Step 3 — Payment */}
        {step === 3 && clientSecret && (
          <Suspense fallback={<div className="text-center text-gray-500 py-8">Chargement du paiement...</div>}>
            <PaymentStep
              clientSecret={clientSecret}
              planName={selectedPlanData.name}
              planPrice={selectedPlanData.price}
              onSuccess={() => router.push('/onboarding')}
              onBack={() => setStep(2)}
            />
          </Suspense>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-400 transition-colors font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
