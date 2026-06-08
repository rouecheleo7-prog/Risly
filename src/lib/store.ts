'use client'

import { createContext, useContext } from 'react'

export type Currency = 'CHF' | 'EUR'

export interface Sale {
  id: string
  product: string
  brand: string
  buyPrice: number
  customs: number       // frais de douane
  shipping: number      // frais de livraison
  taxes: number         // taxes / TVA
  sellPrice: number
  quantity: number
  date: string
  category: string
}

export interface StockItem {
  id: string
  product: string
  brand: string
  buyPrice: number
  customs: number
  shipping: number
  taxes: number
  targetSellPrice: number
  quantity: number
  category: string
  addedDate: string
}

export interface Drop {
  id: string
  title: string
  date: string
  type: 'achat' | 'vente'
  note: string
}

export interface Goal {
  id: string
  label: string
  target: number
  current: number
  unit: string
  deadline: string
}

// net profit for one unit
export function netProfit(item: Pick<Sale | StockItem, 'buyPrice' | 'customs' | 'shipping' | 'taxes'> & { sellPrice?: number; targetSellPrice?: number }): number {
  const sell = item.sellPrice ?? item.targetSellPrice ?? 0
  return sell - item.buyPrice - item.customs - item.shipping - item.taxes
}

export function marginPct(item: Parameters<typeof netProfit>[0]): number {
  const sell = item.sellPrice ?? item.targetSellPrice ?? 0
  if (sell === 0) return 0
  return Math.round((netProfit(item) / sell) * 100)
}

export interface OnboardingData {
  businessName: string
  category: string
  goal: 'Démarrer' | 'Scaler' | 'Maximiser les marges'
  capital: number
  currency: 'CHF' | 'EUR'
}

export type UserPlan = 'starter' | 'pro' | 'business'

export const PLAN_LIMITS: Record<UserPlan, number | null> = {
  starter: 50,
  pro: null,
  business: null,
}

export interface AppState {
  currency: Currency
  userPlan: UserPlan
  onboarding: OnboardingData | null
  sales: Sale[]
  goals: Goal[]
  stock: StockItem[]
  drops: Drop[]
  marginAlertThreshold: number
  setCurrency: (c: Currency) => void
  setUserPlan: (p: UserPlan) => void
  setMarginAlertThreshold: (n: number) => void
  addSale: (s: Omit<Sale, 'id'>) => void
  updateSale: (id: string, data: Partial<Sale>) => void
  deleteSale: (id: string) => void
  addGoal: (g: Omit<Goal, 'id'>) => void
  updateGoal: (id: string, data: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addStockItem: (s: Omit<StockItem, 'id'>) => void
  updateStockItem: (id: string, data: Partial<StockItem>) => void
  deleteStockItem: (id: string) => void
  convertStockToSale: (stockId: string, sellPrice: number, date: string) => void
  addDrop: (d: Omit<Drop, 'id'>) => void
  updateDrop: (id: string, data: Partial<Drop>) => void
  deleteDrop: (id: string) => void
}

export const AppContext = createContext<AppState | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
