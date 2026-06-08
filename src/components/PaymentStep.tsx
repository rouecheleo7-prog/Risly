'use client'

import { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { Shield, Lock } from 'lucide-react'
import { VisaLogo, MastercardLogo, ApplePayLogo, TwintLogo } from './PaymentLogos'

interface Props {
  clientSecret: string
  onSuccess: () => void
  onBack: () => void
  planName: string
  planPrice: string
}

function CheckoutForm({ onSuccess, onBack, planName, planPrice }: Omit<Props, 'clientSecret'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Erreur de paiement')
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: `${window.location.origin}/onboarding` },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Erreur de paiement')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Plan résumé */}
      <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Plan {planName}</p>
          <p className="text-xs text-emerald-400 mt-0.5">✓ 3 jours gratuits · Aucun débit maintenant</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-white">{planPrice}</p>
          <p className="text-xs text-gray-500">après l&apos;essai</p>
        </div>
      </div>

      {/* Logos des méthodes acceptées */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 shrink-0">Accepté :</span>
        <div className="flex items-center gap-2 flex-wrap">
          <VisaLogo className="h-6 w-auto rounded" />
          <MastercardLogo className="h-6 w-auto rounded" />
          <ApplePayLogo className="h-6 w-auto rounded" />
          <TwintLogo className="h-6 w-auto rounded" />
        </div>
      </div>

      {/* Stripe Payment Element — Apple Pay, Twint, carte auto */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            wallets: { applePay: 'auto', googlePay: 'never' },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-800/30 rounded-xl p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-600">
        <Lock size={11} className="text-emerald-700 shrink-0" />
        <span>Paiement sécurisé par Stripe · Aucun débit avant la fin de l&apos;essai</span>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-4 rounded-xl font-black text-base transition-all shadow-lg shadow-emerald-900/30"
      >
        {loading ? 'Vérification...' : '✓ Démarrer mon essai gratuit de 3 jours'}
      </button>

      <button type="button" onClick={onBack} className="w-full text-center text-sm text-gray-600 hover:text-gray-400 transition-colors py-1">
        ← Retour
      </button>
    </form>
  )
}

export default function PaymentStep({ clientSecret, onSuccess, onBack, planName, planPrice }: Props) {
  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#059669',
      colorBackground: '#0d0d0d',
      colorText: '#f5f5f5',
      colorDanger: '#ef4444',
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      borderRadius: '10px',
    },
  }

  return (
    <Elements stripe={getStripe()} options={{ clientSecret, appearance }}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={14} className="text-emerald-500" />
          <h2 className="font-bold text-lg">Sécurisez votre accès</h2>
        </div>
        <p className="text-xs text-gray-500">Aucun débit pendant 3 jours. Annulez quand vous voulez.</p>
      </div>
      <CheckoutForm onSuccess={onSuccess} onBack={onBack} planName={planName} planPrice={planPrice} />
    </Elements>
  )
}
