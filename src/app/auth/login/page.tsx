'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (authError) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="1"/%3E%3C/filter%3E%3Crect width="400" height="400" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E")',
      }} />

      {/* Gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100/15 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition mb-16 group">
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
          <span>Retour</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-slate-950">Risly<span className="text-indigo-600">.</span>Pro</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Espace Professionnel</p>
            </div>
          </div>
        </div>

        {/* Form header */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-slate-950">Accédez à votre espace.</h2>
          <p className="mt-3 text-base text-slate-600">Connectez-vous pour gérer votre tableau de bord.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</label>
            <input
              id="email"
              type="email"
              placeholder="vous@exemple.ch"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition"
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

          {/* Error message */}
          {error && (
            <div className="rounded-xl bg-red-50/80 border border-red-200/50 p-4 flex items-start gap-3 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-full bg-red-400/80 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-base transition hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-md shadow-indigo-600/10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-10 leading-relaxed">
          Problème d'accès?<br />
          <a href="mailto:leo@risly.ch" className="text-indigo-600 hover:text-indigo-700 font-medium transition">Contactez le support</a>
        </p>
      </div>
    </div>
  )
}
