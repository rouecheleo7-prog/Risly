'use client'

import { useState } from 'react'
import { Plus, X, Pencil, Trash2, Star, ExternalLink, Search, Globe, User, Package, AlertTriangle } from 'lucide-react'

type Status = 'actif' | 'inactif' | 'eviter'
type Type = 'site' | 'particulier' | 'grossiste' | 'autre'

interface Supplier {
  id: string
  name: string
  type: Type
  country: string
  url: string
  notes: string
  rating: number
  status: Status
  totalSpent: number
  totalOrders: number
  createdAt: string
}

const TYPES: { value: Type; label: string }[] = [
  { value: 'site', label: 'Site web' },
  { value: 'particulier', label: 'Particulier' },
  { value: 'grossiste', label: 'Grossiste' },
  { value: 'autre', label: 'Autre' },
]

const STATUSES: { value: Status; label: string; color: string; bg: string }[] = [
  { value: 'actif', label: 'Actif', color: '#10b981', bg: 'rgba(5,150,105,0.1)' },
  { value: 'inactif', label: 'Inactif', color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
  { value: 'eviter', label: 'À éviter', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
]

const empty = (): Omit<Supplier, 'id' | 'createdAt'> => ({
  name: '', type: 'site', country: '', url: '', notes: '',
  rating: 5, status: 'actif', totalSpent: 0, totalOrders: 0,
})

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={14}
            className={`transition-colors ${(hovered || value) >= i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
          />
        </button>
      ))}
    </div>
  )
}

const TYPE_ICONS: Record<Type, React.ElementType> = {
  site: Globe, particulier: User, grossiste: Package, autre: Package,
}

export default function FournisseursPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'StockX', type: 'site', country: 'USA', url: 'https://stockx.com', notes: 'Bonne sélection sneakers, frais élevés', rating: 4, status: 'actif', totalSpent: 1240, totalOrders: 8, createdAt: '2026-01-15' },
    { id: '2', name: 'Vinted Pro', type: 'site', country: 'FR', url: 'https://vinted.fr', notes: 'Tech et vêtements, bons prix', rating: 5, status: 'actif', totalSpent: 680, totalOrders: 14, createdAt: '2026-02-01' },
    { id: '3', name: 'Mehdi R.', type: 'particulier', country: 'CH', url: '', notes: 'Fournisseur Jordan, fiable mais lent', rating: 3, status: 'inactif', totalSpent: 320, totalOrders: 2, createdAt: '2026-03-10' },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState(empty())
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | 'tous'>('tous')
  const [showDetail, setShowDetail] = useState<Supplier | null>(null)

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true) }
  function openEdit(s: Supplier) {
    setEditing(s)
    setForm({ name: s.name, type: s.type, country: s.country, url: s.url, notes: s.notes, rating: s.rating, status: s.status, totalSpent: s.totalSpent, totalOrders: s.totalOrders })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      setSuppliers(p => p.map(s => s.id === editing.id ? { ...s, ...form } : s))
    } else {
      setSuppliers(p => [...p, { ...form, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }])
    }
    setShowModal(false)
  }

  function del(id: string) { setSuppliers(p => p.filter(s => s.id !== id)) }

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.notes.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'tous' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalSpentAll = suppliers.filter(s => s.status === 'actif').reduce((a, s) => a + s.totalSpent, 0)
  const totalOrdersAll = suppliers.reduce((a, s) => a + s.totalOrders, 0)
  const avgRating = suppliers.length ? (suppliers.reduce((a, s) => a + s.rating, 0) / suppliers.length).toFixed(1) : '—'

  const statusInfo = (s: Status) => STATUSES.find(x => x.value === s)!

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Gestion</p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Fournisseurs</h1>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
          <Plus size={15} strokeWidth={2.5} /> Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Fournisseurs actifs', value: suppliers.filter(s => s.status === 'actif').length, color: '#10b981' },
          { label: 'Total dépensé (actifs)', value: `${totalSpentAll.toFixed(0)} CHF`, color: '#60a5fa' },
          { label: 'Commandes totales', value: totalOrdersAll, color: '#a78bfa' },
          { label: 'Note moyenne', value: `${avgRating} ⭐`, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="glass-stat rounded-2xl p-4">
            <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un fournisseur…" className="input-field pl-9" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"><X size={13} /></button>}
        </div>
        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: 'var(--surface-input)', borderColor: 'var(--border)' }}>
          {(['tous', 'actif', 'inactif', 'eviter'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filterStatus === s ? 'bg-emerald-600 text-white' : ''}`} style={{ color: filterStatus === s ? 'white' : 'var(--text-muted)' }}>
              {s === 'tous' ? 'Tous' : s === 'eviter' ? 'À éviter' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="glass-dashboard rounded-2xl py-16 text-center">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Aucun fournisseur</p>
          <button onClick={openAdd} className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors mt-2">+ Ajouter votre premier fournisseur</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => {
            const TypeIcon = TYPE_ICONS[s.type]
            const st = statusInfo(s.status)
            const typeLabel = TYPES.find(t => t.value === s.type)?.label
            return (
              <div key={s.id} className="glass-dashboard rounded-2xl p-5 space-y-4 cursor-pointer" onClick={() => setShowDetail(s)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-input)', border: '1px solid var(--border)' }}>
                      <TypeIcon size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{typeLabel}{s.country ? ` · ${s.country}` : ''}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </div>

                <div className="flex items-center justify-between">
                  <StarRating value={s.rating} />
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-gray-600 hover:text-emerald-400 transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg p-2.5" style={{ background: 'var(--surface-input)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Dépensé</p>
                    <p className="font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.totalSpent.toFixed(0)} CHF</p>
                  </div>
                  <div className="rounded-lg p-2.5" style={{ background: 'var(--surface-input)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Commandes</p>
                    <p className="font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.totalOrders}</p>
                  </div>
                </div>

                {s.notes && (
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{s.notes}</p>
                )}

                <div className="flex gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(s)} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg transition-all" style={{ background: 'var(--surface-input)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    <Pencil size={11} /> Modifier
                  </button>
                  <button onClick={() => del(s.id)} className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-lg transition-all hover:bg-red-500/10 text-red-400" style={{ border: '1px solid rgba(248,113,113,0.2)' }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL DETAIL ── */}
      {showDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="w-full max-w-md rounded-2xl p-6 border space-y-4" style={{ background: 'var(--surface-modal)', borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{showDetail.name}</h2>
              <button onClick={() => setShowDetail(null)} className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Type', value: TYPES.find(t => t.value === showDetail.type)?.label },
                { label: 'Pays', value: showDetail.country || '—' },
                { label: 'Statut', value: statusInfo(showDetail.status).label },
                { label: 'Note', value: `${showDetail.rating}/5 ⭐` },
                { label: 'Total dépensé', value: `${showDetail.totalSpent.toFixed(0)} CHF` },
                { label: 'Commandes', value: showDetail.totalOrders },
                { label: 'Depuis le', value: showDetail.createdAt },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: 'var(--surface-input)' }}>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            {showDetail.url && (
              <a href={showDetail.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                <ExternalLink size={13} /> {showDetail.url}
              </a>
            )}
            {showDetail.notes && (
              <div className="rounded-xl p-3" style={{ background: 'var(--surface-input)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Notes</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{showDetail.notes}</p>
              </div>
            )}
            {showDetail.status === 'eviter' && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertTriangle size={12} /> Ce fournisseur est marqué comme à éviter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL FORMULAIRE ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg rounded-2xl p-6 border max-h-[90vh] overflow-y-auto space-y-4" style={{ background: 'var(--surface-modal)', borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{editing ? 'Modifier' : 'Nouveau fournisseur'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nom *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="ex : StockX, Mehdi R." />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as Type }))} className="input-field">
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Pays</label>
                  <input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="input-field" placeholder="CH, FR, USA…" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Lien / URL</label>
                  <input type="url" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} className="input-field" placeholder="https://…" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Total dépensé (CHF)</label>
                  <input type="number" min="0" step="0.01" value={form.totalSpent || ''} onChange={e => setForm(p => ({ ...p, totalSpent: parseFloat(e.target.value) || 0 }))} className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nb commandes</label>
                  <input type="number" min="0" value={form.totalOrders || ''} onChange={e => setForm(p => ({ ...p, totalOrders: parseInt(e.target.value) || 0 }))} className="input-field" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Statut</label>
                  <div className="flex gap-2">
                    {STATUSES.map(s => (
                      <button key={s.value} type="button" onClick={() => setForm(p => ({ ...p, status: s.value }))}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                        style={{ background: form.status === s.value ? s.bg : 'var(--surface-input)', color: form.status === s.value ? s.color : 'var(--text-muted)', borderColor: form.status === s.value ? s.color + '40' : 'var(--border)' }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Note de fiabilité</label>
                  <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="input-field resize-none" rows={3} placeholder="Commentaires, délais, points forts/faibles…" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all">
                {editing ? 'Enregistrer' : 'Ajouter le fournisseur'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
