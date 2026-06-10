'use client'

import { useState, useEffect, useMemo } from 'react'
import { useApp, netProfit } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, ArrowUpRight, ArrowDownRight, ShoppingBag, Percent, ChevronRight, Zap, Target, Package, AlertTriangle, Sparkles } from 'lucide-react'
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

function getWeekBounds(offset = 0) {
  const now = new Date()
  const day = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + 1 + offset * 7)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { monday, sunday }
}

function generateAITips(sales: ReturnType<typeof useApp>['sales'], stock: ReturnType<typeof useApp>['stock'], goals: ReturnType<typeof useApp>['goals']) {
  const tips: { icon: string; text: string; color: string }[] = []

  if (sales.length === 0) {
    tips.push({ icon: '🚀', text: 'Enregistrez votre première vente pour obtenir des conseils personnalisés.', color: '#10b981' })
    return tips
  }

  // Catégorie la plus rentable
  const byCategory: Record<string, { profit: number; count: number }> = {}
  sales.forEach(s => {
    const cat = s.category || 'Autre'
    if (!byCategory[cat]) byCategory[cat] = { profit: 0, count: 0 }
    byCategory[cat].profit += netProfit(s) * s.quantity
    byCategory[cat].count += s.quantity
  })
  const bestCat = Object.entries(byCategory).sort((a, b) => b[1].profit - a[1].profit)[0]
  if (bestCat) tips.push({ icon: '🏆', text: `Votre catégorie la plus rentable est "${bestCat[0]}" avec ${bestCat[1].profit.toFixed(0)} CHF de bénéfice. Continuez sur cette lancée.`, color: '#fbbf24' })

  // Marge faible
  const lowMargin = sales.filter(s => {
    const m = s.sellPrice > 0 ? Math.round(((s.sellPrice - s.buyPrice - s.customs - s.shipping - s.taxes) / s.sellPrice) * 100) : 0
    return m < 10 && m >= 0
  })
  if (lowMargin.length > 0) tips.push({ icon: '⚠️', text: `${lowMargin.length} article${lowMargin.length > 1 ? 's' : ''} ont une marge inférieure à 10%. Revoyez vos prix d'achat.`, color: '#f97316' })

  // Stock qui dort
  if (stock.length > 3) tips.push({ icon: '📦', text: `Vous avez ${stock.length} articles en stock. Pensez à fixer des prix compétitifs pour écouler rapidement.`, color: '#a78bfa' })

  // Objectif proche
  const nearGoal = goals.find(g => g.target > 0 && g.current / g.target >= 0.8 && g.current < g.target)
  if (nearGoal) tips.push({ icon: '🎯', text: `Vous êtes à ${Math.round((nearGoal.current / nearGoal.target) * 100)}% de votre objectif "${nearGoal.label}". Encore un effort !`, color: '#10b981' })

  // Volume récent
  const thisWeek = filterByPeriod(sales, '7j')
  if (thisWeek.length >= 3) tips.push({ icon: '🔥', text: `Belle semaine — ${thisWeek.length} ventes en 7 jours. Profitez de cet élan pour prospecter de nouveaux clients.`, color: '#f87171' })

  return tips.slice(0, 3)
}

