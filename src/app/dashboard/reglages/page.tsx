'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, Check, Copy } from 'lucide-react'

type Merchant = {
  id: string
  slug: string
  business_name: string
  logo_url: string | null
  primary_color: string
  stamps_required: number
  reward_text: string
  cooldown_hours: number
}

export default function ReglagesPage() {
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      const { data: row } = await supabase.from('loyalty_merchants').select('*').eq('id', data.user.id).maybeSingle()
      setMerchant(row)
      setLoading(false)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!merchant) return
    setSaving(true)
    setSaved(false)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('loyalty_merchants')
      .update({
        business_name: merchant.business_name,
        logo_url: merchant.logo_url,
        primary_color: merchant.primary_color,
        stamps_required: merchant.stamps_required,
        reward_text: merchant.reward_text,
        cooldown_hours: merchant.cooldown_hours,
      })
      .eq('id', merchant.id)

    setSaving(false)
    if (updateError) {
      setError('Erreur lors de l\'enregistrement.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  function copyLink() {
    if (!merchant) return
    navigator.clipboard.writeText(`${window.location.origin}/carte/${merchant.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-gray-600" size={28} /></div>
  }

  if (!merchant) {
    return <div className="p-8"><p style={{ color: 'var(--text-secondary)' }}>Aucun commerce n&apos;est lié à ce compte.</p></div>
  }

  const inputClass = 'w-full rounded-xl px-3.5 py-2.5 text-sm'
  const inputStyle = { background: 'var(--surface-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Réglages</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Personnalisez votre programme de fidélité.</p>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Lien public de votre carte (à mettre dans votre QR code)</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm px-3 py-2 rounded-lg overflow-x-auto whitespace-nowrap" style={{ background: 'var(--surface-input)', color: 'var(--text-primary)' }}>
            {typeof window !== 'undefined' ? window.location.origin : 'https://risly.ch'}/carte/{merchant.slug}
          </code>
          <button type="button" onClick={copyLink} className="shrink-0 rounded-lg p-2.5" style={{ background: 'var(--surface-input)', border: '1px solid var(--border)' }}>
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} style={{ color: 'var(--text-secondary)' }} />}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl p-5 space-y-5" style={{ background: 'var(--surface-card)', border: '1px solid var(--border)' }}>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Nom du commerce</label>
          <input className={inputClass} style={inputStyle} value={merchant.business_name} onChange={(e) => setMerchant({ ...merchant, business_name: e.target.value })} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>URL du logo</label>
          <input className={inputClass} style={inputStyle} value={merchant.logo_url ?? ''} onChange={(e) => setMerchant({ ...merchant, logo_url: e.target.value })} placeholder="https://…" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Couleur principale</label>
          <div className="flex items-center gap-3">
            <input type="color" value={merchant.primary_color} onChange={(e) => setMerchant({ ...merchant, primary_color: e.target.value })} className="h-10 w-14 rounded-lg border-none cursor-pointer" />
            <input className={inputClass} style={inputStyle} value={merchant.primary_color} onChange={(e) => setMerchant({ ...merchant, primary_color: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Nombre de tampons pour la récompense</label>
          <input type="number" min={2} max={30} className={inputClass} style={inputStyle} value={merchant.stamps_required} onChange={(e) => setMerchant({ ...merchant, stamps_required: parseInt(e.target.value, 10) || 0 })} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Texte de la récompense</label>
          <input className={inputClass} style={inputStyle} value={merchant.reward_text} onChange={(e) => setMerchant({ ...merchant, reward_text: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Délai anti-abus entre deux tampons (heures)</label>
          <input type="number" min={0} max={72} className={inputClass} style={inputStyle} value={merchant.cooldown_hours} onChange={(e) => setMerchant({ ...merchant, cooldown_hours: parseInt(e.target.value, 10) || 0 })} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={saving} className="rounded-xl px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white disabled:opacity-60">
          {saving ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
