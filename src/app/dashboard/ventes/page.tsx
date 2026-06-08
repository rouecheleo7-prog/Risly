'use client'

import { useState } from 'react'
import { useApp, Sale, StockItem, netProfit, marginPct, PLAN_LIMITS } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, X, TrendingUp, Package, AlertTriangle, Pencil, ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react'

const CATEGORIES = ['Sneakers', 'Tech', 'Vêtements', 'Accessoires', 'Montres', 'Autre']
const PAGE_SIZE = 20

type Tab = 'ventes' | 'stock'
type FormMode = 'sale' | 'stock'

interface ArticleForm {
  product: string; brand: string; category: string
  buyPrice: string; customs: string; shipping: string; taxes: string
  sellPrice: string; targetSellPrice: string; quantity: string; date: string
}

const emptyForm = (): ArticleForm => ({
  product: '', brand: '', category: 'Sneakers',
  buyPrice: '', customs: '0', shipping: '0', taxes: '0',
  sellPrice: '', targetSellPrice: '', quantity: '1',
  date: new Date().toISOString().split('T')[0],
})

function FeesRow({ label, value }: { label: string; value: number }) {
  if (value === 0) return null
  return (
    <div className="flex justify-between text-xs text-gray-600">
      <span>{label}</span><span>-{value.toFixed(2)}</span>
    </div>
  )
}

function MarginBadge({ margin, threshold }: { margin: number; threshold: number }) {
  if (margin < 0) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
      <AlertTriangle size={9} strokeWidth={2.5} /> {margin}%
    </span>
  )
  if (margin < threshold) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
      <AlertTriangle size={9} strokeWidth={2.5} /> {margin}%
    </span>
  )
  return (
    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
      {margin}%
    </span>
  )
}

