'use client'

import { useState } from 'react'
import { Eye, EyeOff, Plus, Check, X } from 'lucide-react'

export default function CreateUserPage() {
  const [adminSecret, setAdminSecret] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [createdUsers, setCreatedUsers] = useState<string[]>([])

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!adminSecret) {
      setMessage({ type: 'error', text: 'Code admin requis' })
      setLoading(false)
      return
    }

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Email et mot de passe requis' })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit faire au moins 6 caractères' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminSecret }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la création' })
        setLoading(false)
        return
      }

      setMessage({ type: 'success', text: `✅ Compte créé pour ${email}` })
      setCreatedUsers([...createdUsers, email])
      setEmail('')
      setPassword('')
      setLoading(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la création' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100/15 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-slate-950">Créer Utilisateur</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Risly Pro</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-950">Ajouter un client.</h2>
          <p className="mt-2 text-base text-slate-600">Créez un compte Risly Pro pour vos clients.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateUser} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="adminSecret" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Code admin</label>
            <input
              id="adminSecret"
              type="password"
              placeholder="Code secret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</label>
            <input
              id="email"
              type="email"
              placeholder="client@exemple.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`rounded-xl p-4 flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50/80 border border-green-200/50'
                : 'bg-red-50/80 border border-red-200/50'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {message.text}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-base transition hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Plus size={18} />
                Créer le compte
              </>
            )}
          </button>
        </form>

        {/* Created users list */}
        {createdUsers.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">✅ Comptes créés ({createdUsers.length})</h3>
            <div className="space-y-2">
              {createdUsers.map((user) => (
                <div key={user} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50/50 border border-green-200/30">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-slate-700">{user}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
