'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Users, Stamp, Gift, Loader2 } from 'lucide-react'

type Merchant = {
  id: string
  slug: string
  business_name: string
  stamps_required: number
}

type CustomerRow = {
  id: string
  phone: string
  stamps: number
  last_stamp_at: string | null
  reward_code: string | null
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
    ' ' + d.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })
}

export default function DashboardHome() {
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [stats, setStats] = useState({ totalCustomers: 0, stampsToday: 0, rewardsRedeemed: 0 })
  const [loading, setLoading] = useState(true)

  const [stampPhone, setStampPhone] = useState('')
  const [stampMsg, setStampMsg] = useState('')
  const [stampLoading, setStampLoading] = useState(false)

  const [rewardPhone, setRewardPhone] = useState('')
  const [rewardMsg, setRewardMsg] = useState('')
  const [rewardLoading, setRewardLoading] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: merchantRow } = await supabase
      .from('loyalty_merchants')
      .select('id, slug, business_name, stamps_required')
      .eq('id', user.id)
      .maybeSingle()

    if (!merchantRow) { setLoading(false); return }
    setMerchant(merchantRow)

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [{ count: totalCustomers }, { count: stampsToday }, { count: rewardsRedeemed }, { data: customersData }] = await Promise.all([
      supabase.from('loyalty_customers').select('*', { count: 'exact', head: true }).eq('merchant_id', user.id),
      supabase.from('loyalty_stamp_events').select('*', { count: 'exact', head: true }).eq('merchant_id', user.id).gte('at', startOfDay.toISOString()),
      supabase.from('loyalty_redemptions').select('*', { count: 'exact', head: true }).eq('merchant_id', user.id),
      supabase.from('loyalty_customers').select('id, phone, stamps, last_stamp_at, reward_code').eq('merchant_id', user.id).order('stamps', { ascending: false }),
    ])

    setStats({ totalCustomers: totalCustomers ?? 0, stampsToday: stampsToday ?? 0, rewardsRedeemed: rewardsRedeemed ?? 0 })
    setCustomers(customersData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleStamp() {
    setStampMsg('')
    if (stampPhone.replace(/[^\d]/g, '').length < 8) { setStampMsg('Numéro invalide.'); return }
    setStampLoading(true)
    try {
      const res = await fetch('/api/loyalty/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: stampPhone }),
      })
      const data = await res.json()
      if (!res.ok) { setStampMsg(data.error ?? 'Erreur'); return }
      if (data.status === 'reward-pending') {
        setStampMsg('Ce client a déjà une récompense en attente de validation.')
      } else {
        setStampPhone('')
        await load()
      }
    } finally {
      setStampLoading(false)
    }
  }

  async function handleRedeem() {
    setRewardMsg('')
    if (rewardPhone.replace(/[^\d]/g, '').length < 8) { setRewardMsg('Numéro invalide.'); return }
    setRewardLoading(true)
    try {
      const res = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: rewardPhone }),
      })
      const data = await res.json()
      if (!res.ok) { setRewardMsg(data.error ?? 'Erreur'); return }
      setRewardPhone('')
      await load()
    } finally {
      setRewardLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-gray-600" size={28} />
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="p-8">
        <p style={{ color: 'var(--text-secondary)' }}>Aucun commerce n&apos;est lié à ce compte. Contactez Risly pour finaliser votre configuration.</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{merchant.business_name}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Programme de fidélité</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Clients inscrits', value: stats.totalCustomers, icon: Users },
          { label: 'Tampons aujourd’hui', value: stats.stampsToday, icon: Stamp },
          { label: 'Récompenses débloquées', value: stats.rewardsRedeemed, icon: Gift },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
            <s.icon size={18} className="text-emerald-400 mb-3" />
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Valider un tampon</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Le client vous montre son téléphone, vous entrez son numéro.</p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={stampPhone}
              onChange={(e) => setStampPhone(e.target.value)}
              placeholder="Numéro du client"
              className="flex-1 rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'var(--surface-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            <button onClick={handleStamp} disabled={stampLoading} className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-emerald-600 text-white disabled:opacity-60">
              Ajouter
            </button>
          </div>
          {stampMsg && <p className="text-xs text-red-400 mt-2">{stampMsg}</p>}
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Valider une récompense</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Vérifiez le code affiché par le client avant de valider.</p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={rewardPhone}
              onChange={(e) => setRewardPhone(e.target.value)}
              placeholder="Numéro du client"
              className="flex-1 rounded-xl px-3 py-2.5 text-sm"
              style={{ background: 'var(--surface-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            <button onClick={handleRedeem} disabled={rewardLoading} className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-emerald-600 text-white disabled:opacity-60">
              Valider
            </button>
          </div>
          {rewardMsg && <p className="text-xs text-red-400 mt-2">{rewardMsg}</p>}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Clients ({customers.length})</h2>
        <div className="rounded-2xl overflow-x-auto" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Téléphone', 'Tampons', 'Dernier tampon', 'Récompense'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center" style={{ color: 'var(--text-secondary)' }}>Aucun client pour le moment</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{c.phone}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{c.stamps} / {merchant.stamps_required}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{formatDate(c.last_stamp_at)}</td>
                  <td className="px-4 py-3">
                    {c.reward_code ? (
                      <span className="inline-block rounded-full px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-400">{c.reward_code}</span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
