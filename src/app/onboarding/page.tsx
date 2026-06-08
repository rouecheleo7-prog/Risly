'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RislyMark from '@/components/Logo'
import { LogoFull } from '@/components/Logo'

type Step = 1 | 2 | 3 | 4 | 'loading'
type Currency = 'CHF' | 'EUR'

interface FormData {
  businessName: string
  currency: Currency
  category: '' | 'Sneakers' | 'Luxe' | 'Électronique' | 'Autre'
  customCategory: string
  goal: '' | 'Démarrer' | 'Scaler' | 'Maximiser les marges'
  capital: string
}

const CATEGORIES = [
  { value: 'Sneakers', icon: '👟', desc: 'Baskets, kicks, resell' },
  { value: 'Luxe', icon: '💎', desc: 'Montres, maroquinerie' },
  { value: 'Électronique', icon: '📱', desc: 'Apple, gaming, tech' },
  { value: 'Autre', icon: '📦', desc: 'Vêtements, streetwear…' },
]

const GOALS = [
  { value: 'Démarrer', desc: 'Je débute dans la revente et je veux structurer mes ventes' },
  { value: 'Scaler', desc: 'Je veux augmenter mon volume et mes bénéfices rapidement' },
  { value: 'Maximiser les marges', desc: 'Je cherche à optimiser chaque transaction' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<FormData>({
    businessName: '', currency: 'CHF',
    category: '', customCategory: '',
    goal: '', capital: '',
  })

  useEffect(() => {
    if (localStorage.getItem('risly_onboarding')) router.replace('/dashboard')
  }, [router])

  function next() {
    setStep(s => ((s as number) + 1) as Step)
  }

  function submit(skipCapital = false) {
    setStep('loading')
    const finalCategory = data.customCategory.trim() || data.category || 'Autre'
    localStorage.setItem('risly_onboarding', JSON.stringify({
      businessName: data.businessName,
      currency: data.currency,
      category: finalCategory,
      goal: data.goal,
      capital: skipCapital ? 0 : (parseFloat(data.capital) || 0),
    }))
    setTimeout(() => router.push('/dashboard'), 2400)
  }

  const progress = step === 'loading' ? 100 : ((step as number) / 4) * 100
  const canNextStep2 = data.category !== '' || data.customCategory.trim() !== ''

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-600/6 blur-[130px]" />
        </div>
        <div className="relative z-10 text-center space-y-5">
          <div className="flex items-center justify-center mx-auto">
            <RislyMark size={64} />
          </div>
          <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-lg font-semibold text-white">Configuration de ton espace Risly en cours...</p>
            <p className="text-sm text-gray-500 mt-1">Personnalisation de ton tableau de bord</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px]" />
        <div className="grid-bg absolute inset-0" />
      </div>

      <div className="w-full max-w-md relative z-10">

        <div className="mb-10">
          <LogoFull size="md" />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Configuration du compte</span>
            <span>{step as number} / 4</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1 — Business name + devise */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black mb-1">Quel est le nom de ton business ?</h1>
              <p className="text-sm text-gray-500">Et quelle devise tu utilises</p>
            </div>

            <input
              autoFocus
              type="text"
              value={data.businessName}
              onChange={e => setData(d => ({ ...d, businessName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && data.businessName.trim() && next()}
              placeholder="ex : SnkrFlip, TechResell, LuxFlip…"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors"
            />

            {/* Currency toggle */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Devise principale</p>
              <div className="flex gap-2">
                {(['CHF', 'EUR'] as Currency[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setData(d => ({ ...d, currency: c }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      data.currency === c
                        ? 'border-emerald-600/60 bg-emerald-500/[0.08] text-emerald-400'
                        : 'border-white/[0.07] bg-white/[0.02] text-gray-400 hover:border-white/[0.14]'
                    }`}
                  >
                    <span>{c === 'CHF' ? '🇨🇭' : '🇪🇺'}</span>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={next}
              disabled={!data.businessName.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all"
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Step 2 — Category */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-black mb-1">Quelle catégorie tu revends principalement ?</h1>
              <p className="text-sm text-gray-500">Choisis parmi les options ou écris la tienne</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setData(d => ({ ...d, category: c.value as FormData['category'], customCategory: '' }))}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all ${
                    data.category === c.value && !data.customCategory
                      ? 'border-emerald-600/60 bg-emerald-500/[0.08]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]'
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{c.value}</p>
                    <p className="text-xs text-gray-600">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom category input */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Ou écris ta propre catégorie :</p>
              <input
                type="text"
                value={data.customCategory}
                onChange={e => setData(d => ({ ...d, customCategory: e.target.value, category: '' }))}
                placeholder="ex : Cartes Pokémon, Montres vintage, NFT…"
                className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  data.customCategory.trim()
                    ? 'border-emerald-600/60 bg-emerald-500/[0.04]'
                    : 'border-white/10 focus:border-emerald-600'
                }`}
              />
            </div>

            <button
              onClick={next}
              disabled={!canNextStep2}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all"
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Step 3 — Goal */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black mb-1">Quel est ton objectif principal ?</h1>
              <p className="text-sm text-gray-500">On adapte ton expérience en conséquence</p>
            </div>
            <div className="space-y-3">
              {GOALS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setData(d => ({ ...d, goal: g.value as FormData['goal'] }))}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    data.goal === g.value
                      ? 'border-emerald-600/60 bg-emerald-500/[0.08]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    data.goal === g.value ? 'border-emerald-600 bg-emerald-600' : 'border-gray-700'
                  }`}>
                    {data.goal === g.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{g.value}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={!data.goal}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all"
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Step 4 — Capital */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black mb-1">Quel est ton capital investi ?</h1>
              <p className="text-sm text-gray-500">Montant total disponible pour tes achats, en {data.currency}</p>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">{data.currency}</span>
              <input
                autoFocus
                type="number"
                min="0"
                step="100"
                value={data.capital}
                onChange={e => setData(d => ({ ...d, capital: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && data.capital && submit()}
                placeholder="0"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-16 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
            <button
              onClick={() => submit()}
              disabled={!data.capital}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20"
            >
              Lancer mon espace Risly ✓
            </button>
            <button
              onClick={() => submit(true)}
              className="w-full text-center text-sm text-gray-700 hover:text-gray-400 py-1 transition-colors"
            >
              Passer cette étape
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
