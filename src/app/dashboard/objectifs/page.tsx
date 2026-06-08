'use client'

import { useState } from 'react'
import { useApp, Goal } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Target, CheckCircle2 } from 'lucide-react'

export default function ObjectifsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, currency } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)
  const [form, setForm] = useState({ label: '', target: '', current: '', unit: 'devise', deadline: '' })

  function openAdd() {
    setEditing(null)
    setForm({ label: '', target: '', current: '0', unit: 'devise', deadline: new Date().toISOString().split('T')[0].slice(0, 7) + '-30' })
    setShowModal(true)
  }

  function openEdit(goal: Goal) {
    setEditing(goal)
    setForm({ label: goal.label, target: String(goal.target), current: String(goal.current), unit: goal.unit, deadline: goal.deadline })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = { label: form.label, target: parseFloat(form.target), current: parseFloat(form.current), unit: form.unit, deadline: form.deadline }
    editing ? updateGoal(editing.id, data) : addGoal(data)
    setShowModal(false)
  }

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 space-y-6">

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">Objectifs</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Vos objectifs</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-900/30 active:scale-[0.98]"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:block">Nouvel objectif</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="glass-dashboard rounded-2xl flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
            <Target size={22} strokeWidth={1.5} className="text-gray-700" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Aucun objectif</p>
          <p className="text-xs text-gray-700 mb-4">Créez votre premier objectif pour suivre votre progression</p>
          <button onClick={openAdd} className="text-emerald-500 text-sm hover:text-emerald-400 transition-colors font-medium">
            + Créer un objectif
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
            const done = pct >= 100
            const currentLabel = goal.unit === 'devise' ? formatCurrency(goal.current, currency) : `${goal.current} ${goal.unit}`
            const targetLabel  = goal.unit === 'devise' ? formatCurrency(goal.target, currency) : `${goal.target} ${goal.unit}`

            return (
              <div
                key={goal.id}
                className={`glass-dashboard rounded-2xl p-5 transition-all ${done ? 'border-emerald-500/20' : ''}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-2 min-w-0">
                    {done && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" strokeWidth={2} />}
                    <h3 className="text-sm font-semibold text-white truncate">{goal.label}</h3>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => openEdit(goal)}
                      className="text-gray-600 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <Pencil size={12} strokeWidth={1.75} />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 size={12} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-1.5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{currentLabel}</span>
                  <span className={`text-xs font-semibold tabular-nums ${done ? 'text-emerald-400' : 'text-gray-400'}`}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-emerald-400' : 'bg-emerald-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-700">Cible : {targetLabel}</span>
                  <span className="text-xs text-gray-700">Échéance : {goal.deadline}</span>
                </div>

                {done && (
                  <div className="mt-4 bg-emerald-500/[0.07] border border-emerald-500/15 rounded-xl p-2.5 text-center">
                    <span className="text-emerald-400 text-xs font-semibold">🎯 Objectif atteint !</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="glass-dashboard rounded-2xl w-full max-w-md p-6 animate-card-enter border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold">{editing ? "Modifier l'objectif" : 'Nouvel objectif'}</h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  {editing ? 'Mettez à jour vos informations' : 'Définissez votre prochain objectif'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <X size={16} strokeWidth={2} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom de l&apos;objectif</label>
                <input required value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="ex : Bénéfice mensuel" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-600/60 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
                <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600/60 transition-colors">
                  <option value="devise" className="bg-[#111]">Montant ({currency})</option>
                  <option value="ventes" className="bg-[#111]">Nombre de ventes</option>
                  <option value="articles" className="bg-[#111]">Articles vendus</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Cible</label>
                  <input required type="number" min="0" step="any" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} placeholder="2000" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-600/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Actuel</label>
                  <input required type="number" min="0" step="any" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} placeholder="0" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-emerald-600/60 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Échéance</label>
                <input required type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600/60 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-emerald-900/30">
                {editing ? 'Enregistrer' : "Créer l'objectif"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