export default function DashboardPage() {
  const { sales, goals, stock, drops, currency, onboarding } = useApp()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30j')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <DashboardSkeleton />

  const filtered = filterByPeriod(sales, period)

  // Période actuelle
  const totalRevenue = filtered.reduce((s, x) => s + x.sellPrice * x.quantity, 0)
  const totalProfit = filtered.reduce((s, x) => s + netProfit(x) * x.quantity, 0)
  const avgMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0
  const totalSales = filtered.reduce((s, x) => s + x.quantity, 0)

  // Semaine en cours vs semaine dernière
  const { monday: thisMonday, sunday: thisSunday } = getWeekBounds(0)
  const { monday: lastMonday, sunday: lastSunday } = getWeekBounds(-1)
  const thisWeekSales = sales.filter(s => { const d = new Date(s.date); return d >= thisMonday && d <= thisSunday })
  const lastWeekSales = sales.filter(s => { const d = new Date(s.date); return d >= lastMonday && d <= lastSunday })
  const thisWeekProfit = thisWeekSales.reduce((s, x) => s + netProfit(x) * x.quantity, 0)
  const lastWeekProfit = lastWeekSales.reduce((s, x) => s + netProfit(x) * x.quantity, 0)
  const weekChange = lastWeekProfit > 0 ? Math.round(((thisWeekProfit - lastWeekProfit) / lastWeekProfit) * 100) : null

  // Aujourd'hui
  const today = new Date().toISOString().split('T')[0]
  const todaySales = sales.filter(s => s.date === today)
  const todayProfit = todaySales.reduce((s, x) => s + netProfit(x) * x.quantity, 0)

  // Prochains drops
  const upcomingDrops = drops.filter(d => d.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)

  // IA tips
  const aiTips = generateAITips(sales, stock, goals)

  const PERIODS: { value: Period; label: string }[] = [
    { value: '7j', label: '7j' },
    { value: '30j', label: '30j' },
    { value: '3m', label: '3m' },
    { value: 'tout', label: 'Tout' },
  ]

  const stats = [
    { label: 'Bénéfice net', value: formatCurrency(totalProfit, currency), change: '+18%', up: true, accent: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: TrendingUp },
    { label: "Chiffre d'affaires", value: formatCurrency(totalRevenue, currency), change: '+22%', up: true, accent: '#60a5fa', bg: 'rgba(96,165,250,0.08)', icon: ShoppingBag },
    { label: 'Articles vendus', value: `${totalSales}`, change: '+3', up: true, accent: '#a78bfa', bg: 'rgba(167,139,250,0.08)', icon: ShoppingBag },
    { label: 'Marge moyenne', value: `${avgMargin}%`, change: '-2%', up: false, accent: '#f97316', bg: 'rgba(249,115,22,0.08)', icon: Percent },
  ]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Tableau de bord</p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {greeting()}{onboarding?.businessName ? `, ${onboarding.businessName}` : ''} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-xl p-1 border" style={{ background: 'var(--surface-input)', borderColor: 'var(--border)' }}>
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: period === p.value ? 'rgba(255,255,255,0.09)' : 'transparent', color: period === p.value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sales.length === 0 && <Onboarding />}

      {/* Résumé semaine */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Cette semaine */}
        <div className="rounded-2xl p-4 border sm:col-span-1" style={{ background: 'rgba(5,150,105,0.06)', borderColor: 'rgba(5,150,105,0.2)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Cette semaine</p>
          <p className="text-2xl font-black text-emerald-400">{formatCurrency(thisWeekProfit, currency)}</p>
          {weekChange !== null && (
            <div className="flex items-center gap-1 mt-1">
              {weekChange >= 0
                ? <ArrowUpRight size={12} className="text-emerald-400" />
                : <ArrowDownRight size={12} className="text-red-400" />}
              <p className={`text-xs font-semibold ${weekChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {weekChange >= 0 ? '+' : ''}{weekChange}% vs sem. dernière
              </p>
            </div>
          )}
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{thisWeekSales.length} vente{thisWeekSales.length > 1 ? 's' : ''}</p>
        </div>

        {/* Aujourd'hui */}
        <div className="rounded-2xl p-4 border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Aujourd&apos;hui</p>
          <p className="text-2xl font-black" style={{ color: todayProfit > 0 ? '#10b981' : 'var(--text-secondary)' }}>{formatCurrency(todayProfit, currency)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{todaySales.length} vente{todaySales.length > 1 ? 's' : ''} ce jour</p>
        </div>

        {/* Stock */}
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>En stock</p>
          <p className="text-2xl font-black text-purple-400">{stock.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {formatCurrency(stock.reduce((s, x) => s + (x.buyPrice + x.customs + x.shipping + x.taxes) * x.quantity, 0), currency)} investis
          </p>
          <Link href="/dashboard/ventes" className="text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1 block">Voir le stock →</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={stat.label} className="glass-stat rounded-2xl p-4 md:p-5" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-medium leading-snug" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                <stat.icon size={13} strokeWidth={1.75} style={{ color: stat.accent }} />
              </div>
            </div>
            <p className="text-xl font-semibold tracking-tight" style={{ color: stat.accent }}>{stat.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {stat.up ? <ArrowUpRight size={11} className="text-emerald-500" strokeWidth={2} /> : <ArrowDownRight size={11} className="text-red-400" strokeWidth={2} />}
              <p className={`text-xs font-medium ${stat.up ? 'text-emerald-500' : 'text-red-400'}`}>{stat.change} ce mois</p>
            </div>
          </div>
        ))}
      </div>

      {/* IA Conseils */}
      {aiTips.length > 0 && (
        <div className="rounded-2xl p-5 border" style={{ background: 'rgba(251,191,36,0.04)', borderColor: 'rgba(251,191,36,0.15)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-yellow-400" />
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Conseils IA</h2>
            <span className="text-xs px-2 py-0.5 rounded-full text-yellow-400 border border-yellow-500/20" style={{ background: 'rgba(251,191,36,0.08)' }}>Basé sur vos données</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {aiTips.map((tip, i) => (
              <div key={i} className="rounded-xl p-3.5 border" style={{ background: 'var(--surface-input)', borderColor: 'var(--border)' }}>
                <span className="text-lg">{tip.icon}</span>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="glass-dashboard rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Évolution des bénéfices</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>30 derniers jours</p>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-emerald-400" />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Objectifs du mois</h2>
            </div>
            <Link href="/dashboard/objectifs" className="flex items-center gap-0.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors group">
              Gérer <ChevronRight size={12} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="space-y-4">
            {goals.slice(0, 3).map(goal => <GoalCard key={goal.id} goal={goal} />)}
            {goals.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Aucun objectif fixé</p>
                <Link href="/dashboard/objectifs" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">+ Créer un objectif</Link>
              </div>
            )}
          </div>
        </div>

        {/* Dernières ventes */}
        <div className="glass-dashboard rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-400" />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Dernières ventes</h2>
            </div>
            <Link href="/dashboard/ventes" className="flex items-center gap-0.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors group">
              Voir tout <ChevronRight size={12} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="space-y-0.5">
            {sales.slice(0, 5).map(sale => {
              const profit = netProfit(sale) * sale.quantity
              return (
                <div key={sale.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{sale.product}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sale.date} · ×{sale.quantity}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className={`text-sm font-semibold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {profit >= 0 ? '+' : ''}{formatCurrency(profit, currency)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatCurrency(sale.sellPrice, currency)}</p>
                  </div>
                </div>
              )
            })}
            {sales.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Aucune vente enregistrée</p>
                <Link href="/dashboard/ventes" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">+ Enregistrer une vente</Link>
              </div>
            )}
          </div>
        </div>

        {/* Drops + prochains */}
        <div className="space-y-4">
          {upcomingDrops.length > 0 && (
            <div className="glass-dashboard rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-yellow-400" />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Prochains drops</h2>
              </div>
              <div className="space-y-2">
                {upcomingDrops.map(drop => (
                  <div key={drop.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--surface-input)' }}>
                    <div className="text-center shrink-0 w-10">
                      <p className="text-xs font-black text-emerald-400">{new Date(drop.date).toLocaleDateString('fr', { day: 'numeric' })}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{new Date(drop.date).toLocaleDateString('fr', { month: 'short' })}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{drop.title}</p>
                      {drop.note && <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{drop.note}</p>}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${drop.type === 'achat' ? 'text-blue-400 bg-blue-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                      {drop.type === 'achat' ? 'Achat' : 'Vente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DropsCalendar />
        </div>

      </div>
    </div>
  )
}
