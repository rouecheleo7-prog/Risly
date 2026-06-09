'use client'

import { useState, useCallback, useEffect } from 'react'
import { AppContext, Currency, UserPlan, OnboardingData, Sale, Goal, StockItem, Drop } from '@/lib/store'
import { createClient } from '@/lib/supabase'

const DEMO_DROPS: Drop[] = [
  { id: 'd1', title: 'Jordan 4 "Military Blue" Restock', date: '2026-06-14', type: 'achat', note: 'SNKRS 10h00 CET' },
  { id: 'd2', title: 'Vente iPhone lot × 3', date: '2026-06-15', type: 'vente', note: 'Acheteur confirmé' },
  { id: 'd3', title: 'Supreme SS26 Drop 4', date: '2026-06-19', type: 'achat', note: 'Box Logo + Jackets' },
  { id: 'd4', title: 'Yeezy 700 Wave Runner', date: '2026-06-22', type: 'achat', note: 'Adidas CONFIRMED' },
]

function toSale(row: Record<string, unknown>): Sale {
  return {
    id: row.id as string,
    product: row.product as string,
    brand: (row.brand as string) ?? '',
    buyPrice: Number(row.buy_price),
    customs: Number(row.customs),
    shipping: Number(row.shipping),
    taxes: Number(row.taxes),
    sellPrice: Number(row.sell_price),
    quantity: Number(row.quantity),
    date: row.date as string,
    category: (row.category as string) ?? '',
  }
}

function toStock(row: Record<string, unknown>): StockItem {
  return {
    id: row.id as string,
    product: row.product as string,
    brand: (row.brand as string) ?? '',
    buyPrice: Number(row.buy_price),
    customs: Number(row.customs),
    shipping: Number(row.shipping),
    taxes: Number(row.taxes),
    targetSellPrice: Number(row.target_sell_price),
    quantity: Number(row.quantity),
    category: (row.category as string) ?? '',
    addedDate: row.added_date as string,
  }
}

