'use client'

import { useState, useEffect } from 'react'
import { Home, Users, Calculator, Sparkles, FileText, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function parseUtcDate(value: string) {
  return new Date(/[Zz]|[+-]\d\d:\d\d$/.test(value) ? value : value + 'Z')
}

export default function ImmobilierDemo() {
  const [activeTab, setActiveTab] = useState<'crm' | 'calculator' | 'generator' | 'estimateur' | 'comparateur' | 'visites' | 'templates' | 'notes'>('crm')

  const tabs = [
    { id: 'crm', label: 'CRM & Prospects', icon: Users },
    { id: 'calculator', label: 'Calculateurs', icon: Calculator },
    { id: 'generator', label: 'Générateur IA', icon: Sparkles },
    { id: 'estimateur', label: 'Estimateur Prix', icon: FileText },
    { id: 'comparateur', label: 'Comparateur', icon: FileText },
    { id: 'visites', label: 'Calendrier Visites', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'notes', label: 'Notes', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-slate-950">Dashboard Immobilier</h1>
            <p className="text-sm text-slate-500">Démo - Outil complet pour agents immobiliers</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg">
            <Home className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-200'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-8 shadow-sm">
            {activeTab === 'crm' && <CRMTab />}
            {activeTab === 'calculator' && <CalculatorTab />}
            {activeTab === 'generator' && <GeneratorTab />}
            {activeTab === 'estimateur' && <EstimateurTab />}
            {activeTab === 'comparateur' && <ComparateurTab />}
            {activeTab === 'visites' && <VisitesTab />}
            {activeTab === 'templates' && <TemplatesTab />}
            {activeTab === 'notes' && <NotesTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CRM TAB ───
function CRMTab() {
  const [prospects, setProspects] = useState<any[]>([
    {
      id: 'demo-1',
      nom: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '+41 76 123 4567',
      budget: '800\'000 CHF',
      status: 'Actif',
      localisation: 'Lausanne',
      nombre_pieces: '3-4',
      type_bien: 'Appartement',
      surface_min: '100',
      surface_max: '150',
      budget_min: '700\'000',
      budget_max: '900\'000',
      priorites: 'Proximité transports',
      date_suivi: '2026-08-25',
      favoris: false
    },
    {
      id: 'demo-2',
      nom: 'Marie Martin',
      email: 'marie@example.com',
      phone: '+41 78 987 6543',
      budget: '1\'200\'000 CHF',
      status: 'Intéressé',
      localisation: 'Genève',
      nombre_pieces: '4-5',
      type_bien: 'Maison',
      surface_min: '200',
      surface_max: '300',
      budget_min: '1\'000\'000',
      budget_max: '1\'500\'000',
      priorites: 'Jardin, parking',
      date_suivi: '2026-08-20',
      favoris: true
    }
  ])
  const [loading, setLoading] = useState(true)
  const [newContact, setNewContact] = useState({
    nom: '',
    email: '',
    phone: '',
    budget: '',
    localisation: '',
    nombre_pieces: '',
    type_bien: '',
    surface_min: '',
    surface_max: '',
    budget_min: '',
    budget_max: '',
    priorites: '',
    date_suivi: '',
    favoris: false
  })
  const [selectedProspect, setSelectedProspect] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState('')
  const [error, setError] = useState('')
  const [searchProspect, setSearchProspect] = useState('')
  const [biens, setBiens] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})

  const statuses = ['Nouveau', 'Actif', 'Intéressé', 'Visite', 'Achat', 'Fermé']

  useEffect(() => {
    loadProspects()
    loadBiens()
  }, [])

  useEffect(() => {
    if (selectedProspect) {
      loadNotes(selectedProspect.id)
    }
  }, [selectedProspect])

  const loadBiens = async () => {
    try {
      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      const { data, error: err } = await createClient()
        .from('comparables')
        .select('*')
        .eq('user_id', user.id)

      if (err) throw err
      setBiens(data || [])
    } catch (err: any) {
      // pas bloquant pour le CRM
    }
  }

  const parseNumber = (val: any) => {
    if (val === null || val === undefined || val === '') return null
    const n = parseFloat(String(val).replace(/[^0-9.]/g, ''))
    return isNaN(n) ? null : n
  }

  const normalize = (val: any) => String(val || '').trim().toLowerCase()

  const getBiensCompatibles = (prospect: any) => {
    if (!prospect) return []
    const surfaceMin = parseNumber(prospect.surface_min)
    const surfaceMax = parseNumber(prospect.surface_max)
    const budgetMin = parseNumber(prospect.budget_min)
    const budgetMax = parseNumber(prospect.budget_max)

    return biens
      .map(bien => {
        let score = 0
        let total = 0

        if (prospect.localisation) {
          total++
          if (normalize(bien.localite) === normalize(prospect.localisation)) score++
        }
        if (prospect.type_bien) {
          total++
          if (normalize(bien.type) === normalize(prospect.type_bien)) score++
        }
        if (surfaceMin !== null || surfaceMax !== null) {
          total++
          const s = parseNumber(bien.surface)
          if (s !== null && (surfaceMin === null || s >= surfaceMin) && (surfaceMax === null || s <= surfaceMax)) score++
        }
        if (budgetMin !== null || budgetMax !== null) {
          total++
          const p = parseNumber(bien.prix)
          if (p !== null && (budgetMin === null || p >= budgetMin) && (budgetMax === null || p <= budgetMax)) score++
        }

        return { ...bien, matchScore: score, matchTotal: total }
      })
      .filter(b => b.matchTotal > 0 && b.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)
  }

  const loadProspects = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      const { data, error: err } = await createClient()
        .from('prospects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      setProspects(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadNotes = async (prospectId: string) => {
    if (String(prospectId).startsWith('demo-')) {
      setNotes([])
      return
    }
    try {
      const { data, error: err } = await createClient()
        .from('prospect_notes')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false })

      if (err) throw err
      setNotes(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const addProspect = async () => {
    try {
      if (!newContact.nom) {
        setError('Le nom est requis')
        return
      }

      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      const { error: err } = await createClient()
        .from('prospects')
        .insert([{
          user_id: user.id,
          nom: newContact.nom,
          email: newContact.email || null,
          phone: newContact.phone || null,
          budget: newContact.budget || null,
          localisation: newContact.localisation || null,
          type_bien: newContact.type_bien || null,
          nombre_pieces: newContact.nombre_pieces || null,
          surface_min: newContact.surface_min || null,
          surface_max: newContact.surface_max || null,
          budget_min: newContact.budget_min || null,
          budget_max: newContact.budget_max || null,
          priorites: newContact.priorites || null,
          date_suivi: newContact.date_suivi || null,
          status: 'Nouveau',
          favoris: false
        }])

      if (err) throw err
      setNewContact({ nom: '', email: '', phone: '', budget: '', localisation: '', nombre_pieces: '', type_bien: '', surface_min: '', surface_max: '', budget_min: '', budget_max: '', priorites: '', date_suivi: '', favoris: false })
      setError('')
      loadProspects()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateStatus = async (prospectId: string, status: string) => {
    try {
      const { error: err } = await createClient()
        .from('prospects')
        .update({ status, updated_at: new Date() })
        .eq('id', prospectId)

      if (err) throw err
      setProspects(prospects.map(p => p.id === prospectId ? { ...p, status } : p))
      if (selectedProspect?.id === prospectId) {
        setSelectedProspect({ ...selectedProspect, status })
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const addNote = async () => {
    try {
      if (!newNote.trim() || !selectedProspect) return

      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      const { error: err } = await createClient()
        .from('prospect_notes')
        .insert([{
          prospect_id: selectedProspect.id,
          user_id: user.id,
          note: newNote
        }])

      if (err) throw err
      setNewNote('')
      loadNotes(selectedProspect.id)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteProspect = async (prospectId: string) => {
    try {
      const { error: err } = await createClient()
        .from('prospects')
        .delete()
        .eq('id', prospectId)

      if (err) throw err
      setProspects(prospects.filter(p => p.id !== prospectId))
      setSelectedProspect(null)
      setNotes([])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const startEditing = () => {
    setEditForm({
      nom: selectedProspect.nom || '',
      email: selectedProspect.email || '',
      phone: selectedProspect.phone || '',
      budget: selectedProspect.budget || '',
      localisation: selectedProspect.localisation || '',
      type_bien: selectedProspect.type_bien || '',
      nombre_pieces: selectedProspect.nombre_pieces || '',
      surface_min: selectedProspect.surface_min || '',
      surface_max: selectedProspect.surface_max || '',
      budget_min: selectedProspect.budget_min || '',
      budget_max: selectedProspect.budget_max || '',
      priorites: selectedProspect.priorites || '',
      date_suivi: selectedProspect.date_suivi || ''
    })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditForm({})
  }

  const saveEditing = async () => {
    try {
      const updated = { ...selectedProspect, ...editForm }

      if (!String(selectedProspect.id).startsWith('demo-')) {
        const { error: err } = await createClient()
          .from('prospects')
          .update({
            nom: editForm.nom,
            email: editForm.email || null,
            phone: editForm.phone || null,
            budget: editForm.budget || null,
            localisation: editForm.localisation || null,
            type_bien: editForm.type_bien || null,
            nombre_pieces: editForm.nombre_pieces || null,
            surface_min: editForm.surface_min || null,
            surface_max: editForm.surface_max || null,
            budget_min: editForm.budget_min || null,
            budget_max: editForm.budget_max || null,
            priorites: editForm.priorites || null,
            date_suivi: editForm.date_suivi || null,
            updated_at: new Date()
          })
          .eq('id', selectedProspect.id)

        if (err) throw err
      }

      setProspects(prospects.map(p => p.id === selectedProspect.id ? updated : p))
      setSelectedProspect(updated)
      setIsEditing(false)
      setError('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const filteredProspects = prospects.filter(p => p.nom.toLowerCase().includes(searchProspect.toLowerCase()))

  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <div className="sm:col-span-1 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 mb-4">Ajouter un prospect</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Nom complet" value={newContact.nom} onChange={(e) => setNewContact({ ...newContact, nom: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <input type="email" placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <input type="tel" placeholder="Téléphone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <input type="text" placeholder="Budget" value={newContact.budget} onChange={(e) => setNewContact({ ...newContact, budget: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />

            <p className="text-xs font-semibold text-slate-500 uppercase pt-2">Critères de recherche</p>
            <input type="text" placeholder="Localisation" value={newContact.localisation} onChange={(e) => setNewContact({ ...newContact, localisation: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <input type="text" placeholder="Type de bien" value={newContact.type_bien} onChange={(e) => setNewContact({ ...newContact, type_bien: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <input type="text" placeholder="Nombre de pièces" value={newContact.nombre_pieces} onChange={(e) => setNewContact({ ...newContact, nombre_pieces: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Surface min (m²)" value={newContact.surface_min} onChange={(e) => setNewContact({ ...newContact, surface_min: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
              <input type="number" placeholder="Surface max (m²)" value={newContact.surface_max} onChange={(e) => setNewContact({ ...newContact, surface_max: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
              <input type="text" placeholder="Budget min (CHF)" value={newContact.budget_min} onChange={(e) => setNewContact({ ...newContact, budget_min: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
              <input type="text" placeholder="Budget max (CHF)" value={newContact.budget_max} onChange={(e) => setNewContact({ ...newContact, budget_max: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            </div>
            <input type="text" placeholder="Priorités" value={newContact.priorites} onChange={(e) => setNewContact({ ...newContact, priorites: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date de suivi</label>
              <input type="date" value={newContact.date_suivi} onChange={(e) => setNewContact({ ...newContact, date_suivi: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            </div>

            <button onClick={addProspect} className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-sm">+ Ajouter prospect</button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950 mb-3">Mes prospects ({filteredProspects.length})</h2>
          <div className="mb-3">
            <input type="text" placeholder="Rechercher par nom..." value={searchProspect} onChange={(e) => setSearchProspect(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-sm" />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? <p className="text-sm text-slate-500">Chargement...</p> : filteredProspects.length === 0 ? <p className="text-sm text-slate-500">Aucun prospect trouvé</p> : filteredProspects.map((prospect) => (
              <button key={prospect.id} onClick={() => setSelectedProspect(prospect)} className={`w-full text-left p-3 rounded-lg border transition ${selectedProspect?.id === prospect.id ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-slate-200 hover:border-indigo-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-950">{prospect.nom}</p>
                    <p className="text-xs text-slate-500">{prospect.email}</p>
                  </div>
                  {prospect.favoris && <span className="text-lg">⭐</span>}
                </div>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${prospect.status === 'Actif' ? 'bg-green-100 text-green-700' : prospect.status === 'Intéressé' ? 'bg-blue-100 text-blue-700' : prospect.status === 'Visite' ? 'bg-purple-100 text-purple-700' : prospect.status === 'Achat' ? 'bg-emerald-100 text-emerald-700' : prospect.status === 'Fermé' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{prospect.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sm:col-span-2">
        {selectedProspect ? (
          <div className="space-y-6">
            <button onClick={() => setSelectedProspect(null)} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">← Retour</button>

            <div className="p-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-semibold text-slate-950">{selectedProspect.nom}</h3>
                    <button onClick={() => setSelectedProspect({ ...selectedProspect, favoris: !selectedProspect.favoris })} className="text-2xl hover:scale-110 transition">
                      {selectedProspect.favoris ? '⭐' : '☆'}
                    </button>
                  </div>
                  {!isEditing && (
                    <>
                      <p className="text-slate-600 mt-1">{selectedProspect.email || 'N/A'} • {selectedProspect.phone || 'N/A'}</p>
                      <p className="text-slate-600 mt-2">Budget: {selectedProspect.budget || 'N/A'}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {!isEditing && (
                    <button onClick={startEditing} className="px-3 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition font-medium">✎ Éditer</button>
                  )}
                  <button onClick={() => deleteProspect(selectedProspect.id)} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Supprimer</button>
                </div>
              </div>

              {isEditing ? (
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Nom</label>
                      <input type="text" value={editForm.nom} onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                      <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Téléphone</label>
                      <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Budget</label>
                      <input type="text" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 uppercase pt-2">📋 Critères recherche</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Localisation</label>
                      <input type="text" value={editForm.localisation} onChange={(e) => setEditForm({ ...editForm, localisation: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Type de bien</label>
                      <input type="text" value={editForm.type_bien} onChange={(e) => setEditForm({ ...editForm, type_bien: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre de pièces</label>
                      <input type="text" value={editForm.nombre_pieces} onChange={(e) => setEditForm({ ...editForm, nombre_pieces: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Priorités</label>
                      <input type="text" value={editForm.priorites} onChange={(e) => setEditForm({ ...editForm, priorites: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Surface min (m²)</label>
                      <input type="number" value={editForm.surface_min} onChange={(e) => setEditForm({ ...editForm, surface_min: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Surface max (m²)</label>
                      <input type="number" value={editForm.surface_max} onChange={(e) => setEditForm({ ...editForm, surface_max: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Budget min (CHF)</label>
                      <input type="text" value={editForm.budget_min} onChange={(e) => setEditForm({ ...editForm, budget_min: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Budget max (CHF)</label>
                      <input type="text" value={editForm.budget_max} onChange={(e) => setEditForm({ ...editForm, budget_max: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 uppercase pt-2">📅 Suivi</p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Date de suivi</label>
                    <input type="date" value={editForm.date_suivi} onChange={(e) => setEditForm({ ...editForm, date_suivi: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={saveEditing} className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">Enregistrer</button>
                    <button onClick={cancelEditing} className="px-6 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-xs font-semibold text-slate-700 uppercase mb-3">📋 CRITÈRES RECHERCHE</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Localisation</p>
                        <p className="font-medium text-slate-950">{selectedProspect.localisation || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Type de bien</p>
                        <p className="font-medium text-slate-950">{selectedProspect.type_bien || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Nombre de pièces</p>
                        <p className="font-medium text-slate-950">{selectedProspect.nombre_pieces || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Surface (m²)</p>
                        <p className="font-medium text-slate-950">{selectedProspect.surface_min || '—'} - {selectedProspect.surface_max || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Budget (CHF)</p>
                        <p className="font-medium text-slate-950">{selectedProspect.budget_min || '—'} - {selectedProspect.budget_max || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Priorités</p>
                        <p className="font-medium text-slate-950">{selectedProspect.priorites || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 mt-6 pt-6">
                    <p className="text-xs font-semibold text-slate-700 uppercase mb-3">📅 SUIVI</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Date de suivi</p>
                        <p className="font-medium text-slate-950">{selectedProspect.date_suivi ? new Date(selectedProspect.date_suivi).toLocaleDateString('fr-CH') : '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Statut</label>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map(status => (
                        <button key={status} onClick={() => updateStatus(selectedProspect.id, status)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedProspect.status === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{status}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isEditing && (() => {
              const matches = getBiensCompatibles(selectedProspect)
              return (
                <div className="p-6 rounded-xl border border-slate-200 bg-white">
                  <h3 className="text-lg font-semibold text-slate-950 mb-4">🏠 Biens compatibles</h3>
                  {matches.length === 0 ? (
                    <p className="text-sm text-slate-500">Aucun bien du Comparateur ne correspond aux critères pour l'instant.</p>
                  ) : (
                    <div className="space-y-2">
                      {matches.map(bien => (
                        <div key={bien.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-200 transition">
                          {bien.image_url ? (
                            <img src={bien.image_url} alt={bien.adresse} className="w-12 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">—</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-950 truncate">{bien.adresse}</p>
                            <p className="text-xs text-slate-500">{bien.type} • {bien.localite} • {bien.surface} m² • {Number(bien.prix).toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
                          </div>
                          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex-shrink-0">{bien.matchScore}/{bien.matchTotal}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            <div className="p-6 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-lg font-semibold text-slate-950 mb-4">Notes & Historique</h3>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {notes.length === 0 ? <p className="text-sm text-slate-500">Aucune note</p> : notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">{parseUtcDate(note.created_at).toLocaleString('fr-CH')}</p>
                    <p className="text-sm text-slate-700">{note.note}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Ajouter une note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addNote()} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-sm" />
                <button onClick={addNote} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">+</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 text-slate-500">
            <p>Sélectionne un prospect pour voir les détails</p>
          </div>
        )}
      </div>

      {error && (
        <div className="sm:col-span-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}
    </div>
  )
}

// ─── CALCULATOR TAB ───
function CalculatorTab() {
  const [priceAchat, setPriceAchat] = useState<string>('500000')
  const [loyer, setLoyer] = useState<string>('3500')
  const [montantMenages, setMontantMenages] = useState<string>('50000')
  const [tauxInteret, setTauxInteret] = useState<string>('3.5')
  const [dureePret, setDureePret] = useState<string>('25')

  const price = parseFloat(priceAchat || '0')
  const tauxChange = 0.95 // 1 CHF = 0.95 EUR (approximation)

  // Calcul 1: Frais notaire
  const fraisNotaireCHF = price * 0.012
  const fraisNotaireEUR = fraisNotaireCHF * tauxChange

  // Calcul 2: Rendement locatif
  const loyerAnnuel = parseFloat(loyer || '0') * 12
  const rendementLocatif = (loyerAnnuel / price) * 100

  // Calcul 3: Coût total acquisition
  const fraisBancaires = price * 0.005
  const assurance = price * 0.002
  const coutTotal = price + fraisNotaireCHF + fraisBancaires + assurance
  const coutTotalEUR = coutTotal * tauxChange

  // Calcul 4: Mensualité hypothèque
  const principal = parseFloat(montantMenages || '0')
  const taux = parseFloat(tauxInteret || '0') / 100 / 12
  const mois = parseFloat(dureePret || '25') * 12
  const mensualite = principal * (taux * Math.pow(1 + taux, mois)) / (Math.pow(1 + taux, mois) - 1)

  return (
    <div className="space-y-8">
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      {/* ─── Frais Notaire ─── */}
      <div className="p-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <h3 className="text-lg font-semibold text-slate-950 mb-4">📋 Frais de Notaire</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Prix d'achat</label>
            <div className="relative">
              <input
                type="number"
                placeholder="500000"
                value={priceAchat}
                onChange={(e) => setPriceAchat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">CHF</span>
            </div>
          </div>
          {price > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-slate-700 font-medium">Frais notaire:</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{fraisNotaireCHF.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Rendement Locatif ─── */}
      <div className="p-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <h3 className="text-lg font-semibold text-slate-950 mb-4">💰 Rendement Locatif (ROI)</h3>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Loyer mensuel (CHF)</label>
              <input
                type="number"
                placeholder="3500"
                value={loyer}
                onChange={(e) => setLoyer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Prix achat (CHF)</label>
              <input
                type="number"
                placeholder="500000"
                value={priceAchat}
                onChange={(e) => setPriceAchat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              />
            </div>
          </div>
          {price > 0 && loyer && (
            <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 font-medium">Rendement annuel:</span>
                <span className="text-xl font-bold text-blue-600">{rendementLocatif.toFixed(2)}%</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Loyer annuel: {loyerAnnuel.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Coût Total Acquisition ─── */}
      <div className="p-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <h3 className="text-lg font-semibold text-slate-950 mb-4">🏠 Coût Total d'Acquisition</h3>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Inclut: Prix + Notaire + Frais bancaires + Assurance</p>
          {price > 0 && (
            <div className="space-y-2 p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex justify-between text-sm">
                <span>Prix achat:</span>
                <span className="font-semibold">{price.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais notaire:</span>
                <span className="font-semibold">{fraisNotaireCHF.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais bancaires:</span>
                <span className="font-semibold">{fraisBancaires.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-purple-200 pt-2 mt-2">
                <span className="font-bold">TOTAL CHF:</span>
                <span className="text-lg font-bold text-purple-600">{coutTotal.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold">TOTAL EUR:</span>
                <span className="text-lg font-bold text-purple-600">{coutTotalEUR.toLocaleString('fr-CH', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Mensualité Hypothèque ─── */}
      <div className="p-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <h3 className="text-lg font-semibold text-slate-950 mb-4">📊 Mensualité Hypothèque</h3>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Montant emprunté</label>
              <input
                type="number"
                placeholder="50000"
                value={montantMenages}
                onChange={(e) => setMontantMenages(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Taux annuel (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="3.5"
                value={tauxInteret}
                onChange={(e) => setTauxInteret(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Durée (ans)</label>
              <input
                type="number"
                placeholder="25"
                value={dureePret}
                onChange={(e) => setDureePret(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm"
              />
            </div>
          </div>
          {principal > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 font-medium">Mensualité:</span>
                <span className="text-2xl font-bold text-orange-600">{mensualite.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Pour {dureePret} ans à {tauxInteret}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── GENERATOR TAB ───
function GeneratorTab() {
  const [propertyType, setPropertyType] = useState('Appartement')
  const [rooms, setRooms] = useState('3')
  const [location, setLocation] = useState('Lausanne')
  const [showText, setShowText] = useState(false)

  const generatedText = `Magnifique ${propertyType.toLowerCase()} de ${rooms} pièces à ${location}. Spacieux, lumineux et bien agencé. Situé dans un quartier prisé avec tous les commerces à proximité. Idéal pour une famille ou un investisseur. Ne manquez pas cette opportunité!`

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-6">Générateur de description (IA)</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Type de propriété</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              >
                <option>Appartement</option>
                <option>Maison</option>
                <option>Villa</option>
                <option>Studio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de pièces</label>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Localité</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lausanne, Genève, Zurich..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
            />
          </div>
          <button
            onClick={() => setShowText(true)}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Générer description
          </button>
        </div>

        {showText && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Description générée:</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedText)
                  alert('✅ Copié!')
                }}
                className="text-sm px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition font-medium"
              >
                Copier
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed">{generatedText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ESTIMATEUR PRIX TAB ───
function EstimateurTab() {
  const [surface, setSurface] = useState('100')
  const [localite, setLocalite] = useState('Lausanne')
  const [type, setType] = useState('Appartement')
  const [pieces, setPieces] = useState('T3')
  const [etat, setEtat] = useState('Bon état')
  const [annee, setAnnee] = useState('2010')
  const [ajustement, setAjustement] = useState(0)

  const [prixM2, setPrixM2] = useState({
    'Lausanne': 8500,
    'Genève': 9500,
    'Zurich': 10000,
    'Berne': 7000,
    'Vevey': 7500,
  } as Record<string, number>)

  const [piecesCoef, setPiecesCoef] = useState({
    'Studio': 1.0,
    'T1': 1.1,
    'T2': 1.2,
    'T3': 1.3,
    'T4': 1.45,
    'T5': 1.6,
    'T6+': 1.75,
  } as Record<string, number>)

  const [etatCoef, setEtatCoef] = useState({
    'Neuf': 1.15,
    'Excellent': 1.05,
    'Bon état': 1.0,
    'À rénover': 0.85,
    'Mauvais état': 0.70,
  } as Record<string, number>)

  const [newLocalite, setNewLocalite] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [showConfig, setShowConfig] = useState(false)

  const anneeCoef = Math.max(0.85, 1 - (new Date().getFullYear() - parseInt(annee)) * 0.005)

  const basePrice = (parseFloat(surface) || 0) * (prixM2[localite] || 8500)
  const avecPieces = basePrice * (piecesCoef[pieces] || 1.0)
  const avecEtat = avecPieces * (etatCoef[etat] || 1.0)
  const avecAnnee = avecEtat * anneeCoef
  const estimation = avecAnnee * (1 + ajustement / 100)

  const addTarif = () => {
    if (newLocalite && newPrice) {
      setPrixM2({ ...prixM2, [newLocalite]: parseFloat(newPrice) })
      setNewLocalite('')
      setNewPrice('')
    }
  }

  const updateTarif = (city: string, newVal: string) => {
    setPrixM2({ ...prixM2, [city]: parseFloat(newVal) || 0 })
  }

  const deleteTarif = (city: string) => {
    const newPrices = { ...prixM2 }
    delete newPrices[city]
    setPrixM2(newPrices)
  }

  const updatePiecesCoef = (piece: string, newVal: string) => {
    setPiecesCoef({ ...piecesCoef, [piece]: parseFloat(newVal) || 0 })
  }

  const updateEtatCoef = (etatVal: string, newVal: string) => {
    setEtatCoef({ ...etatCoef, [etatVal]: parseFloat(newVal) || 0 })
  }

  return (
    <div className="space-y-4">
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

      {/* ─── CALCULER L'ESTIMATION ─── */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40">
            <option>Appartement</option>
            <option>Maison</option>
            <option>Villa</option>
            <option>Studio</option>
            <option>Duplex</option>
            <option>Penthouse</option>
            <option>Chalet</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Surface (m²)</label>
          <input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Pièces</label>
          <select value={pieces} onChange={(e) => setPieces(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40">
            {Object.keys(piecesCoef).map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Localité</label>
          <select value={localite} onChange={(e) => setLocalite(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40">
            {Object.keys(prixM2).map(city => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">État</label>
          <select value={etat} onChange={(e) => setEtat(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40">
            {Object.keys(etatCoef).map(e => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Année</label>
          <input type="number" value={annee} onChange={(e) => setAnnee(e.target.value)} min="1800" max={new Date().getFullYear()} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Ajustement</label>
        <div className="flex gap-2">
          {[-20, -10, 0, 10, 20].map(val => (
            <button key={val} onClick={() => setAjustement(val)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${ajustement === val ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {val === 0 ? 'Reset' : (val > 0 ? '+' : '') + val + '%'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── RÉSULTAT ─── */}
      {estimation > 0 && (
        <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
          <p className="text-sm opacity-90 mb-2">💰 ESTIMATION</p>
          <p className="text-5xl font-bold">{estimation.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
          <p className="text-sm opacity-90 mt-2">Prix/m²: {(estimation / parseFloat(surface)).toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
        </div>
      )}

      {/* ─── CONFIG COEFFICIENTS ─── */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700 uppercase transition"
        >
          ⚙️ {showConfig ? 'Masquer' : 'Afficher'} mes coefficients (T1,T2,T3,État,Année)
        </button>

        {showConfig && (
          <div className="mt-4 space-y-4">
            {/* Coefficients Pièces */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs font-bold text-blue-900 mb-3 uppercase">Coefficients par pièces</p>
              <div className="grid gap-2 sm:grid-cols-4">
                {Object.entries(piecesCoef).map(([piece, coef]) => (
                  <div key={piece}>
                    <label className="block text-xs text-slate-700 mb-1 font-semibold">{piece}</label>
                    <input
                      type="number"
                      step="0.05"
                      value={coef}
                      onChange={(e) => updatePiecesCoef(piece, e.target.value)}
                      className="w-full px-2 py-1.5 rounded border border-blue-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Coefficients État */}
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-xs font-bold text-green-900 mb-3 uppercase">Coefficients par état</p>
              <div className="grid gap-2 sm:grid-cols-5">
                {Object.entries(etatCoef).map(([etatVal, coef]) => (
                  <div key={etatVal}>
                    <label className="block text-xs text-slate-700 mb-1 font-semibold">{etatVal}</label>
                    <input
                      type="number"
                      step="0.05"
                      value={coef}
                      onChange={(e) => updateEtatCoef(etatVal, e.target.value)}
                      className="w-full px-2 py-1.5 rounded border border-green-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <p className="text-xs text-slate-500">💡 1.0 = pas de changement | 1.2 = +20% | 0.8 = -20%</p>
          </div>
        )}
      </div>

      {/* ─── MES TARIFS/M² ─── */}
      <div className="border-t pt-4">
        <label className="block text-xs font-bold text-slate-700 mb-3 uppercase">Mes tarifs/m² par région</label>
        <div className="space-y-2">
          {Object.entries(prixM2).map(([city, price]) => (
            <div key={city} className="flex items-center gap-2">
              <span className="w-20 text-sm font-semibold text-slate-700">{city}</span>
              <input
                type="number"
                value={price}
                onChange={(e) => updateTarif(city, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
              />
              <span className="w-12 text-xs text-slate-500 text-right">CHF</span>
              <button onClick={() => deleteTarif(city)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition font-bold">✕</button>
            </div>
          ))}
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <input
              type="text"
              placeholder="Localité"
              value={newLocalite}
              onChange={(e) => setNewLocalite(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
            />
            <input
              type="number"
              placeholder="Prix"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-24 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
            />
            <button onClick={addTarif} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition">+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── COMPARATEUR TAB ───
function ComparateurTab() {
  const [biens, setBiens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newBien, setNewBien] = useState({ adresse: '', prix: '', surface: '', localite: 'Lausanne', type: 'Appartement', statut: 'À vendre' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [filterLocalite, setFilterLocalite] = useState('')

  const locales = ['Lausanne', 'Genève', 'Zurich', 'Berne', 'Vevey', 'Montreux', 'Neuchâtel']

  useEffect(() => {
    loadBiens()
  }, [])

  const loadBiens = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      const { data, error: err } = await createClient()
        .from('comparables')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      setBiens(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (file: File | null) => {
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview('')
    }
  }

  const addBien = async () => {
    try {
      if (!newBien.adresse || !newBien.prix || !newBien.surface) {
        setError('Adresse, prix et surface sont requis')
        return
      }

      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      let imageUrl: string | null = null

      if (imageFile) {
        setUploading(true)
        const ext = imageFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`

        const { error: uploadErr } = await createClient()
          .storage
          .from('biens-images')
          .upload(path, imageFile)

        if (uploadErr) throw uploadErr

        const { data: publicData } = createClient()
          .storage
          .from('biens-images')
          .getPublicUrl(path)

        imageUrl = publicData.publicUrl
        setUploading(false)
      }

      const { error: err } = await createClient()
        .from('comparables')
        .insert([{
          user_id: user.id,
          adresse: newBien.adresse,
          prix: parseFloat(newBien.prix),
          surface: parseFloat(newBien.surface),
          localite: newBien.localite,
          type: newBien.type,
          statut: newBien.statut,
          image_url: imageUrl
        }])

      if (err) throw err
      setNewBien({ adresse: '', prix: '', surface: '', localite: 'Lausanne', type: 'Appartement', statut: 'À vendre' })
      handleImageSelect(null)
      setError('')
      loadBiens()
    } catch (err: any) {
      setUploading(false)
      setError(err.message)
    }
  }

  const deleteBien = async (id: string) => {
    try {
      const { error: err } = await createClient()
        .from('comparables')
        .delete()
        .eq('id', id)

      if (err) throw err
      setBiens(biens.filter(b => b.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const biensFiltered = filterLocalite ? biens.filter(b => b.localite === filterLocalite) : biens
  const prixM2Moyen = biensFiltered.length > 0 ? biensFiltered.reduce((sum, b) => sum + (b.prix / b.surface), 0) / biensFiltered.length : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-950 mb-4">Ajouter un bien de référence</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input type="text" placeholder="Adresse" value={newBien.adresse} onChange={(e) => setNewBien({ ...newBien, adresse: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
          <input type="number" placeholder="Prix (CHF)" value={newBien.prix} onChange={(e) => setNewBien({ ...newBien, prix: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
          <input type="number" placeholder="Surface (m²)" value={newBien.surface} onChange={(e) => setNewBien({ ...newBien, surface: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
          <input type="text" placeholder="Localité" value={newBien.localite} onChange={(e) => setNewBien({ ...newBien, localite: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
          <select value={newBien.type} onChange={(e) => setNewBien({ ...newBien, type: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm">
            <option>Appartement</option>
            <option>Maison</option>
            <option>Villa</option>
            <option>Studio</option>
          </select>
          <select value={newBien.statut} onChange={(e) => setNewBien({ ...newBien, statut: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm">
            <option>À vendre</option>
            <option>Vendu</option>
            <option>Loué</option>
          </select>
        </div>

        <div className="mt-3 flex items-center gap-4">
          <label className="px-4 py-2 rounded-xl border border-dashed border-slate-300 text-sm text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition cursor-pointer">
            📷 {imageFile ? imageFile.name : 'Ajouter une photo'}
            <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e.target.files?.[0] || null)} className="hidden" />
          </label>
          {imagePreview && (
            <div className="flex items-center gap-2">
              <img src={imagePreview} alt="Aperçu" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
              <button onClick={() => handleImageSelect(null)} className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded transition">Retirer</button>
            </div>
          )}
        </div>

        <button onClick={addBien} disabled={uploading} className="mt-4 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-sm disabled:opacity-50">{uploading ? 'Envoi de la photo...' : '+ Ajouter bien'}</button>
      </div>

      {biensFiltered.length > 0 && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
          <p className="text-sm text-indigo-900"><strong>Prix/m² moyen:</strong> {prixM2Moyen.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
        </div>
      )}

      <div>
        <div className="flex gap-2 mb-4">
          <label className="text-sm font-semibold text-slate-700">Filtrer par localité:</label>
          <select value={filterLocalite} onChange={(e) => setFilterLocalite(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-sm">
            <option value="">Tous</option>
            {locales.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : biensFiltered.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun bien</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Photo</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Adresse</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Prix</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Surface</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Prix/m²</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Localité</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Statut</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {biensFiltered.map((bien) => (
                  <tr key={bien.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      {bien.image_url ? (
                        <img src={bien.image_url} alt={bien.adresse} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">—</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-950 font-medium">{bien.adresse}</td>
                    <td className="py-3 px-4 text-slate-700">{bien.type}</td>
                    <td className="text-right py-3 px-4 font-medium">{bien.prix.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</td>
                    <td className="text-right py-3 px-4">{bien.surface} m²</td>
                    <td className="text-right py-3 px-4 font-bold text-indigo-600">{(bien.prix / bien.surface).toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</td>
                    <td className="py-3 px-4 text-slate-700">{bien.localite}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${bien.statut === 'À vendre' ? 'bg-blue-100 text-blue-700' : bien.statut === 'Vendu' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{bien.statut}</span></td>
                    <td className="text-center py-3 px-4"><button onClick={() => deleteBien(bien.id)} className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded transition">Supprimer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}
    </div>
  )
}

// ─── VISITES TAB ───
function VisitesTab() {
  const [visites, setVisites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newVisite, setNewVisite] = useState({ prospect_nom: '', adresse: '', date_visite: '', heure_visite: '', notes: '', statut: 'Planifiée' })
  const [error, setError] = useState('')

  const statuts = ['Planifiée', 'Confirmée', 'Effectuée', 'Annulée']

  useEffect(() => {
    loadVisites()
  }, [])

  const loadVisites = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      const { data, error: err } = await createClient()
        .from('visites')
        .select('*')
        .eq('user_id', user.id)
        .order('date_visite', { ascending: true })

      if (err) throw err
      setVisites(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addVisite = async () => {
    try {
      const { data: { user } } = await createClient().auth.getUser()
      if (!user) {
        setError('Pas connecté')
        return
      }

      if (!newVisite.date_visite) {
        setError('Date requise')
        return
      }

      const [day, month, year] = newVisite.date_visite.split('/')
      const isoDate = `${year}-${month}-${day}`

      const { error: err } = await createClient()
        .from('visites')
        .insert([{
          user_id: user.id,
          prospect_nom: newVisite.prospect_nom,
          adresse: newVisite.adresse,
          date_visite: isoDate,
          heure_visite: newVisite.heure_visite,
          notes: newVisite.notes || null,
          statut: newVisite.statut
        }])

      if (err) throw err
      setNewVisite({ prospect_nom: '', adresse: '', date_visite: '', heure_visite: '', notes: '', statut: 'Planifiée' })
      setError('')
      loadVisites()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateStatut = async (id: string, statut: string) => {
    try {
      const { error: err } = await createClient()
        .from('visites')
        .update({ statut, updated_at: new Date() })
        .eq('id', id)

      if (err) throw err
      setVisites(visites.map(v => v.id === id ? { ...v, statut } : v))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteVisite = async (id: string) => {
    try {
      const { error: err } = await createClient()
        .from('visites')
        .delete()
        .eq('id', id)

      if (err) throw err
      setVisites(visites.filter(v => v.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-950 mb-4">Ajouter une visite</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="text" placeholder="Nom du prospect" value={newVisite.prospect_nom} onChange={(e) => setNewVisite({ ...newVisite, prospect_nom: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
          <input type="text" placeholder="Adresse du bien" value={newVisite.adresse} onChange={(e) => setNewVisite({ ...newVisite, adresse: e.target.value })} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
          <div>
            <input type="text" placeholder="JJ/MM/AAAA" value={newVisite.date_visite} onChange={(e) => setNewVisite({ ...newVisite, date_visite: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <p className="text-xs text-slate-500 mt-1">ex: 25/08/2026</p>
          </div>
          <div>
            <input type="text" placeholder="HH:MM" value={newVisite.heure_visite} onChange={(e) => setNewVisite({ ...newVisite, heure_visite: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <p className="text-xs text-slate-500 mt-1">ex: 14:30</p>
          </div>
          <textarea placeholder="Notes" value={newVisite.notes} onChange={(e) => setNewVisite({ ...newVisite, notes: e.target.value })} className="sm:col-span-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm h-20 resize-none" />
        </div>
        <button onClick={addVisite} className="mt-4 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-sm">+ Ajouter visite</button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Chargement...</p>
      ) : visites.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune visite programmée</p>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-950">Mes visites ({visites.length})</h2>
          {visites.map((visite) => (
            <div key={visite.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-950">{visite.prospect_nom}</p>
                  <p className="text-sm text-slate-600">{visite.adresse}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-indigo-600">{visite.heure_visite}</p>
                  <p className="text-xs text-slate-500">{new Date(visite.date_visite).toLocaleDateString('fr-CH')}</p>
                </div>
              </div>
              {visite.notes && <p className="text-sm text-slate-600 mb-3 px-3 py-2 rounded bg-slate-50">📝 {visite.notes}</p>}
              <div className="flex gap-2 flex-wrap">
                {statuts.map(statut => (
                  <button key={statut} onClick={() => updateStatut(visite.id, statut)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${visite.statut === statut ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{statut}</button>
                ))}
                <button onClick={() => deleteVisite(visite.id)} className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition ml-auto font-semibold">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}
    </div>
  )
}

// ─── TEMPLATES TAB ───
function TemplatesTab() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newTemplate, setNewTemplate] = useState({ titre: '', description: '', contenu: '' })
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await createClient().auth.getUser()
      const userId = user?.id || 'risly.ch@gmail.com'
      if (!userId) return

      const { data, error: err } = await createClient()
        .from('templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (err) throw err
      setTemplates(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTemplate = async () => {
    try {
      const inputs = document.querySelectorAll('[placeholder*="Titre"], [placeholder*="Description"], [placeholder*="Contenu"]')
      const titre = inputs[0]?.value || newTemplate.titre
      const description = inputs[1]?.value || newTemplate.description
      const contenu = inputs[2]?.value || newTemplate.contenu

      if (!titre || !contenu) {
        setError('Titre et contenu sont requis')
        return
      }

      const { data: { user } } = await createClient().auth.getUser()
      const userId = user?.id || 'risly.ch@gmail.com'

      const { error: err } = await createClient()
        .from('templates')
        .insert([{
          user_id: userId,
          titre,
          description,
          contenu
        }])

      if (err) throw err
      setNewTemplate({ titre: '', description: '', contenu: '' })
      setError('')
      loadTemplates()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteTemplate = async (id: string) => {
    try {
      const { error: err } = await createClient()
        .from('templates')
        .delete()
        .eq('id', id)

      if (err) throw err
      setTemplates(templates.filter(t => t.id !== id))
      setSelectedTemplate(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="sm:col-span-1 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 mb-3">Ajouter template</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Titre" value={newTemplate.titre} onChange={(e) => setNewTemplate({ ...newTemplate, titre: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <input type="text" placeholder="Description" value={newTemplate.description} onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm" />
            <textarea placeholder="Contenu du template" value={newTemplate.contenu} onChange={(e) => setNewTemplate({ ...newTemplate, contenu: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-sm h-24 resize-none" />
            <button onClick={addTemplate} className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-sm">+ Ajouter</button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950 mb-3">Mes templates ({templates.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-slate-500">Chargement...</p>
            ) : templates.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun template</p>
            ) : (
              templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedTemplate?.id === template.id
                      ? 'bg-indigo-100 border-indigo-300'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <p className="font-medium text-sm text-slate-950">{template.titre}</p>
                  <p className="text-xs text-slate-500">{template.description}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="sm:col-span-2">
        {selectedTemplate ? (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-200 bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">{selectedTemplate.titre}</h3>
                  <p className="text-slate-600 mt-1">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => deleteTemplate(selectedTemplate.id)}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Supprimer
                </button>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-3 uppercase">Contenu du template</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{selectedTemplate.contenu}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTemplate.contenu)
                    alert('✅ Contenu copié!')
                  }}
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Copier le contenu
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 text-slate-500">
            <p>Sélectionne un template pour voir le contenu</p>
          </div>
        )}
      </div>

      {error && (
        <div className="sm:col-span-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}
    </div>
  )
}

// ─── NOTES TAB ───
function NotesTab() {
  const [notes, setNotes] = useState([
    { prospect: 'Jean Dupont', note: 'Intéressé par villa, budget 1.2M', date: '17 Sep' },
    { prospect: 'Marie Martin', note: 'Visite confirmée demain 14h', date: '16 Sep' },
  ])
  const [nouvelleNote, setNouvelleNote] = useState('')
  const [prospect, setProspect] = useState('')

  const ajouterNote = () => {
    if (nouvelleNote && prospect) {
      setNotes([{ prospect, note: nouvelleNote, date: 'Auj' }, ...notes])
      setNouvelleNote('')
      setProspect('')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-950">Notes & Commentaires</h2>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nom du prospect..."
            value={prospect}
            onChange={(e) => setProspect(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
          />
          <textarea
            placeholder="Votre note..."
            value={nouvelleNote}
            onChange={(e) => setNouvelleNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition h-20 resize-none"
          />
          <button
            onClick={ajouterNote}
            className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Ajouter Note
          </button>
        </div>
        <div className="space-y-3">
          {notes.map((n, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-xl">
              <div className="flex justify-between mb-2">
                <p className="font-semibold text-slate-950">{n.prospect}</p>
                <p className="text-xs text-slate-500">{n.date}</p>
              </div>
              <p className="text-sm text-slate-600">{n.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
