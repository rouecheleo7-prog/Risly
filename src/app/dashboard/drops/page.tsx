'use client'

import { useState } from 'react'
import { useApp, Drop } from '@/lib/store'
import PlanGate from '@/components/PlanGate'
import { Plus, X, ChevronLeft, ChevronRight, ShoppingCart, TrendingUp, Trash2, Pencil, Bell } from 'lucide-react'

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

const emptyForm = () => ({ title: '', date: '', type: 'achat' as Drop['type'], note: '' })

export default function DropsPage() {
  return (
    <PlanGate requiredPlan="pro" featureName="Calendrier de drops">
      <DropsPageContent />
    </PlanGate>
  )
}

function DropsPageContent() {
  const { drops, addDrop, deleteDrop } = useApp()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [showModal, setShowModal] = useState(false)
  const [editingDrop, setEditingDrop] = useState<Drop | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const today = now.toISOString().split('T')[0]
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  function getDropsForDay(dateStr: string) {
    return drops.filter(d => d.date === dateStr)
  }

  function openAdd(dateStr?: string) {
    setEditingDrop(null)
    setForm({ ...emptyForm(), date: dateStr || '' })
    setShowModal(true)
  }

  function openEdit(drop: Drop) {
    setEditingDrop(drop)
    setForm({ title: drop.title, date: drop.date, type: drop.type, note: drop.note || '' })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingDrop) {
      // Pour l'instant on supprime et recrée (simple)
      deleteDrop(editingDrop.id)
    }
    addDrop(form)
    setShowModal(false)
  }

  // Drops triés pour la liste
  const upcomingDrops = drops.filter(d => d.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const pastDrops = drops.filter(d => d.date < today).sort((a, b) => b.date.localeCompare(a.date))

  // Drops du jour sélectionné
  const selectedDrops = selectedDay ? getDropsForDay(selectedDay) : []

  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - new Date(today).getTime()) / 86400000)
    if (diff === 0) return "Aujourd'hui"
    if (diff === 1) return 'Demain'
    if (diff <= 7) return `Dans ${diff} jours`
    return new Date(date).toLocaleDateString('fr', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 pb-24 max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Agenda</p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Calendrier de drops</h1>
        </div>
        <button onClick={() => openAdd()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95">
          <Plus size={16} strokeWidth={2.5} /> Ajouter
        </button>
      </div>

      {/* Calendrier */}
      <div className="rounded-3xl overflow-hidden border" style={{ background: 'var(--surface-card)', borderColor: 'var(--border)' }}>
        {/* Navigation mois */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <button onClick={prevMonth} className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90" style={{ background: 'var(--surface-input)', color: 'var(--text-secondary)' }}>
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <p className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>{MONTHS[month]} {year}</p>
          <button onClick={nextMonth} className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90" style={{ background: 'var(--surface-input)', color: 'var(--text-secondary)' }}>
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 px-3 pt-3">
          {DAYS.map(d => (
            <div key={d} className="text-center py-1">
              <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{d}</span>
            </div>
          ))}
        </div>

        {/* Grille jours */}
        <div className="grid grid-cols-7 gap-1 p-3">
          {/* Cellules vides début */}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

          {/* Jours du mois */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayDrops = getDropsForDay(dateStr)
            const isToday = dateStr === today
            const isSelected = dateStr === selectedDay
            const isPast = dateStr < today
            const hasAchat = dayDrops.some(d => d.type === 'achat')
            const hasVente = dayDrops.some(d => d.type === 'vente')
            const isUrgent = dayDrops.some(d => {
              const diff = Math.ceil((new Date(d.date).getTime() - new Date(today).getTime()) / 86400000)
              return diff >= 0 && diff <= 2
            })

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                className="relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95"
                style={{
                  background: isSelected ? '#059669' : isToday ? 'rgba(5,150,105,0.15)' : 'transparent',
                  border: isToday && !isSelected ? '1px solid rgba(5,150,105,0.4)' : '1px solid transparent',
                }}
              >
                <span className={`text-sm font-bold leading-none ${isSelected ? 'text-white' : isToday ? 'text-emerald-400' : isPast ? '' : ''}`}
                  style={{ color: isSelected ? 'white' : isToday ? '#10b981' : isPast ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {day}
                </span>
                {dayDrops.length > 0 && (
                  <div className="flex gap-0.5">
                    {hasAchat && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-400'}`} />}
                    {hasVente && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />}
                  </div>
                )}
                {isUrgent && !isPast && dayDrops.length > 0 && !isSelected && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>
            )
          })}
        </div>

        {/* Légende */}
        <div className="flex items-center gap-4 px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Achat
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Vente
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2 h-2 rounded-full bg-red-500" /> Urgent
          </span>
        </div>
      </div>

      {/* Drops du jour sélectionné */}
      {selectedDay && (
        <div className="rounded-3xl border overflow-hidden" style={{ background: 'var(--surface-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {new Date(selectedDay).toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <button onClick={() => openAdd(selectedDay)} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              <Plus size={13} /> Ajouter
            </button>
          </div>
          {selectedDrops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aucun drop ce jour</p>
              <button onClick={() => openAdd(selectedDay)} className="text-sm text-emerald-500 hover:text-emerald-400 mt-2 transition-colors">+ Ajouter un drop</button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {selectedDrops.map(drop => (
                <DropRow key={drop.id} drop={drop} onEdit={() => openEdit(drop)} onDelete={() => deleteDrop(drop.id)} showDate={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prochains drops */}
      {upcomingDrops.length > 0 && (
        <div className="rounded-3xl border overflow-hidden" style={{ background: 'var(--surface-card)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-emerald-400" />
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>À venir</p>
              <span className="text-xs px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/20" style={{ background: 'rgba(5,150,105,0.08)' }}>{upcomingDrops.length}</span>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {upcomingDrops.map(drop => (
              <DropRow key={drop.id} drop={drop} daysUntil={daysUntil(drop.date)} onEdit={() => openEdit(drop)} onDelete={() => deleteDrop(drop.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Passés */}
      {pastDrops.length > 0 && (
        <div className="rounded-3xl border overflow-hidden" style={{ background: 'var(--surface-card)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="font-bold" style={{ color: 'var(--text-muted)' }}>Passés</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {pastDrops.slice(0, 5).map(drop => (
              <DropRow key={drop.id} drop={drop} past onEdit={() => openEdit(drop)} onDelete={() => deleteDrop(drop.id)} />
            ))}
          </div>
        </div>
      )}

      {drops.length === 0 && (
        <div className="rounded-3xl border py-16 text-center" style={{ background: 'var(--surface-card)', borderColor: 'var(--border)' }}>
          <p className="text-4xl mb-3">📅</p>
          <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Aucun drop planifié</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Ajoutez vos prochains achats et ventes</p>
          <button onClick={() => openAdd()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all">
            + Ajouter un drop
          </button>
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 sm:items-center" onClick={() => setShowModal(false)}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border p-6 space-y-4" style={{ background: 'var(--surface-modal)', borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>

            {/* Handle mobile */}
            <div className="w-10 h-1 rounded-full mx-auto sm:hidden" style={{ background: 'var(--border)' }} />

            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>{editingDrop ? 'Modifier' : 'Nouveau drop'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-input)', color: 'var(--text-muted)' }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Titre *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field text-base" placeholder="ex : Jordan 4 Military Blue" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Date *</label>
                <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field text-base" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'achat', label: '🛒 Achat', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
                    { value: 'vente', label: '💰 Vente', color: '#10b981', bg: 'rgba(5,150,105,0.1)' },
                  ].map(t => (
                    <button key={t.value} type="button" onClick={() => setForm(p => ({ ...p, type: t.value as Drop['type'] }))}
                      className="py-3.5 rounded-2xl text-sm font-bold border transition-all active:scale-95"
                      style={{
                        background: form.type === t.value ? t.bg : 'var(--surface-input)',
                        color: form.type === t.value ? t.color : 'var(--text-muted)',
                        borderColor: form.type === t.value ? t.color + '40' : 'var(--border)',
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Note</label>
                <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} className="input-field text-base" placeholder="SNKRS 10h, acheteur confirmé…" />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-base transition-all active:scale-95">
                {editingDrop ? 'Enregistrer' : 'Ajouter le drop'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function DropRow({ drop, daysUntil, past, showDate = true, onEdit, onDelete }: {
  drop: Drop
  daysUntil?: string
  past?: boolean
  showDate?: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const isUrgent = daysUntil && (daysUntil === "Aujourd'hui" || daysUntil === 'Demain')

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      {/* Icône type */}
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: drop.type === 'achat' ? 'rgba(59,130,246,0.1)' : 'rgba(5,150,105,0.1)' }}>
        {drop.type === 'achat'
          ? <ShoppingCart size={16} className="text-blue-400" />
          : <TrendingUp size={16} className="text-emerald-400" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: past ? 'var(--text-muted)' : 'var(--text-primary)' }}>{drop.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {showDate && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{drop.date}</p>}
          {drop.note && <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{drop.note}</p>}
        </div>
      </div>

      {daysUntil && (
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-xl shrink-0 whitespace-nowrap"
          style={{
            background: isUrgent ? 'rgba(239,68,68,0.1)' : 'var(--surface-input)',
            color: isUrgent ? '#f87171' : 'var(--text-muted)',
          }}>
          {daysUntil}
        </span>
      )}

      <div className="flex gap-1 shrink-0">
        <button onClick={onEdit} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90" style={{ background: 'var(--surface-input)', color: 'var(--text-muted)' }}>
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:bg-red-500/10 text-red-400">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
