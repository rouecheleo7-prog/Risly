'use client'

import { useState, useCallback, useEffect } from 'react'
import { AppContext, Currency, UserPlan, OnboardingData, Sale, Goal, StockItem, Drop } from '@/lib/store'

const DEMO_SALES: Sale[] = [
  { id: '1', product: 'Air Jordan 1 Retro High OG', brand: 'Nike / Jordan', buyPrice: 120, customs: 0, shipping: 12, taxes: 0, sellPrice: 210, quantity: 1, date: '2026-06-01', category: 'Sneakers' },
  { id: '2', product: 'iPhone 14 Pro 256GB', brand: 'Apple', buyPrice: 650, customs: 45, shipping: 18, taxes: 0, sellPrice: 890, quantity: 1, date: '2026-06-03', category: 'Tech' },
  { id: '3', product: 'Box Logo Tee SS26', brand: 'Supreme', buyPrice: 45, customs: 0, shipping: 8, taxes: 0, sellPrice: 130, quantity: 2, date: '2026-06-05', category: 'Vêtements' },
  { id: '4', product: 'Yeezy 350 V2 Bone', brand: 'Adidas / Yeezy', buyPrice: 200, customs: 0, shipping: 15, taxes: 0, sellPrice: 320, quantity: 1, date: '2026-06-07', category: 'Sneakers' },
  { id: '5', product: 'AirPods Pro 2nd Gen', brand: 'Apple', buyPrice: 180, customs: 0, shipping: 10, taxes: 12, sellPrice: 240, quantity: 3, date: '2026-06-08', category: 'Tech' },
]

const DEMO_STOCK: StockItem[] = [
  { id: 's1', product: 'Travis Scott x Nike Air Max 1', brand: 'Nike', buyPrice: 280, customs: 35, shipping: 20, taxes: 0, targetSellPrice: 580, quantity: 1, category: 'Sneakers', addedDate: '2026-06-06' },
  { id: 's2', product: 'MacBook Pro M4 14"', brand: 'Apple', buyPrice: 1450, customs: 90, shipping: 0, taxes: 0, targetSellPrice: 1750, quantity: 1, category: 'Tech', addedDate: '2026-06-07' },
  { id: 's3', product: 'Palace Tri-Ferg Hoodie', brand: 'Palace', buyPrice: 95, customs: 0, shipping: 12, taxes: 0, targetSellPrice: 220, quantity: 2, category: 'Vêtements', addedDate: '2026-06-08' },
]

const DEMO_GOALS: Goal[] = [
  { id: '1', label: 'Bénéfice mensuel', target: 2000, current: 1240, unit: 'devise', deadline: '2026-06-30' },
  { id: '2', label: 'Nombre de ventes', target: 30, current: 9, unit: 'ventes', deadline: '2026-06-30' },
  { id: '3', label: "Chiffre d'affaires", target: 5000, current: 2940, unit: 'devise', deadline: '2026-06-30' },
]

const DEMO_DROPS: Drop[] = [
  { id: 'd1', title: 'Jordan 4 "Military Blue" Restock', date: '2026-06-14', type: 'achat', note: 'SNKRS 10h00 CET' },
  { id: 'd2', title: 'Vente iPhone lot × 3', date: '2026-06-15', type: 'vente', note: 'Acheteur confirmé' },
  { id: 'd3', title: 'Supreme SS26 Drop 4', date: '2026-06-19', type: 'achat', note: 'Box Logo + Jackets' },
  { id: 'd4', title: 'Yeezy 700 Wave Runner', date: '2026-06-22', type: 'achat', note: 'Adidas CONFIRMED' },
]

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('CHF')
  const [userPlan, setUserPlan] = useState<UserPlan>('pro')
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('risly_onboarding')
      if (s) {
        const data = JSON.parse(s)
        setOnboarding(data)
        if (data.currency) setCurrencyState(data.currency)
      }
    } catch {}
  }, [])
  const [marginAlertThreshold, setMarginAlertThreshold] = useState(10)
  const [sales, setSales] = useState<Sale[]>(DEMO_SALES)
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS)
  const [stock, setStock] = useState<StockItem[]>(DEMO_STOCK)
  const [drops, setDrops] = useState<Drop[]>(DEMO_DROPS)

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), [])
  const setUserPlanCb = useCallback((p: UserPlan) => setUserPlan(p), [])

  const addSale = useCallback((s: Omit<Sale, 'id'>) => {
    setSales(prev => [{ ...s, id: crypto.randomUUID() }, ...prev])
  }, [])
  const updateSale = useCallback((id: string, data: Partial<Sale>) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }, [])
  const deleteSale = useCallback((id: string) => {
    setSales(prev => prev.filter(s => s.id !== id))
  }, [])

  const addGoal = useCallback((g: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...g, id: crypto.randomUUID() }])
  }, [])
  const updateGoal = useCallback((id: string, data: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
  }, [])
  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }, [])

  const addStockItem = useCallback((s: Omit<StockItem, 'id'>) => {
    setStock(prev => [{ ...s, id: crypto.randomUUID() }, ...prev])
  }, [])
  const updateStockItem = useCallback((id: string, data: Partial<StockItem>) => {
    setStock(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }, [])
  const deleteStockItem = useCallback((id: string) => {
    setStock(prev => prev.filter(s => s.id !== id))
  }, [])
  const convertStockToSale = useCallback((stockId: string, sellPrice: number, date: string) => {
    setStock(prev => {
      const item = prev.find(s => s.id === stockId)
      if (!item) return prev
      setSales(sales => [{
        id: crypto.randomUUID(),
        product: item.product, brand: item.brand,
        buyPrice: item.buyPrice, customs: item.customs, shipping: item.shipping, taxes: item.taxes,
        sellPrice, quantity: item.quantity, date, category: item.category,
      }, ...sales])
      return prev.filter(s => s.id !== stockId)
    })
  }, [])

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
