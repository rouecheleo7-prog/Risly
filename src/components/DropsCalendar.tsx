'use client'

import { useState } from 'react'
import { useApp, Drop } from '@/lib/store'
import { Plus, X, CalendarDays, ShoppingCart, TrendingUp, Trash2 } from 'lucide-react'

export default function DropsCalendar() {
  const { drops, addDrop, deleteDrop } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', type: 'achat' as Drop['type'], note: '' })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    addDrop(form)
    setForm({ title: '', date: '', type: 'achat', note: '' })
    setShowForm(false)
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = drops.filter(d => d.date >= today).slice(0, 6)
  const past = drops.filter(d => d.date < today).slice(0, 3)

  return (
    <div className="glass-dashboard rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <CalendarDays size={13} strokeWidth={1.75} className="text-gray-400" />
          </div>
          <h2 className="text-sm font-semibold">Calendrier des drops</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
        >
          <Plus size={12} strokeWidth={2.5} />
          Ajouter
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mb-5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input required placeholder="Nom du drop (ex: Jordan 4 Military Blue)" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field w-full" />
            </div>
            <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field" />
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as Drop['type'] }))} className="input-field">
              <option value="achat" className="bg-[#111]">Achat / Drop</option>
              <option value="vente" className="bg-[#111]">Vente prévue</option>
            </select>
            <div className="col-span-2">
              <input placeholder="Note (optionnel)" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} className="input-field w-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-semibold transition-all">
              Ajouter
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-600 hover:text-white px-3 py-2 rounded-xl text-xs border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
              <X size={12} />
            </button>
          </div>
        </form>
      )}

      {/* Upcoming */}
      {upcoming.length === 0 && !showForm ? (
        <div className="text-center py-8">
          <p className="text-xs text-gray-700">Aucun drop planifié</p>
          <button onClick={() => setShowForm(true)} className="text-xs text-emerald-600 hover:text-emerald-500 mt-1 transition-colors">
            + Ajouter votre prochain drop
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map(drop => {
            const daysUntil = Math.ceil((new Date(drop.date).getTime() - new Date(today).getTime()) / 86400000)
            const isToday = daysUntil === 0
            const isSoon = daysUntil <= 3
            return (
              <div key={drop.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors group ${isToday ? 'bg-emerald-500/[0.07] border-emerald-500/20' : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.09]'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${drop.type === 'achat' ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}>
                  {drop.type === 'achat'
                    ? <ShoppingCart size={13} strokeWidth={1.75} className="text-blue-400" />
                    : <TrendingUp size={13} strokeWidth={1.75} className="text-emerald-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/90 truncate">{drop.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {isToday ? "Aujourd'hui" : isSoon ? `Dans ${daysUntil}j` : drop.date}
                    {drop.note && <span className="ml-1 text-gray-700">· {drop.note}</span>}
                  </p>
                </div>
                <button
                  onClick={() => deleteDrop(drop.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 p-1 rounded-lg transition-all"
                >
                  <Trash2 size={11} strokeWidth={1.75} />
                </button>
              </div>
            )
          })}
          {past.length > 0 && (
            <div className="pt-2 border-t border-white/[0.04]">
              <p className="text-xs text-gray-700 mb-2">Passés</p>
              {past.map(drop => (
                <div key={drop.id} className="flex items-center gap-2 py-1.5 opacity-40 group">
                  <span className="text-xs text-gray-600 line-through truncate flex-1">{drop.title}</span>
                  <span className="text-xs text-gray-700 shrink-0">{drop.date}</span>
                  <button onClick={() => deleteDrop(drop.id)} className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 p-0.5 transition-all">
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