function toGoal(row: Record<string, unknown>): Goal {
  return {
    id: row.id as string,
    label: row.label as string,
    target: Number(row.target),
    current: Number(row.current_amount),
    unit: (row.unit as string) ?? 'devise',
    deadline: (row.deadline as string) ?? '',
  }
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('CHF')
  const [userPlan, setUserPlan] = useState<UserPlan>('pro')
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null)
  const [marginAlertThreshold, setMarginAlertThreshold] = useState(10)
  const [sales, setSales] = useState<Sale[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [stock, setStock] = useState<StockItem[]>([])
  const [drops, setDrops] = useState<Drop[]>(DEMO_DROPS)
  const [userId, setUserId] = useState<string | null>(null)

  // Load user + data on mount
  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const [salesRes, stockRes, goalsRes] = await Promise.all([
        supabase.from('ventes').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('stock').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('objectifs').select('*').eq('user_id', user.id),
      ])

      if (salesRes.data) setSales(salesRes.data.map(toSale))
      if (stockRes.data) setStock(stockRes.data.map(toStock))
      if (goalsRes.data) setGoals(goalsRes.data.map(toGoal))

      try {
        const s = localStorage.getItem('risly_onboarding')
        if (s) {
          const data = JSON.parse(s)
          setOnboarding(data)
          if (data.currency) setCurrencyState(data.currency)
        }
      } catch {}
    }

    load()
  }, [])

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), [])
  const setUserPlanCb = useCallback((p: UserPlan) => setUserPlan(p), [])

  const addSale = useCallback(async (s: Omit<Sale, 'id'>) => {
    if (!userId) return
    const supabase = createClient()
    const { data } = await supabase.from('ventes').insert({
      user_id: userId,
      product: s.product, brand: s.brand,
      buy_price: s.buyPrice, customs: s.customs, shipping: s.shipping, taxes: s.taxes,
      sell_price: s.sellPrice, quantity: s.quantity, date: s.date, category: s.category,
    }).select().single()
    if (data) setSales(prev => [toSale(data), ...prev])
  }, [userId])

  const updateSale = useCallback(async (id: string, data: Partial<Sale>) => {
    const supabase = createClient()
    await supabase.from('ventes').update({
      product: data.product, brand: data.brand,
      buy_price: data.buyPrice, customs: data.customs, shipping: data.shipping, taxes: data.taxes,
      sell_price: data.sellPrice, quantity: data.quantity, date: data.date, category: data.category,
    }).eq('id', id)
    setSales(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }, [])

  const deleteSale = useCallback(async (id: string) => {
    const supabase = createClient()
    await supabase.from('ventes').delete().eq('id', id)
    setSales(prev => prev.filter(s => s.id !== id))
  }, [])

  const addGoal = useCallback(async (g: Omit<Goal, 'id'>) => {
    if (!userId) return
    const supabase = createClient()
    const { data } = await supabase.from('objectifs').insert({
      user_id: userId,
      label: g.label, target: g.target, current_amount: g.current, unit: g.unit, deadline: g.deadline || null,
    }).select().single()
    if (data) setGoals(prev => [...prev, toGoal(data)])
  }, [userId])

  const updateGoal = useCallback(async (id: string, data: Partial<Goal>) => {
    const supabase = createClient()
    await supabase.from('objectifs').update({
      label: data.label, target: data.target, current_amount: data.current, unit: data.unit, deadline: data.deadline || null,
    }).eq('id', id)
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
  }, [])

  const deleteGoal = useCallback(async (id: string) => {
    const supabase = createClient()
    await supabase.from('objectifs').delete().eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }, [])

  const addStockItem = useCallback(async (s: Omit<StockItem, 'id'>) => {
    if (!userId) return
    const supabase = createClient()
    const { data } = await supabase.from('stock').insert({
      user_id: userId,
      product: s.product, brand: s.brand,
      buy_price: s.buyPrice, customs: s.customs, shipping: s.shipping, taxes: s.taxes,
      target_sell_price: s.targetSellPrice, quantity: s.quantity, category: s.category, added_date: s.addedDate,
    }).select().single()
    if (data) setStock(prev => [toStock(data), ...prev])
  }, [userId])

  const updateStockItem = useCallback(async (id: string, data: Partial<StockItem>) => {
    const supabase = createClient()
    await supabase.from('stock').update({
      product: data.product, brand: data.brand,
      buy_price: data.buyPrice, customs: data.customs, shipping: data.shipping, taxes: data.taxes,
      target_sell_price: data.targetSellPrice, quantity: data.quantity, category: data.category, added_date: data.addedDate,
    }).eq('id', id)
    setStock(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }, [])

  const deleteStockItem = useCallback(async (id: string) => {
    const supabase = createClient()
    await supabase.from('stock').delete().eq('id', id)
    setStock(prev => prev.filter(s => s.id !== id))
  }, [])

  const convertStockToSale = useCallback(async (stockId: string, sellPrice: number, date: string) => {
    if (!userId) return
    const item = stock.find(s => s.id === stockId)
    if (!item) return
    const supabase = createClient()
    const { data } = await supabase.from('ventes').insert({
      user_id: userId,
      product: item.product, brand: item.brand,
      buy_price: item.buyPrice, customs: item.customs, shipping: item.shipping, taxes: item.taxes,
      sell_price: sellPrice, quantity: item.quantity, date, category: item.category,
    }).select().single()
    await supabase.from('stock').delete().eq('id', stockId)
    if (data) setSales(prev => [toSale(data), ...prev])
    setStock(prev => prev.filter(s => s.id !== stockId))
  }, [userId, stock])

  const addDrop = useCallback((d: Omit<Drop, 'id'>) => {
    setDrops(prev => [...prev, { ...d, id: crypto.randomUUID() }].sort((a, b) => a.date.localeCompare(b.date)))
  }, [])
  const updateDrop = useCallback((id: string, data: Partial<Drop>) => {
    setDrops(prev => prev.map(d => d.id === id ? { ...d, ...data } : d))
  }, [])
  const deleteDrop = useCallback((id: string) => {
    setDrops(prev => prev.filter(d => d.id !== id))
  }, [])

  return (
    <AppContext.Provider value={{
      currency, userPlan, onboarding, sales, goals, stock, drops, marginAlertThreshold,
      setCurrency, setUserPlan: setUserPlanCb, setMarginAlertThreshold,
      addSale, updateSale, deleteSale,
      addGoal, updateGoal, deleteGoal,
      addStockItem, updateStockItem, deleteStockItem, convertStockToSale,
      addDrop, updateDrop, deleteDrop,
    }}>
      {children}
    </AppContext.Provider>
  )
}