function exportCSV(sales: Sale[]) {
  const headers = ['Date', 'Produit', 'Marque', 'Catégorie', 'Prix achat', 'Douanes', 'Livraison', 'Taxes', 'Prix vente', 'Quantité', 'Bénéfice net']
  const rows = sales.map(s => [
    s.date, `"${s.product}"`, `"${s.brand}"`, s.category,
    s.buyPrice, s.customs, s.shipping, s.taxes,
    s.sellPrice, s.quantity,
    (netProfit(s) * s.quantity).toFixed(2),
  ])
  const csv = '﻿' + [headers, ...rows].map(r => r.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `risly-ventes-${new Date().toISOString().split('T')[0]}.csv`
  a.click(); URL.revokeObjectURL(url)
}

export default function VentesPage() {
  const { sales, stock, currency, marginAlertThreshold, userPlan, addSale, updateSale, deleteSale, addStockItem, updateStockItem, deleteStockItem, convertStockToSale } = useApp()
  const [tab, setTab] = useState<Tab>('ventes')
  const [showModal, setShowModal] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('sale')
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [editingStock, setEditingStock] = useState<StockItem | null>(null)
  const [form, setForm] = useState<ArticleForm>(emptyForm())
  const [showFees, setShowFees] = useState(false)
  const [convertingStock, setConvertingStock] = useState<StockItem | null>(null)
  const [convertSellPrice, setConvertSellPrice] = useState('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const saleLimit = PLAN_LIMITS[userPlan]
  const atLimit = saleLimit !== null && sales.length >= saleLimit
  const nearLimit = saleLimit !== null && sales.length >= saleLimit - 5

  function f(field: keyof ArticleForm) {
    return { value: form[field], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [field]: e.target.value })) }
  }

  function openAddSale() {
    if (atLimit) return
    setEditingSale(null); setEditingStock(null)
    setFormMode('sale'); setForm(emptyForm()); setShowFees(false); setShowModal(true)
  }
  function openAddStock() {
    setEditingSale(null); setEditingStock(null)
    setFormMode('stock'); setForm(emptyForm()); setShowFees(false); setShowModal(true)
  }
  function openEditSale(s: Sale) {
    setEditingSale(s); setEditingStock(null); setFormMode('sale')
    setForm({ product: s.product, brand: s.brand, category: s.category, buyPrice: String(s.buyPrice), customs: String(s.customs), shipping: String(s.shipping), taxes: String(s.taxes), sellPrice: String(s.sellPrice), targetSellPrice: '', quantity: String(s.quantity), date: s.date })
    setShowFees(s.customs > 0 || s.shipping > 0 || s.taxes > 0); setShowModal(true)
  }
  function openEditStock(s: StockItem) {
    setEditingStock(s); setEditingSale(null); setFormMode('stock')
    setForm({ product: s.product, brand: s.brand, category: s.category, buyPrice: String(s.buyPrice), customs: String(s.customs), shipping: String(s.shipping), taxes: String(s.taxes), sellPrice: '', targetSellPrice: String(s.targetSellPrice), quantity: String(s.quantity), date: s.addedDate })
    setShowFees(s.customs > 0 || s.shipping > 0 || s.taxes > 0); setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const base = { product: form.product.trim(), brand: form.brand.trim(), category: form.category, buyPrice: parseFloat(form.buyPrice) || 0, customs: parseFloat(form.customs) || 0, shipping: parseFloat(form.shipping) || 0, taxes: parseFloat(form.taxes) || 0, quantity: parseInt(form.quantity) || 1 }
    if (formMode === 'sale') {
      const data = { ...base, sellPrice: parseFloat(form.sellPrice) || 0, date: form.date }
      editingSale ? updateSale(editingSale.id, data) : addSale(data)
    } else {
      const data = { ...base, targetSellPrice: parseFloat(form.targetSellPrice) || 0, addedDate: form.date }
      editingStock ? updateStockItem(editingStock.id, data) : addStockItem(data)
    }
    setShowModal(false)
  }

  // Filtered + paginated sales
  const q = search.toLowerCase()
  const filteredSales = sales.filter(s =>
    !q || s.product.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
  )
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / PAGE_SIZE))
  const paginatedSales = filteredSales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // computed
  const totalRevenue = sales.reduce((s, x) => s + x.sellPrice * x.quantity, 0)
  const totalNet = sales.reduce((s, x) => s + netProfit(x) * x.quantity, 0)
  const stockProjected = stock.reduce((s, x) => s + netProfit({ ...x, sellPrice: x.targetSellPrice }) * x.quantity, 0)
  const stockValue = stock.reduce((s, x) => s + (x.buyPrice + x.customs + x.shipping + x.taxes) * x.quantity, 0)

  const numValue = (v: string) => parseFloat(v) || 0
  const previewNet = showModal && form.sellPrice
    ? (numValue(form.sellPrice) - numValue(form.buyPrice) - numValue(form.customs) - numValue(form.shipping) - numValue(form.taxes))
    : null
  const previewMargin = previewNet !== null && numValue(form.sellPrice) > 0
    ? Math.round((previewNet / numValue(form.sellPrice)) * 100) : null

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">Gestion des articles</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Ventes & Stock</h1>
        </div>
        <div className="flex gap-2">
          {tab === 'ventes' && sales.length > 0 && (
            <button
              onClick={() => exportCSV(sales)}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-gray-400 hover:text-white px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
              title="Exporter en CSV"
            >
              <Download size={14} strokeWidth={2} />
              <span className="hidden sm:block">CSV</span>
            </button>
          )}
          <button onClick={openAddStock} className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Package size={14} strokeWidth={2} />
            <span>Stock</span>
          </button>
          <button
            onClick={openAddSale}
            disabled={atLimit}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-900/30 active:scale-[0.98]"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>+ Nouvelle vente</span>
          </button>
        </div>
      </div>

      {/* Plan limit warning */}
      {nearLimit && (
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm border ${atLimit ? 'bg-red-500/[0.08] border-red-500/20 text-red-400' : 'bg-amber-500/[0.07] border-amber-500/20 text-amber-400'}`}>
          <AlertTriangle size={14} strokeWidth={2} className="shrink-0" />
          <span>
            {atLimit
              ? `Limite atteinte (${sales.length}/${saleLimit} articles). Passez au plan Pro pour continuer.`
              : `Il vous reste ${saleLimit! - sales.length} articles avant la limite de votre plan Starter.`
            }
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Bénéfice net total', value: formatCurrency(totalNet, currency), color: 'text-emerald-400' },
          { label: "Chiffre d'affaires", value: formatCurrency(totalRevenue, currency), color: 'text-blue-400' },
          { label: 'Bénéfice potentiel (stock)', value: formatCurrency(stockProjected, currency), color: 'text-purple-400' },
          { label: 'Valeur investie (stock)', value: formatCurrency(stockValue, currency), color: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="glass-stat rounded-2xl p-4">
            <p className="text-xs text-gray-600 mb-1.5">{s.label}</p>
            <p className={`text-base font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
        {(['ventes', 'stock'] as Tab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); setSearch(''); setPage(1) }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white/[0.08] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            {t === 'ventes' ? `Ventes (${sales.length})` : `Stock (${stock.length})`}
          </button>
        ))}
      </div>

      {/* ── VENTES TABLE ── */}
      {tab === 'ventes' && (
        <div className="space-y-3">
          {/* Search */}
          {sales.length > 0 && (
            <div className="relative">
              <Search size={13} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Rechercher un article, marque, catégorie…"
                className="input-field pl-9 w-full"
              />
              {search && (
                <button onClick={() => { setSearch(''); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          <div className="glass-dashboard rounded-2xl overflow-hidden">
            {sales.length === 0 ? (
              <EmptyState icon={TrendingUp} label="Aucune vente" sub="Enregistrez votre première vente" onAdd={openAddSale} />
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">Aucun résultat pour &quot;{search}&quot;</p>
                <button onClick={() => setSearch('')} className="text-xs text-emerald-600 hover:text-emerald-500 mt-1 transition-colors">Effacer la recherche</button>
              </div>
            ) : (
              <div>
                <div className="hidden lg:grid grid-cols-[1fr_100px_100px_80px_40px] gap-4 px-5 py-3 border-b border-white/[0.04]">
                  {['Article', 'Frais nets', 'Prix de vente', 'Bénéfice net', ''].map(h => (
                    <span key={h} className="text-xs text-gray-600 font-medium">{h}</span>
                  ))}
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {paginatedSales.map(sale => {
                    const net = netProfit(sale)
                    const margin = marginPct(sale)
                    const totalFees = sale.customs + sale.shipping + sale.taxes
                    const expanded = expandedRow === sale.id
                    return (
                      <div key={sale.id}>
                        <div
                          className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_100px_100px_80px_40px] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.015] transition-colors cursor-pointer"
                          onClick={() => setExpandedRow(expanded ? null : sale.id)}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-white/90 truncate">{sale.product}</p>
                              <MarginBadge margin={margin} threshold={marginAlertThreshold} />
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">{sale.brand} · {sale.date} · ×{sale.quantity}</p>
                          </div>
                          <div className="hidden lg:block">
                            <p className="text-sm text-gray-400">{formatCurrency(sale.buyPrice, currency)}</p>
                            {totalFees > 0 && <p className="text-xs text-amber-500/70">+{formatCurrency(totalFees, currency)} frais</p>}
                          </div>
                          <span className="hidden lg:block text-sm text-gray-300">{formatCurrency(sale.sellPrice, currency)}</span>
                          <div className="hidden lg:block">
                            <p className={`text-sm font-semibold ${net * sale.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {net * sale.quantity > 0 ? '+' : ''}{formatCurrency(net * sale.quantity, currency)}
                            </p>
                          </div>
                          <div className="lg:hidden text-right">
                            <p className={`text-sm font-semibold ${net > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {net > 0 ? '+' : ''}{formatCurrency(net * sale.quantity, currency)}
                            </p>
                            {expanded ? <ChevronUp size={12} className="text-gray-600 ml-auto mt-0.5" /> : <ChevronDown size={12} className="text-gray-600 ml-auto mt-0.5" />}
                          </div>
                          <div className="hidden lg:flex gap-1" onClick={e => e.stopPropagation()}>
                            <button onClick={() => openEditSale(sale)} className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                              <Pencil size={12} strokeWidth={1.75} />
                            </button>
                            <button onClick={() => deleteSale(sale.id)} className="text-gray-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                              <Trash2 size={12} strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>
                        {expanded && (
                          <div className="px-5 pb-4 bg-white/[0.01]">
                            <div className="border border-white/[0.05] rounded-xl p-4 space-y-2 text-xs">
                              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                                <div className="flex justify-between"><span className="text-gray-600">Prix d&apos;achat</span><span className="text-gray-300">{formatCurrency(sale.buyPrice, currency)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Prix de vente</span><span className="text-gray-300">{formatCurrency(sale.sellPrice, currency)}</span></div>
                                {sale.customs > 0 && <div className="flex justify-between"><span className="text-amber-600/80">Douanes</span><span className="text-amber-500/80">-{formatCurrency(sale.customs, currency)}</span></div>}
                                {sale.shipping > 0 && <div className="flex justify-between"><span className="text-amber-600/80">Livraison</span><span className="text-amber-500/80">-{formatCurrency(sale.shipping, currency)}</span></div>}
                                {sale.taxes > 0 && <div className="flex justify-between"><span className="text-amber-600/80">Taxes</span><span className="text-amber-500/80">-{formatCurrency(sale.taxes, currency)}</span></div>}
                                <div className="flex justify-between font-semibold border-t border-white/[0.05] pt-1.5 col-span-2">
                                  <span className="text-gray-400">Bénéfice net (×{sale.quantity})</span>
                                  <span className={net > 0 ? 'text-emerald-400' : 'text-red-400'}>{net > 0 ? '+' : ''}{formatCurrency(net * sale.quantity, currency)}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-1 lg:hidden">
                                <button onClick={() => openEditSale(sale)} className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-gray-300 px-3 py-2 rounded-lg transition-colors">
                                  <Pencil size={11} /> Modifier
                                </button>
                                <button onClick={() => deleteSale(sale.id)} className="flex items-center justify-center gap-1.5 text-xs bg-red-500/[0.07] hover:bg-red-500/[0.12] border border-red-500/15 text-red-400 px-3 py-2 rounded-lg transition-colors">
                                  <Trash2 size={11} /> Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
                    <p className="text-xs text-gray-600">{filteredSales.length} résultats · page {page}/{totalPages}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 transition-all"
                      >
                        <ChevronLeft size={13} strokeWidth={2} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${n === page ? 'bg-white/[0.09] text-white' : 'text-gray-600 hover:text-white hover:bg-white/[0.05]'}`}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 transition-all"
                      >
                        <ChevronRight size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STOCK TABLE ── */}
      {tab === 'stock' && (
        <div className="glass-dashboard rounded-2xl overflow-hidden">
          {stock.length === 0 ? (
            <EmptyState icon={Package} label="Stock vide" sub="Ajoutez vos articles en attente de vente" onAdd={openAddStock} />
          ) : (
            <div>
              <div className="hidden lg:grid grid-cols-[1fr_110px_110px_80px_40px] gap-4 px-5 py-3 border-b border-white/[0.04]">
                {['Article', 'Coût total', 'Prix cible', 'Bénéfice potentiel', ''].map(h => (
                  <span key={h} className="text-xs text-gray-600 font-medium">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-white/[0.04]">
                {stock.map(item => {
                  const itemNet = netProfit({ ...item, sellPrice: item.targetSellPrice })
                  const margin = item.targetSellPrice > 0 ? Math.round((itemNet / item.targetSellPrice) * 100) : 0
                  const totalCost = (item.buyPrice + item.customs + item.shipping + item.taxes) * item.quantity
                  const expanded = expandedRow === item.id
                  return (
                    <div key={item.id}>
                      <div
                        className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_110px_110px_80px_40px] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.015] transition-colors cursor-pointer"
                        onClick={() => setExpandedRow(expanded ? null : item.id)}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-white/90 truncate">{item.product}</p>
                            <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full font-medium">En stock</span>
                            <MarginBadge margin={margin} threshold={marginAlertThreshold} />
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{item.brand} · Ajouté le {item.addedDate} · ×{item.quantity}</p>
                        </div>
                        <span className="hidden lg:block text-sm text-gray-400">{formatCurrency(totalCost, currency)}</span>
                        <span className="hidden lg:block text-sm text-gray-300">{formatCurrency(item.targetSellPrice, currency)}</span>
                        <div className="hidden lg:block">
                          <p className={`text-sm font-semibold ${itemNet > 0 ? 'text-purple-400' : 'text-red-400'}`}>
                            ~{itemNet > 0 ? '+' : ''}{formatCurrency(itemNet * item.quantity, currency)}
                          </p>
                        </div>
                        <div className="lg:hidden text-right">
                          <p className={`text-sm font-semibold ${itemNet > 0 ? 'text-purple-400' : 'text-red-400'}`}>
                            ~{formatCurrency(itemNet * item.quantity, currency)}
                          </p>
                        </div>
                        <div className="hidden lg:flex gap-1" onClick={e => e.stopPropagation()}>
                          <button onClick={() => openEditStock(item)} className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                            <Pencil size={12} strokeWidth={1.75} />
                          </button>
                          <button onClick={() => { setConvertingStock(item); setConvertSellPrice(String(item.targetSellPrice)) }} className="text-gray-600 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors" title="Marquer vendu">
                            <ArrowRight size={12} strokeWidth={2} />
                          </button>
                          <button onClick={() => deleteStockItem(item.id)} className="text-gray-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                            <Trash2 size={12} strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>
                      {expanded && (
                        <div className="px-5 pb-4 bg-white/[0.01]">
                          <div className="border border-white/[0.05] rounded-xl p-4 text-xs space-y-1.5">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                              <div className="flex justify-between"><span className="text-gray-600">Prix d&apos;achat</span><span>{formatCurrency(item.buyPrice, currency)}</span></div>
                              {item.customs > 0 && <div className="flex justify-between"><span className="text-amber-600/80">Douanes</span><span className="text-amber-500/80">-{formatCurrency(item.customs, currency)}</span></div>}
                              {item.shipping > 0 && <div className="flex justify-between"><span className="text-amber-600/80">Livraison</span><span className="text-amber-500/80">-{formatCurrency(item.shipping, currency)}</span></div>}
                              {item.taxes > 0 && <div className="flex justify-between"><span className="text-amber-600/80">Taxes</span><span className="text-amber-500/80">-{formatCurrency(item.taxes, currency)}</span></div>}
                              <div className="flex justify-between font-semibold border-t border-white/[0.05] pt-1.5 col-span-2">
                                <span className="text-gray-400">Bénéfice potentiel (×{item.quantity})</span>
                                <span className="text-purple-400">~+{formatCurrency(itemNet * item.quantity, currency)}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button onClick={() => { setConvertingStock(item); setConvertSellPrice(String(item.targetSellPrice)) }} className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-emerald-500/[0.07] hover:bg-emerald-500/[0.12] border border-emerald-500/15 text-emerald-400 px-3 py-2 rounded-lg transition-colors font-medium">
                                <ArrowRight size={11} /> Marquer vendu
                              </button>
                              <button onClick={() => openEditStock(item)} className="flex items-center justify-center gap-1.5 text-xs bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-gray-300 px-3 py-2 rounded-lg transition-colors">
                                <Pencil size={11} /> Modifier
                              </button>
                              <button onClick={() => deleteStockItem(item.id)} className="flex items-center justify-center gap-1.5 text-xs bg-red-500/[0.07] hover:bg-red-500/[0.12] border border-red-500/15 text-red-400 px-3 py-2 rounded-lg transition-colors">
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL ARTICLE ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="glass-dashboard rounded-2xl w-full max-w-lg p-6 animate-card-enter border border-white/10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold">
                  {editingSale ? 'Modifier la vente' : editingStock ? "Modifier l'article" : formMode === 'sale' ? 'Nouvelle vente' : 'Ajouter au stock'}
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">Tous les champs de frais sont optionnels</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom de l&apos;article *</label>
                  <input required placeholder="ex : Air Jordan 1 Retro High OG" {...f('product')} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Marque</label>
                  <input placeholder="ex : Nike / Jordan" {...f('brand')} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Catégorie</label>
                  <select {...f('category')} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="border border-white/[0.06] rounded-xl p-4 space-y-3 bg-white/[0.01]">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Coûts</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Prix d&apos;achat ({currency}) *</label>
                    <input required type="number" step="0.01" min="0" placeholder="0.00" {...f('buyPrice')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Quantité *</label>
                    <input required type="number" min="1" {...f('quantity')} className="input-field" />
                  </div>
                </div>

                <button type="button" onClick={() => setShowFees(!showFees)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  {showFees ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showFees ? 'Masquer les frais annexes' : '+ Ajouter frais de douane, livraison, taxes'}
                </button>

                {showFees && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-amber-600/80 mb-1.5">Douanes ({currency})</label>
                      <input type="number" step="0.01" min="0" placeholder="0.00" {...f('customs')} className="input-field border-amber-800/20 focus:border-amber-600/40" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-600/80 mb-1.5">Livraison ({currency})</label>
                      <input type="number" step="0.01" min="0" placeholder="0.00" {...f('shipping')} className="input-field border-amber-800/20 focus:border-amber-600/40" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-600/80 mb-1.5">Taxes ({currency})</label>
                      <input type="number" step="0.01" min="0" placeholder="0.00" {...f('taxes')} className="input-field border-amber-800/20 focus:border-amber-600/40" />
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-white/[0.06] rounded-xl p-4 space-y-3 bg-white/[0.01]">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  {formMode === 'sale' ? 'Vente' : 'Prix cible'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {formMode === 'sale' ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Prix de vente ({currency}) *</label>
                        <input required type="number" step="0.01" min="0" placeholder="0.00" {...f('sellPrice')} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Date de vente *</label>
                        <input required type="date" {...f('date')} className="input-field" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Prix cible ({currency}) *</label>
                        <input required type="number" step="0.01" min="0" placeholder="0.00" {...f('targetSellPrice')} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Date d&apos;ajout</label>
                        <input type="date" {...f('date')} className="input-field" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {formMode === 'sale' && previewNet !== null && previewMargin !== null && (
                <div className={`rounded-xl p-3.5 space-y-1.5 transition-colors ${previewNet >= 0 ? 'bg-emerald-500/[0.06] border border-emerald-500/15' : 'bg-red-500/[0.06] border border-red-500/15'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Bénéfice net estimé (×{form.quantity})</span>
                    <span className={`text-sm font-bold ${previewNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {previewNet >= 0 ? '+' : ''}{formatCurrency(previewNet * (parseInt(form.quantity) || 1), currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Marge nette</span>
                    <MarginBadge margin={previewMargin} threshold={marginAlertThreshold} />
                  </div>
                  {showFees && (
                    <div className="pt-1 border-t border-white/[0.06] space-y-0.5">
                      <FeesRow label="Douanes" value={numValue(form.customs)} />
                      <FeesRow label="Livraison" value={numValue(form.shipping)} />
                      <FeesRow label="Taxes" value={numValue(form.taxes)} />
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-emerald-900/30">
                {editingSale ? 'Enregistrer les modifications' : editingStock ? 'Mettre à jour' : formMode === 'sale' ? 'Enregistrer la vente' : 'Ajouter au stock'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL CONVERSION STOCK → VENTE ── */}
      {convertingStock && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setConvertingStock(null)}>
          <div className="glass-dashboard rounded-2xl w-full max-w-sm p-6 animate-card-enter border border-white/10" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-semibold mb-1">Marquer comme vendu</h2>
            <p className="text-xs text-gray-600 mb-5">{convertingStock.product}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Prix de vente réel ({currency})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={convertSellPrice}
                  onChange={e => setConvertSellPrice(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <button
                onClick={() => { convertStockToSale(convertingStock.id, parseFloat(convertSellPrice), new Date().toISOString().split('T')[0]); setConvertingStock(null) }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all"
              >
                ✓ Confirmer la vente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon: Icon, label, sub, onAdd }: { icon: React.ElementType; label: string; sub: string; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
        <Icon size={22} strokeWidth={1.5} className="text-gray-700" />
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-xs text-gray-700 mb-4">{sub}</p>
      <button onClick={onAdd} className="text-emerald-500 text-sm hover:text-emerald-400 transition-colors font-medium">
        + Ajouter
      </button>
    </div>
  )
}
