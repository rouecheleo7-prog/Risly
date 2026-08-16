'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

type Props = {
  slug: string
  businessName: string
  logoUrl: string | null
  primaryColor: string
  stampsRequired: number
  rewardText: string
}

type Screen =
  | { view: 'form' }
  | { view: 'card'; stamps: number; animateIndex?: number; message?: { kind: 'info' | 'warn' | 'success'; text: string } }
  | { view: 'reward'; rewardCode: string }

export default function LoyaltyCardClient({ slug, businessName, logoUrl, primaryColor, stampsRequired, rewardText }: Props) {
  const [screen, setScreen] = useState<Screen>({ view: 'form' })
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const accentStyle = { '--accent': primaryColor } as React.CSSProperties

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (phone.replace(/[^\d]/g, '').length < 8) {
      setError('Merci d\'entrer un numéro de téléphone valide.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/loyalty/${slug}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue, réessayez.')
        return
      }

      if (data.status === 'created') {
        setScreen({ view: 'card', stamps: 0, message: { kind: 'info', text: 'Bienvenue ! Votre carte a été créée. Revenez après votre prochain achat pour votre premier tampon.' } })
      } else if (data.status === 'reward-pending' || data.status === 'reward-unlocked') {
        setScreen({ view: 'reward', rewardCode: data.rewardCode })
      } else if (data.status === 'cooldown') {
        setScreen({ view: 'card', stamps: data.stamps, message: { kind: 'warn', text: `Vous avez déjà reçu un tampon récemment. Revenez dans environ ${data.hoursRemaining}h.` } })
      } else {
        setScreen({ view: 'card', stamps: data.stamps, animateIndex: data.stamps - 1, message: { kind: 'success', text: 'Tampon ajouté, merci de votre fidélité !' } })
      }
    } catch {
      setError('Une erreur est survenue, réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[100dvh] bg-slate-50 flex flex-col items-center px-5 py-10" style={accentStyle}>
      <div className="w-full max-w-sm">
        <header className="flex flex-col items-center gap-3 text-center mb-8">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={businessName} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
          ) : null}
          <h1 className="text-xl font-semibold text-slate-950">{businessName}</h1>
          <p className="text-sm text-slate-500">Votre carte de fidélité digitale</p>
        </header>

        <AnimatePresence mode="wait">
          {screen.view === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-1.5">Votre numéro de téléphone</label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="079 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                    required
                  />
                  {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl px-5 py-3.5 text-white font-semibold transition active:scale-[0.97] disabled:opacity-60"
                  style={{ background: primaryColor }}
                >
                  {loading ? 'Un instant…' : 'Voir ma carte'}
                </button>
              </form>
            </motion.div>
          )}

          {screen.view === 'card' && (
            <motion.div key="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              {screen.message && (
                <div
                  className={
                    'mb-5 rounded-xl px-4 py-3 text-sm ' +
                    (screen.message.kind === 'info' ? 'bg-indigo-50 text-indigo-800' :
                     screen.message.kind === 'warn' ? 'bg-amber-50 text-amber-800' :
                     'bg-emerald-50 text-emerald-800')
                  }
                >
                  {screen.message.text}
                </div>
              )}

              <div className="grid grid-cols-5 gap-2.5 mb-4">
                {Array.from({ length: stampsRequired }).map((_, i) => {
                  const filled = i < screen.stamps
                  const justAdded = i === screen.animateIndex
                  return (
                    <motion.div
                      key={i}
                      initial={justAdded ? { scale: 0.3 } : false}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                      className="aspect-square rounded-full border-2 flex items-center justify-center"
                      style={filled ? { background: primaryColor, borderColor: primaryColor } : { borderStyle: 'dashed', borderColor: '#e2e8f0' }}
                    >
                      {filled && <Check className="w-1/2 h-1/2 text-white" strokeWidth={3} />}
                    </motion.div>
                  )
                })}
              </div>
              <p className="text-center text-sm text-slate-500 mb-5">
                {screen.stamps} / {stampsRequired} tampons
                {screen.stamps < stampsRequired ? ` · encore ${stampsRequired - screen.stamps} avant votre récompense` : ''}
              </p>
              <button type="button" onClick={() => setScreen({ view: 'form' })} className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
                Ce n&apos;est pas mon numéro
              </button>
            </motion.div>
          )}

          {screen.view === 'reward' && (
            <motion.div key="reward" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm text-center">
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-lg font-semibold text-slate-950 mb-1">Bravo, récompense débloquée !</h2>
              <p className="text-sm text-slate-500 mb-5">{rewardText}</p>
              <p className="text-xs text-slate-500 mb-2">Montrez ce code au commerçant :</p>
              <div className="rounded-xl border border-dashed px-4 py-4 font-mono text-2xl font-bold tracking-[0.3em] mb-5" style={{ borderColor: primaryColor, color: primaryColor }}>
                {screen.rewardCode}
              </div>
              <button type="button" onClick={() => setScreen({ view: 'form' })} className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
                Ce n&apos;est pas mon numéro
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
