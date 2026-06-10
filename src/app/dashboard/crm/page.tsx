'use client'

import { useState } from 'react'
import { Plus, X, Pencil, Trash2, Search, Phone, AtSign, MessageCircle, Bell, ChevronDown, ChevronUp } from 'lucide-react'

type Status = 'prospect' | 'client' | 'vip' | 'inactif'
type Contact = 'phone' | 'instagram' | 'whatsapp' | 'autre'

interface Purchase {
  id: string
  product: string
  amount: number
  date: string
}

interface Client {
  id: string
  name: string
  contact: string
  contactType: Contact
  status: Status
  notes: string
  followUpDate: string
  totalSpent: number
  purchases: Purchase[]
  tags: string[]
  createdAt: string
}

const STATUSES: { value: Status; label: string; color: string; bg: string }[] = [
  { value: 'prospect', label: 'Prospect', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
  { value: 'client', label: 'Client', color: '#10b981', bg: 'rgba(5,150,105,0.1)' },
  { value: 'vip', label: 'VIP ⭐', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { value: 'inactif', label: 'Inactif', color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
]

const CONTACT_ICONS: Record<Contact, React.ElementType> = {
  phone: Phone, instagram: AtSign, whatsapp: MessageCircle, autre: Phone,
}

const DEMO: Client[] = [
  { id: '1', name: 'Thomas L.', contact: '@thomas_kicks', contactType: 'instagram', status: 'vip', notes: 'Pointure 42, fan Jordan. Achète vite si bonne affaire.', followUpDate: '2026-06-15', totalSpent: 840, purchases: [{ id: 'p1', product: 'Jordan 4 Military Blue', amount: 380, date: '2026-05-10' }, { id: 'p2', product: 'Jordan 1 Chicago', amount: 460, date: '2026-04-22' }], tags: ['sneakers', 'jordan'], createdAt: '2026-03-01' },
  { id: '2', name: 'Sarah M.', contact: '+41 76 123 45 67', contactType: 'whatsapp', status: 'client', notes: 'Cherche iPhone reconditionné. Budget 400 CHF max.', followUpDate: '2026-06-20', totalSpent: 420, purchases: [{ id: 'p3', product: 'iPhone 13 128GB', amount: 420, date: '2026-05-28' }], tags: ['tech'], createdAt: '2026-04-15' },
  { id: '3', name: 'Kevin B.', contact: '@kevin_resell', contactType: 'instagram', status: 'prospect', notes: 'Intéressé par les Yeezy. Suit mes stories.', followUpDate: '2026-06-12', totalSpent: 0, purchases: [], tags: ['sneakers', 'yeezy'], createdAt: '2026-06-01' },
]

const emptyClient = (): Omit<Client, 'id' | 'createdAt'> => ({
  name: '', contact: '', contactType: 'instagram', status: 'prospect',
  notes: '', followUpDate: '', totalSpent: 0, purchases: [], tags: [],
})

export default function CRMPage() {
  const [clients, setClients] = useState<Client[]>(DEMO)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState(emptyClient())
  const [tagInput, setTagInput] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | 'tous'>('tous')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newPurchase, setNewPurchase] = useState({ product: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const [showPurchaseForm, setShowPurchaseForm] = useState<string | null>(null)

  function openAdd() { setEditing(null); setForm(emptyClient()); setTagInput(''); setShowModal(true) }
  function openEdit(c: Client) {
    setEditing(c)
    setForm({ name: c.name, contact: c.contact, contactType: c.contactType, status: c.status, notes: c.notes, followUpDate: c.followUpDate, totalSpent: c.totalSpent, purchases: c.purchases, tags: [...c.tags] })
    setTagInput('')
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const tags = tagInput.trim() ? [...form.tags, ...tagInput.split(',').map(t => t.trim()).filter(Boolean)] : form.tags
    if (editing) {
      setClients(p => p.map(c => c.id === editing.id ? { ...c, ...form, tags } : c))
    } else {
      setClients(p => [...p, { ...form, tags, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }])
    }
    setShowModal(false)
  }

  function addPurchase(clientId: string) {
    if (!newPurchase.product || !newPurchase.amount) return
    const purchase: Purchase = { id: Date.now().toString(), product: newPurchase.product, amount: parseFloat(newPurchase.amount) || 0, date: newPurchase.date }
    setClients(p => p.map(c => c.id === clientId ? {
      ...c,
      purchases: [...c.purchases, purchase],
      totalSpent: c.totalSpent + purchase.amount,
      status: c.status === 'prospect' ? 'client' : c.status,
    } : c))
    setNewPurchase({ product: '', amount: '', date: new Date().toISOString().split('T')[0] })
    setShowPurchaseForm(null)
  }

  function removeTag(tag: string) { setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) })) }

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q))
    const matchStatus = filterStatus === 'tous' || c.status === filterStatus
    return matchSearch && matchStatus
  }).sort((a, b) => {
    const order: Status[] = ['vip', 'client', 'prospect', 'inactif']
    return order.indexOf(a.status) - order.indexOf(b.status)
  })

  const today = new Date().toISOString().split('T')[0]
  const followUps = clients.filter(c => c.followUpDate && c.followUpDate <= today && c.status !== 'inactif')

  const totalCA = clients.reduce((s, c) => s + c.totalSpent, 0)
  const vipCount = clients.filter(c => c.status === 'vip').length

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Clients</p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>CRM de vente</h1>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
          <Plus size={15} strokeWidth={2.5} /> Ajouter un client
        </button>
      </div>

      {/* Rappels */}
      {followUps.length > 0 && (
        <div className="rounded-2xl p-4 border border-amber-500/20 flex items-start gap-3" style={{ background: 'rgba(251,191,36,0.06)' }}>
          <Bell size={15} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400">
              {followUps.length} relance{followUps.length > 1 ? 's' : ''} à faire aujourd&apos;hui
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {followUps.map(c => c.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total clients', value: clients.filter(c => c.status !== 'prospect').length, color: '#10b981' },
          { label: 'Prospects', value: clients.filter(c => c.status === 'prospect').length, color: '#60a5fa' },
          { label: 'VIP', value: vipCount, color: '#fbbf24' },
          { label: 'CA clients', value: `${totalCA.toFixed(0)} CHF`, color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="glass-stat rounded-2xl p-4">
            <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, contact, tag…" className="input-field pl-9" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"><X size={13} /></button>}
        </div>
        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: 'var(--surface-input)', borderColor: 'var(--border)' }}>
          {(['tous', 'vip', 'client', 'prospect', 'inactif'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
              style={{ background: filterStatus === s ? '#059669' : 'transparent', color: filterStatus === s ? 'white' : 'var(--text-muted)' }}>
              {s === 'tous' ? 'Tous' : s === 'vip' ? 'VIP' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Liste clients */}
      {filtered.length === 0 ? (
        <div className="glass-dashboard rounded-2xl py-16 text-center">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Aucun client</p>
          <button onClick={openAdd} className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">+ Ajouter votre premier client</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(client => {
            const st = STATUSES.find(s => s.value === client.status)!
            const ContactIcon = CONTACT_ICONS[client.contactType]
            const expanded = expandedId === client.id
            const needsFollowUp = client.followUpDate && client.followUpDate <= today

            return (
              <div key={client.id} className="glass-dashboard rounded-2xl overflow-hidden">
                {/* Row principale */}
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpandedId(expanded ? null : client.id)}>
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: st.bg, color: st.color }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{client.name}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      {needsFollowUp && <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">🔔 À relancer</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <ContactIcon size={10} /> {client.contact}
                      </span>
                      {client.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-input)', color: 'var(--text-muted)' }}>#{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-400">{client.totalSpent.toFixed(0)} CHF</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{client.purchases.length} achat{client.purchases.length > 1 ? 's' : ''}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openEdit(client)} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setClients(p => p.filter(c => c.id !== client.id))} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                    {expanded ? <ChevronUp size={13} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                </div>

                {/* Détail expandé */}
                {expanded && (
                  <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                      {/* Notes */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Notes</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{client.notes || 'Aucune note'}</p>
                        {client.followUpDate && (
                          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                            🗓 Relance prévue : <span className={needsFollowUp ? 'text-amber-400 font-semibold' : ''}>{client.followUpDate}</span>
                          </p>
                        )}
                      </div>

                      {/* Historique achats */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Historique</p>
                        {client.purchases.length === 0 ? (
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Aucun achat enregistré</p>
                        ) : (
                          <div className="space-y-1.5">
                            {client.purchases.map(p => (
                              <div key={p.id} className="flex justify-between text-xs rounded-lg px-3 py-2" style={{ background: 'var(--surface-input)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{p.product}</span>
                                <span className="font-semibold text-emerald-400">{p.amount} CHF</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Ajouter achat */}
                        {showPurchaseForm === client.id ? (
                          <div className="mt-2 space-y-2">
                            <input value={newPurchase.product} onChange={e => setNewPurchase(p => ({ ...p, product: e.target.value }))} className="input-field py-2 text-xs" placeholder="Article" />
                            <div className="flex gap-2">
                              <input type="number" value={newPurchase.amount} onChange={e => setNewPurchase(p => ({ ...p, amount: e.target.value }))} className="input-field py-2 text-xs" placeholder="Montant CHF" />
                              <input type="date" value={newPurchase.date} onChange={e => setNewPurchase(p => ({ ...p, date: e.target.value }))} className="input-field py-2 text-xs" />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => addPurchase(client.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold transition-all">Ajouter</button>
                              <button onClick={() => setShowPurchaseForm(null)} className="px-3 py-2 rounded-lg text-xs transition-all" style={{ background: 'var(--surface-input)', color: 'var(--text-muted)' }}>Annuler</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setShowPurchaseForm(client.id)} className="mt-2 text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                            + Enregistrer un achat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL FORMULAIRE ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg rounded-2xl p-6 border max-h-[90vh] overflow-y-auto space-y-4" style={{ background: 'var(--surface-modal)', borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{editing ? 'Modifier le client' : 'Nouveau client'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nom *</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="ex : Thomas L." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Contact</label>
                  <input value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} className="input-field" placeholder="@pseudo ou numéro" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Via</label>
                  <select value={form.contactType} onChange={e => setForm(p => ({ ...p, contactType: e.target.value as Contact }))} className="input-field">
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Téléphone</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Statut</label>
                <div className="grid grid-cols-4 gap-2">
                  {STATUSES.map(s => (
                    <button key={s.value} type="button" onClick={() => setForm(p => ({ ...p, status: s.value }))}
                      className="py-2 rounded-xl text-xs font-semibold border transition-all"
                      style={{ background: form.status === s.value ? s.bg : 'var(--surface-input)', color: form.status === s.value ? s.color : 'var(--text-muted)', borderColor: form.status === s.value ? s.color + '40' : 'var(--border)' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Date de relance</label>
                <input type="date" value={form.followUpDate} onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))} className="input-field" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="input-field resize-none" rows={3} placeholder="Préférences, pointure, budget, notes…" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--surface-input)', color: 'var(--text-secondary)' }}>
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-gray-600 hover:text-red-400"><X size={9} /></button>
                    </span>
                  ))}
                </div>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (tagInput.trim()) { setForm(p => ({ ...p, tags: [...p.tags, ...tagInput.split(',').map(t => t.trim()).filter(Boolean)] })); setTagInput('') }
                    }
                  }}
                  className="input-field" placeholder="sneakers, tech, jordan… (Entrée pour valider)" />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all">
                {editing ? 'Enregistrer' : 'Ajouter le client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
