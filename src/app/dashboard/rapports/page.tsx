'use client'

import { useState } from 'react'
import { useApp, netProfit, Sale } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Award, AlertTriangle, BarChart3 } from 'lucide-react'

type Period = '7j' | '30j' | '3m' | 'tout'

const COLORS = ['#10b981', '#60a5fa', '#a78bfa', '#f97316', '#f43f5e', '#facc15']

function filterByPeriod(sales: Sale[], period: Period): Sale[] {
  if (period === 'tout') return sales
  const now = new Date()
  const cutoff = new Date()
  if (period === '7j') cutoff.setDate(now.getDate() - 7)
  else if (period === '30j') cutoff.setDate(now.getDate() - 30)
  else cutoff.setMonth(now.getMonth() - 3)
  const cutoffStr = cutoff.toISOString().split('T')[0]
  return sales.filter(s => s.date >= cutoffStr)
}

export default function RapportsPage() {
  const { sales, currency } = useApp()
  const [period, setPeriod] = useState<Period>('30j')

  const filtered = filterByPeriod(sales, period)

  const byCategory = Object.entries(
    filtered.reduce<Record<string, { revenue: number; profit: number; count: number }>>((acc, s) => {
      const cat = s.category || 'Autre'
      if (!acc[cat]) acc[cat] = { revenue: 0, profit: 0, count: 0 }
      acc[cat].revenue += s.sellPrice * s.quantity
      acc[cat].profit += netProfit(s) * s.quantity
      acc[cat].count += s.quantity
      return acc
    }, {})
  ).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.profit - a.profit)

  const byBrand = Object.entries(
    filtered.reduce<Record<string, { profit: number; count: number }>>((acc, s) => {
      const brand = s.brand || 'Inconnu'
      if (!acc[brand]) acc[brand] = { profit: 0, count: 0 }
      acc[brand].profit += netProfit(s) * s.quantity
      acc[brand].count += s.quantity
      return acc
    }, {})
  ).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.profit - a.profit).slice(0, 6)

  const topProducts = [...filtered]
    .map(s => ({ ...s, totalProfit: netProfit(s) * s.quantity }))
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, 5)

  const withMargin = filtered
    .filter(s => s.sellPrice > 0)
    .map(s => ({ ...s, margin: Math.round((netProfit(s) / s.sellPrice) * 100) }))

  const bestMargin = [...withMargin].sort((a, b) => b.margin - a.margin)[0]
  const worstMargin = [...withMargin].sort((a, b) => a.margin - b.margin)[0]

  const totalRevenue = filtered.reduce((s, x) => s + x.sellPrice * x.quantity, 0)
  const totalProfit = filtered.reduce((s, x) => s + netProfit(x) * x.quantity, 0)
  const avgMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0
  const totalQty = filtered.reduce((s, x) => s + x.quantity, 0)

  const PERIODS: { value: Period; label: string }[] = [
    { value: '7j', label: '7 jours' },
    { value: '30j', label: '30 jours' },
    { value: '3m', label: '3 mois' },
    { value: 'tout', label: 'Tout' },
  ]

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">Analyse</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Rapports</h1>
        </div>
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p.value ? 'bg-white/[0.09] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Bénéfice net', value: formatCurrency(totalProfit, currency), color: 'text-emerald-400', sub: `${filtered.length} ventes` },
          { label: "Chiffre d'affaires", value: formatCurrency(totalRevenue, currency), color: 'text-blue-400', sub: `${totalQty} articles` },
          { label: 'Marge moyenne', value: `${avgMargin}%`, color: avgMargin >= 15 ? 'text-emerald-400' : avgMargin >= 0 ? 'text-amber-400' : 'text-red-400', sub: 'marge nette' },
        ].map(k => (
          <div key={k.label} className="glass-stat rounded-2xl p-4">
            <p className="text-xs text-gray-600 mb-1.5">{k.label}</p>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-700 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-dashboard rounded-2xl p-16 text-center">
          <BarChart3 size={32} strokeWidth={1.5} className="text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Aucune vente sur cette période</p>
        </div>
      ) : (
        <>
          {/* Category bar chart */}
          <div className="glass-dashboard rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-5">Bénéfice net par catégorie</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byCategory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '10px' }}
                  labelStyle={{ color: '#9ca3af', fontSize: 11 }}
                  formatter={(v) => [formatCurrency(Number(v), currency), 'Bénéfice']}
                />
                <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top products + brands */}
          <div className="grid md:grid-cols-2 gap-5">

            <div className="glass-dashboard rounded-2xl p-5">
              <h2 className="text-sm font-semibold mb-4">Top produits</h2>
              <div className="space-y-3">
                {topProducts.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-white/[0.04] text-gray-600'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/80 truncate">{s.product}</p>
                      <div className="h-1 rounded-full bg-white/[0.05] mt-1.5 overflow-hidden">
                        <div
                          className="h-1 rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${Math.max(4, Math.round((s.totalProfit / (topProducts[0]?.totalProfit || 1)) * 100))}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 shrink-0">{formatCurrency(s.totalProfit, currency)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-dashboard rounded-2xl p-5">
              <h2 className="text-sm font-semibold mb-4">Top marques</h2>
              <div className="space-y-3">
                {byBrand.map((b, i) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${COLORS[i % COLORS.length]}18` }}>
                      <span className="text-xs font-bold" style={{ color: COLORS[i % COLORS.length] }}>{b.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{b.name}</p>
                      <p className="text-xs text-gray-700">{b.count} article{b.count > 1 ? 's' : ''}</p>
                    </div>
                    <span className="text-xs font-semibold text-white/60">{formatCurrency(b.profit, currency)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Best / worst margin */}
          {(bestMargin || worstMargin) && (
            <div className="grid md:grid-cols-2 gap-5">
              {bestMargin && (
                <div className="glass-dashboard rounded-2xl p-5 border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Award size={13} strokeWidth={1.75} className="text-emerald-400" />
                    </div>
                    <p className="text-xs font-semibold text-emerald-400">Meilleure marge</p>
                  </div>
                  <p className="text-sm font-semibold text-white/90 truncate">{bestMargin.product}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{bestMargin.brand}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-black text-emerald-400">{bestMargin.margin}%</span>
                    <div>
                      <p className="text-xs text-gray-600">Bénéfice net</p>
                      <p className="text-sm font-semibold text-emerald-400">+{formatCurrency(netProfit(bestMargin) * bestMargin.quantity, currency)}</p>
                    </div>
                  </div>
                </div>
              )}
              {worstMargin && worstMargin.id !== bestMargin?.id && (
                <div className="glass-dashboard rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle size={13} strokeWidth={1.75} className="text-red-400" />
                    </div>
                    <p className="text-xs font-semibold text-red-400">Marge la plus faible</p>
                  </div>
                  <p className="text-sm font-semibold text-white/90 truncate">{worstMargin.product}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{worstMargin.brand}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-2xl font-black ${worstMargin.margin < 0 ? 'text-red-400' : 'text-amber-400'}`}>{worstMargin.margin}%</span>
                    <div>
                      <p className="text-xs text-gray-600">Bénéfice net</p>
                      <p className={`text-sm font-semibold ${netProfit(worstMargin) >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                        {netProfit(worstMargin) >= 0 ? '+' : ''}{formatCurrency(netProfit(worstMargin) * worstMargin.quantity, currency)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
