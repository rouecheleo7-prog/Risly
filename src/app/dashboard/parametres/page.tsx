'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp, Currency } from '@/lib/store'
import { createClient } from '@/lib/supabase'
import { Check, User, Bell, CreditCard, Shield, ChevronRight, AlertTriangle, LogOut } from 'lucide-react'

export default function ParametresPage() {
  const router = useRouter()
  const { currency, setCurrency, marginAlertThreshold, setMarginAlertThreshold } = useApp()
  const [thresholdInput, setThresholdInput] = useState(String(marginAlertThreshold))
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? '')
        setFullName(user.user_metadata?.full_name ?? '')
      }
    })
  }, [])

  async function saveProfile() {
    setProfileLoading(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ email, data: { full_name: fullName } })
    setProfileLoading(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  async function sendPasswordReset() {
    setPwLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setPwLoading(false)
    setPwMsg('Email envoyé ! Vérifie ta boîte mail.')
    setTimeout(() => setPwMsg(''), 4000)
  }

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const currencies: { value: Currency; label: string; flag: string; sub: string }[] = [
    { value: 'CHF', label: 'Franc suisse', flag: '🇨🇭', sub: 'CHF · Marché suisse' },
    { value: 'EUR', label: 'Euro', flag: '🇪🇺', sub: 'EUR · Marché européen' },
  ]

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-5 max-w-2xl">

      <div>
        <p className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">Paramètres</p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Votre compte</h1>
      </div>

      {/* Profile */}
      <section className="glass-dashboard rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <User size={13} strokeWidth={1.75} className="text-gray-400" />
          </div>
          <h2 className="text-sm font-semibold">Profil</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nom complet</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600/50 transition-colors"
            />
          </div>
          <button
            onClick={saveProfile}
            disabled={profileLoading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-900/20 flex items-center gap-2"
          >
            {profileSaved ? <><Check size={14} /> Sauvegardé</> : profileLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </section>

      {/* Currency */}
      <section className="glass-dashboard rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-sm">
            💱
          </div>
          <h2 className="text-sm font-semibold">Devise d&apos;affichage</h2>
        </div>
        <p className="text-xs text-gray-600 mb-4">Changeable à tout moment. S&apos;applique partout dans l&apos;app.</p>
        <div className="grid grid-cols-2 gap-3">
          {currencies.map(c => (
            <button
              key={c.value}
              onClick={() => setCurrency(c.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                currency === c.value
                  ? 'border-emerald-600/40 bg-emerald-500/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
              }`}
            >
              <span className="text-2xl">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="text-xs text-gray-600">{c.sub}</p>
              </div>
              {currency === c.value && <Check size={13} strokeWidth={2.5} className="text-emerald-400 shrink-0" />}
            </button>
          ))}
        </div>
      </section>

      {/* Margin Alert */}
      <section className="glass-dashboard rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
            <AlertTriangle size={13} strokeWidth={1.75} className="text-amber-400" />
          </div>
          <h2 className="text-sm font-semibold">Alerte de marge faible</h2>
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Un indicateur orange apparaît sur chaque vente dont la marge est inférieure à ce seuil.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="range" min="1" max="50"
              value={thresholdInput}
              onChange={e => setThresholdInput(e.target.value)}
              onMouseUp={() => setMarginAlertThreshold(Number(thresholdInput))}
              onTouchEnd={() => setMarginAlertThreshold(Number(thresholdInput))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-700 mt-1">
              <span>1%</span><span>25%</span><span>50%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/[0.08] border border-amber-500/15 rounded-xl px-4 py-2.5 min-w-[72px] justify-center">
            <span className="text-amber-400 font-bold text-base">{thresholdInput}</span>
            <span className="text-amber-600 text-xs font-medium">%</span>
          </div>
        </div>
        <p className="text-xs text-gray-700 mt-3">
          Toute marge en dessous de <span className="text-amber-400 font-semibold">{thresholdInput}%</span> déclenche l&apos;alerte.
        </p>
      </section>

      {/* Notifications */}
      <section className="glass-dashboard rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <Bell size={13} strokeWidth={1.75} className="text-gray-400" />
          </div>
          <h2 className="text-sm font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Récapitulatif hebdomadaire', desc: 'Bilan de vos ventes chaque lundi matin', on: true },
            { label: 'Objectif atteint', desc: 'Notification quand un objectif est complété', on: true },
            { label: 'Rappel de saisie', desc: 'Rappel quotidien pour enregistrer vos ventes', on: false },
          ].map((n, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{n.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                <input type="checkbox" defaultChecked={n.on} className="sr-only peer" />
                <div className="w-9 h-5 bg-white/[0.08] rounded-full peer peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription */}
      <section className="glass-dashboard rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <CreditCard size={13} strokeWidth={1.75} className="text-gray-400" />
          </div>
          <h2 className="text-sm font-semibold">Abonnement</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-xl mb-4">
          <div>
            <p className="font-semibold text-emerald-400 text-sm">Plan Pro</p>
            <p className="text-xs text-gray-600 mt-0.5">Renouvellement le 8 juillet 2026</p>
          </div>
          <span className="text-sm font-bold">24 CHF/mois</span>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white py-2.5 rounded-xl text-sm font-medium transition-all">
            Changer de plan <ChevronRight size={13} strokeWidth={2} />
          </button>
          <button className="text-red-500/70 hover:text-red-400 text-sm px-4 transition-colors font-medium">
            Annuler
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="glass-dashboard rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <Shield size={13} strokeWidth={1.75} className="text-gray-400" />
          </div>
          <h2 className="text-sm font-semibold">Sécurité</h2>
        </div>
        <button
          onClick={sendPasswordReset}
          disabled={pwLoading}
          className="flex items-center gap-1.5 text-sm text-emerald-500 hover:text-emerald-400 transition-colors font-medium disabled:opacity-50"
        >
          {pwLoading ? 'Envoi...' : 'Changer de mot de passe'} <ChevronRight size={13} strokeWidth={2} />
        </button>
        {pwMsg && <p className="text-xs text-emerald-400 mt-2">{pwMsg}</p>}
      </section>

      {/* Logout */}
      <section className="glass-dashboard rounded-2xl p-5">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
        >
          <LogOut size={14} />
          Se déconnecter
        </button>
      </section>

    </div>
  )
}
