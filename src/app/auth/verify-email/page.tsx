'use client'

import { useSearchParams } from 'next/navigation'
import { LogoFull } from '@/components/Logo'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyContent() {
  const params = useSearchParams()
  const email = params.get('email') ?? 'ton adresse email'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <LogoFull size="md" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold mb-3">Vérifie ton email</h1>
        <p className="text-gray-400 text-sm mb-2">
          On a envoyé un lien de confirmation à
        </p>
        <p className="text-white font-semibold mb-6">{email}</p>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 text-left space-y-3 mb-8">
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">1.</span> Ouvre ton email
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">2.</span> Clique sur le lien de confirmation
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">3.</span> Tu seras redirigé vers ton dashboard
          </p>
        </div>

        <p className="text-xs text-gray-600">
          Pas reçu ?{' '}
          <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">
            Essaie de te connecter
          </Link>
          {' '}ou vérifie tes spams.
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
