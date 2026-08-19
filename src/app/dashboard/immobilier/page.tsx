'use client'

import { useState } from 'react'
import { Home, Users, Calculator, Sparkles, FileText, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ImmobilierDashboard() {
  const [activeTab, setActiveTab] = useState<'crm' | 'calculator' | 'generator'>('crm')

  const tabs = [
    { id: 'crm', label: 'CRM & Prospects', icon: Users },
    { id: 'calculator', label: 'Calculateur Notaire', icon: Calculator },
    { id: 'generator', label: 'Générateur IA', icon: Sparkles },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-semibold text-slate-950">Dashboard Immobilier</h1>
              <p className="text-sm text-slate-500">Outil complet pour agents immobiliers</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
            <Home className="w-5 h-5 text-white" strokeWidth={2} />
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
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CRM TAB ───
function CRMTab() {
  const [prospects, setProspects] = useState([
    { id: 1, nom: 'Jean Dupont', email: 'jean@example.com', phone: '079 123 45 67', status: 'Actif', budget: '500k CHF' },
    { id: 2, nom: 'Marie Martin', email: 'marie@example.com', phone: '079 234 56 78', status: 'Intéressé', budget: '750k CHF' },
  ])
  const [newContact, setNewContact] = useState({ nom: '', email: '', phone: '', budget: '' })

  const handleAddContact = () => {
    if (newContact.nom && newContact.email) {
      setProspects([...prospects, { id: prospects.length + 1, ...newContact, status: 'Nouveau' }])
      setNewContact({ nom: '', email: '', phone: '', budget: '' })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-6">Ajouter un prospect</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Nom complet"
            value={newContact.nom}
            onChange={(e) => setNewContact({ ...newContact, nom: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
          />
          <input
            type="tel"
            placeholder="Téléphone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
          />
          <input
            type="text"
            placeholder="Budget estimé"
            value={newContact.budget}
            onChange={(e) => setNewContact({ ...newContact, budget: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
          />
        </div>
        <button
          onClick={handleAddContact}
          className="mt-4 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          + Ajouter prospect
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-4">Mes prospects ({prospects.length})</h2>
        <div className="space-y-3">
          {prospects.map((prospect) => (
            <div key={prospect.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50">
              <div>
                <p className="font-semibold text-slate-950">{prospect.nom}</p>
                <p className="text-sm text-slate-600">{prospect.email} • {prospect.phone}</p>
                <p className="text-sm font-medium text-indigo-600 mt-1">Budget: {prospect.budget}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  prospect.status === 'Actif' ? 'bg-green-100 text-green-700' :
                  prospect.status === 'Intéressé' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {prospect.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CALCULATOR TAB ───
function CalculatorTab() {
  const [priceAchat, setPriceAchat] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)

  const calculateNotaire = () => {
    const price = parseFloat(priceAchat)
    if (!isNaN(price)) {
      // Formule simplifiée frais notaire CH: environ 1-1.5% du prix
      const frais = price * 0.012
      setResult(frais)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-6">Calculer les frais de notaire</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Prix d'achat (CHF)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="500000"
                value={priceAchat}
                onChange={(e) => setPriceAchat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">CHF</span>
            </div>
          </div>
          <button
            onClick={calculateNotaire}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold hover:shadow-lg transition"
          >
            Calculer
          </button>
        </div>

        {result !== null && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
            <p className="text-sm text-slate-600 mb-2">Frais de notaire estimés</p>
            <p className="text-4xl font-bold text-green-600">{result.toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
            <p className="text-sm text-slate-600 mt-3">Pour un achat de {parseFloat(priceAchat).toLocaleString('fr-CH', { style: 'currency', currency: 'CHF' })}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200/50 rounded-xl">
        <p className="text-sm text-blue-700"><strong>💡 Info:</strong> Les frais de notaire en Suisse romande varient selon le canton. Environ 1-1.5% du prix.</p>
      </div>
    </div>
  )
}

// ─── GENERATOR TAB ───
function GeneratorTab() {
  const [propertyType, setPropertyType] = useState('appartement')
  const [rooms, setRooms] = useState('3')
  const [location, setLocation] = useState('Lausanne')
  const [generatedText, setGeneratedText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateDescription = async () => {
    setLoading(true)
    // Simulation - en production on appellerait une API IA
    await new Promise(resolve => setTimeout(resolve, 1500))

    const text = `Magnifique ${propertyType} de ${rooms} pièces à ${location}. Spacieux, lumineux et bien agencé. Situé dans un quartier prisé avec tous les commerces à proximité. Idéal pour une famille ou un investisseur. Ne manquez pas cette opportunité!`
    setGeneratedText(text)
    setLoading(false)
  }

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
            onClick={generateDescription}
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Générer description
              </>
            )}
          </button>
        </div>

        {generatedText && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Description générée:</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedText)
                  alert('Copié!')
                }}
                className="text-sm px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition"
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
