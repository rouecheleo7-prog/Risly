'use client'

import { useState } from 'react'
import { useApp } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { Calculator, Target, TrendingUp, Plus, Trash2, AlertTriangle } from 'lucide-react'

interface Scenario {
  id: string
  label: string
  buyPrice: number
  customs: number
  shipping: number
  taxes: number
  sellPrice: number
  quantity: number
}

function calc(s: Scenario) {
  const totalCost = (s.buyPrice + s.customs + s.shipping + s.taxes) * s.quantity
  const revenue = s.sellPrice * s.quantity
  const net = revenue - totalCost
  const margin = revenue > 0 ? Math.round((net / revenue) * 100) : 0
  const roi = totalCost > 0 ? Math.round((net / totalCost) * 100) : 0
  return { totalCost, revenue, net, margin, roi }
}

const emptyScenario = (id: string, label: string): Scenario => ({
  id, label,
  buyPrice: 0, customs: 0, shipping: 0, taxes: 0,
  sellPrice: 0, quantity: 1,
})

export default function CalculateurPage() {
  const { currency } = useApp()

  // ── Simulateur principal ──
  const [sim, setSim] = useState<Scenario>(emptyScenario('main', 'Mon article'))
  const [showFees, setShowFees] = useState(false)

  // ── Seuil de rentabilité ──
  const [targetProfit, setTargetProfit] = useState('')
  const [thresholdBuy, setThresholdBuy] = useState('')
  const [thresholdFees, setThresholdFees] = useState('')

  // ── Comparateur ──
  const [scenarios, setScenarios] = useState<Scenario[]>([
    emptyScenario('s1', 'Scénario A'),
    emptyScenario('s2', 'Scénario B'),
  ])

  const simResult = calc(sim)

  // Seuil : prix de vente minimum pour atteindre targetProfit
  const costBase = (parseFloat(thresholdBuy) || 0) + (parseFloat(thresholdFees) || 0)
  const minSellPrice = costBase + (parseFloat(targetProfit) || 0)
  const minMargin = minSellPrice > 0 ? Math.round(((parseFloat(targetProfit) || 0) / minSellPrice) * 100) : 0

  function updateSim(field: keyof Scenario, value: string) {
    setSim(p => ({ ...p, [field]: field === 'label' ? value : parseFloat(value) || 0 }))
  }

  function updateScenario(id: string, field: keyof Scenario, value: string) {
    setScenarios(prev => prev.map(s => s.id === id
      ? { ...s, [field]: field === 'label' ? value : parseFloat(value) || 0 }
      : s
    ))
  }

  function addScenario() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const id = `s${Date.now()}`
    const label = `Scénario ${letters[scenarios.length] ?? scenarios.length + 1}`
    setScenarios(p => [...p, emptyScenario(id, label)])
  }

  const marginColor = (m: number) =>
    m < 0 ? 'text-red-400' : m < 10 ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Outils</p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Calculateur de rentabilité</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ── SIMULATEUR ── */}
        <div className="glass-dashboard rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Calculator size={15} className="text-emerald-400" />
            </div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Simulateur de marge</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nom de l&apos;article</label>
              <input value={sim.label} onChange={e => updateSim('label', e.target.value)} className="input-field" placeholder="ex : Air Jordan 1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Prix d&apos;achat ({currency})</label>
                <input type="number" min="0" step="0.01" value={sim.buyPrice || ''} onChange={e => updateSim('buyPrice', e.target.value)} className="input-field" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Quantité</label>
                <input type="number" min="1" value={sim.quantity || ''} onChange={e => updateSim('quantity', e.target.value)} className="input-field" placeholder="1" />
              </div>
            </div>

            <button type="button" onClick={() => setShowFees(!showFees)} className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
              {showFees ? '− Masquer les frais' : '+ Frais douane, livraison, taxes'}
            </button>

            {showFees && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Douanes', field: 'customs' as const },
                  { label: 'Livraison', field: 'shipping' as const },
                  { label: 'Taxes', field: 'taxes' as const },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium mb-1.5 text-amber-500/80">{label}</label>
                    <input type="number" min="0" step="0.01" value={sim[field] || ''} onChange={e => updateSim(field, e.target.value)} className="input-field border-amber-800/20" placeholder="0.00" />
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Prix de vente ({currency})</label>
              <input type="number" min="0" step="0.01" value={sim.sellPrice || ''} onChange={e => updateSim('sellPrice', e.target.value)} className="input-field" placeholder="0.00" />
            </div>
          </div>

          {/* Résultats */}
          <div className={`rounded-2xl p-4 space-y-3 border transition-colors ${simResult.net >= 0 ? 'bg-emerald-500/[0.06] border-emerald-500/15' : 'bg-red-500/[0.06] border-red-500/15'}`}>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Bénéfice net</p>
                <p className={`text-2xl font-black ${simResult.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {simResult.net >= 0 ? '+' : ''}{formatCurrency(simResult.net, currency)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Marge nette</p>
                <p className={`text-2xl font-black ${marginColor(simResult.margin)}`}>{simResult.margin}%</p>
              </div>
            </div>
            <div className="border-t border-white/[0.06] pt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p style={{ color: 'var(--text-muted)' }}>Coût total</p>
                <p className="font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(simResult.totalCost, currency)}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)' }}>CA</p>
                <p className="font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(simResult.revenue, currency)}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)' }}>ROI</p>
                <p className={`font-semibold mt-0.5 ${simResult.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{simResult.roi}%</p>
              </div>
            </div>
            {simResult.net < 0 && (
              <div className="flex items-center gap-2 text-xs text-red-400">
                <AlertTriangle size={12} /> Vous perdez de l&apos;argent sur cette vente.
              </div>
            )}
            {simResult.margin > 0 && simResult.margin < 10 && (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <AlertTriangle size={12} /> Marge faible — vérifiez si c&apos;est rentable après vos charges.
              </div>
            )}
          </div>
        </div>

        {/* ── SEUIL DE RENTABILITÉ ── */}
        <div className="glass-dashboard rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Target size={15} className="text-purple-400" />
            </div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Seuil de rentabilité</h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Trouvez le prix de vente minimum pour atteindre votre bénéfice cible.</p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Prix d&apos;achat ({currency})</label>
              <input type="number" min="0" step="0.01" value={thresholdBuy} onChange={e => setThresholdBuy(e.target.value)} className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Total frais (douanes + livraison + taxes)</label>
              <input type="number" min="0" step="0.01" value={thresholdFees} onChange={e => setThresholdFees(e.target.value)} className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-emerald-500">Bénéfice visé ({currency})</label>
              <input type="number" min="0" step="0.01" value={targetProfit} onChange={e => setTargetProfit(e.target.value)} className="input-field border-emerald-800/30" placeholder="ex : 50.00" />
            </div>
          </div>

          {minSellPrice > 0 && (
            <div className="rounded-2xl p-4 bg-purple-500/[0.06] border border-purple-500/15 space-y-3">
              <div className="text-center">
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Prix de vente minimum</p>
                <p className="text-3xl font-black text-purple-400">{formatCurrency(minSellPrice, currency)}</p>
              </div>
              <div className="border-t border-white/[0.06] pt-3 grid grid-cols-2 gap-3 text-center text-xs">
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Coût total</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(costBase, currency)}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Marge min.</p>
                  <p className="font-semibold mt-0.5 text-purple-400">{minMargin}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Barre progression marge */}
          {simResult.sellPrice > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Marge actuelle</span>
                <span className={marginColor(simResult.margin)}>{simResult.margin}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${simResult.margin < 0 ? 'bg-red-500' : simResult.margin < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, simResult.margin))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>0%</span><span>10% (min)</span><span>50%</span><span>100%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── COMPARATEUR DE SCÉNARIOS ── */}
      <div className="glass-dashboard rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp size={15} className="text-blue-400" />
            </div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Comparateur de scénarios</h2>
          </div>
          {scenarios.length < 5 && (
            <button onClick={addScenario} className="flex items-center gap-1.5 text-xs bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] px-3 py-1.5 rounded-lg transition-all" style={{ color: 'var(--text-secondary)' }}>
              <Plus size={12} /> Ajouter
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((s, i) => {
            const r = calc(s)
            const palette = [
              { bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)', text: '#10b981' },
              { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa' },
              { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', text: '#a78bfa' },
              { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', text: '#fb923c' },
              { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', text: '#f472b6' },
            ]
            const pal = palette[i % palette.length]
            return (
              <div key={s.id} className="rounded-xl p-4 space-y-3 border" style={{ background: 'var(--surface-input)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <input
                    value={s.label}
                    onChange={e => updateScenario(s.id, 'label', e.target.value)}
                    className="text-sm font-semibold bg-transparent outline-none w-full"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  {scenarios.length > 2 && (
                    <button onClick={() => setScenarios(p => p.filter(x => x.id !== s.id))} className="text-gray-600 hover:text-red-400 transition-colors ml-2">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {[
                    { label: `Achat (${currency})`, field: 'buyPrice' as const },
                    { label: `Vente (${currency})`, field: 'sellPrice' as const },
                    { label: 'Quantité', field: 'quantity' as const },
                  ].map(({ label, field }) => (
                    <div key={field} className="flex items-center gap-2">
                      <span className="text-xs w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <input
                        type="number" min="0" step="0.01"
                        value={s[field] || ''}
                        onChange={e => updateScenario(s.id, field, e.target.value)}
                        className="input-field py-1.5 text-xs"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: pal.bg, border: `1px solid ${pal.border}` }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Bénéfice net</p>
                  <p className="text-lg font-black" style={{ color: pal.text }}>
                    {r.net >= 0 ? '+' : ''}{formatCurrency(r.net, currency)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: pal.text }}>Marge {r.margin}% · ROI {r.roi}%</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Meilleur scénario */}
        {scenarios.some(s => calc(s).net > 0) && (
          <div className="rounded-xl px-4 py-3 bg-emerald-500/[0.06] border border-emerald-500/15 text-sm flex items-center gap-2">
            <span className="text-emerald-400">🏆</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Meilleur scénario : <span className="font-bold text-emerald-400">
                {scenarios.reduce((best, s) => calc(s).net > calc(best).net ? s : best).label}
              </span>
              {' '}avec{' '}
              <span className="font-bold text-emerald-400">
                {formatCurrency(Math.max(...scenarios.map(s => calc(s).net)), currency)}
              </span>
              {' '}de bénéfice net
            </span>
          </div>
        )}
      </div>

    </div>
  )
}
