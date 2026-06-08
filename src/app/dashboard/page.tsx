'use client'

import { useState, useEffect } from 'react'
import { useApp, netProfit } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, ArrowUpRight, ArrowDownRight, ShoppingBag, Percent, ChevronRight } from 'lucide-react'
import SalesChart from '@/components/SalesChart'
import GoalCard from '@/components/GoalCard'
import DropsCalendar from '@/components/DropsCalendar'
import Onboarding from '@/components/Onboarding'
import { DashboardSkeleton } from '@/components/Skeleton'
import Link from 'next/link'

type Period = '7j' | '30j' | '3m' | 'tout'

function filterByPeriod(sales: ReturnType<typeof useApp>['sales'], period: Period) {
  if (period === 'tout') return sales
  const now = new Date()
  const cutoff = new Date()
  if (period === '7j') cutoff.setDate(now.getDate() - 7)
  else if (period === '30j') cutoff.setDate(now.getDate() - 30)
  else cutoff.setMonth(now.getMonth() - 3)
  return sales.filter(s => s.date >= cutoff.toISOString().split('T')[0])
}

export default function DashboardPage() {
  const { sales, goals, currency, onboarding } = useApp()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30j')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <DashboardSkeleton />

  const filtered = filterByPeriod(sales, period)

  const totalRevenue = filtered.reduce((sum, s) => sum + s.sellPrice * s.quantity, 0)
  const totalProfit  = filtered.reduce((sum, s) => sum + netProfit(s) * s.quantity, 0)
  const avgMargin    = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0
  const totalSales   = filtered.reduce((sum, s) => sum + s.quantity, 0)

  const PERIODS: { value: Period; label: string }[] = [
    { value: '7j', label: '7j' },
    { value: '30j', label: '30j' },
    { value: '3m', label: '3m' },
    { value: 'tout', label: 'Tout' },
  ]

  const stats = [
    {
      label: 'Bénéfice net',
      value: formatCurrency(totalProfit, currency),
      change: '+18%', up: true,
      accent: '#10b981',
      bg: 'rgba(16,185,129,0.08)',
      icon: TrendingUp,
    },
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(totalRevenue, currency),
      change: '+22%', up: true,
      accent: '#60a5fa',
      bg: 'rgba(96,165,250,0.08)',
      icon: ShoppingBag,
    },
    {
      label: 'Articles vendus',
      value: `${totalSales}`,
      change: '+3', up: true,
      accent: '#a78bfa',
      bg: 'rgba(167,139,250,0.08)',
      icon: ShoppingBag,
    },
    {
      label: 'Marge moyenne',
      value: `${avgMargin}%`,
      change: '-2%', up: false,
      accent: '#f97316',
      bg: 'rgba(249,115,22,0.08)',
      icon: Percent,
    },
  ]

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">Tableau de bord</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {onboarding?.businessName ? `Bonjour, ${onboarding.businessName} 👋` : 'Bonjour 👋'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Period filter */}
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
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Plan Pro
          </div>
        </div>
      </div>

      {/* Onboarding — shown only when no sales */}
      {sales.length === 0 && <Onboarding />}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-stat rounded-2xl p-4 md:p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs text-gray-500 font-medium leading-snug">{stat.label}</p>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                <stat.icon size={13} strokeWidth={1.75} style={{ color: stat.accent }} />
              </div>
            </div>
            <p className="text-xl font-semibold tracking-tight" style={{ color: stat.accent }}>
              {stat.value}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              {stat.up
                ? <ArrowUpRight size={11} className="text-emerald-500" strokeWidth={2} />
                : <ArrowDownRight size={11} className="text-red-400" strokeWidth={2} />
              }
              <p className={`text-xs font-medium ${stat.up ? 'text-emerald-500' : 'text-red-400'}`}>
                {stat.change} ce mois
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-dashboard rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Évolution des bénéfices</h2>
            <p className="text-xs text-gray-600 mt-0.5">30 derniers jours</p>
          </div>
          <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            Juin 2026
          </span>
        </div>
        <SalesChart />
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Objectifs */}
        <div className="glass-dashboard rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Objectifs du mois</h2>
            <Link href="/dashboard/objectifs" className="flex items-center gap-0.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors group">
              Gérer <ChevronRight size={12} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="space-y-5">
            {goals.slice(0, 3).map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Dernières ventes */}
        <div className="glass-dashboard rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Dernières ventes</h2>
            <Link href="/dashboard/ventes" className="flex items-center gap-0.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors group">
              Voir tout <ChevronRight size={12} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="space-y-1">
            {sales.slice(0, 5).map(sale => {
              const profit = netProfit(sale) * sale.quantity
              return (
                <div key={sale.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">{sale.product}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{sale.date} · ×{sale.quantity}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className={`text-sm font-semibold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {profit >= 0 ? '+' : ''}{formatCurrency(profit, currency)}
                    </p>
                    <p className="text-xs text-gray-600">{formatCurrency(sale.sellPrice, currency)}</p>
                  </div>
                </div>
              )
            })}
            {sales.length === 0 && (
              <p className="text-xs text-gray-700 text-center py-6">Aucune vente enregistrée</p>
            )}
          </div>
        </div>

        {/* Drops Calendar */}
        <DropsCalendar />

      </div>
    </div>
  )
}
