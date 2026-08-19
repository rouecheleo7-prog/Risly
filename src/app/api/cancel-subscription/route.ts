export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const admin = supabaseAdmin()
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'Aucun abonnement trouvé' }, { status: 404 })
    }

    const key = process.env.STRIPE_SECRET_KEY!

    // Récupérer les subscriptions du customer
    const subsRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${profile.stripe_customer_id}&status=active&limit=1`,
      { headers: { Authorization: `Bearer ${key}` } }
    )
    const subs = await subsRes.json()

    if (!subs.data?.length) {
      // Essayer avec trialing
      const subsRes2 = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${profile.stripe_customer_id}&status=trialing&limit=1`,
        { headers: { Authorization: `Bearer ${key}` } }
      )
      const subs2 = await subsRes2.json()
      if (!subs2.data?.length) {
        return NextResponse.json({ error: 'Aucun abonnement actif' }, { status: 404 })
      }
      subs.data = subs2.data
    }

    const subId = subs.data[0].id

    // Annuler à la fin de la période
    const cancelRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'cancel_at_period_end=true',
    })

    if (!cancelRes.ok) {
      const err = await cancelRes.json()
      return NextResponse.json({ error: err.error?.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erreur' }, { status: 500 })
  }
}
