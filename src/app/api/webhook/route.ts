import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_PRICE_STARTER  ?? '']: 'starter',
  [process.env.STRIPE_PRICE_PRO      ?? '']: 'pro',
  [process.env.STRIPE_PRICE_BUSINESS ?? '']: 'business',
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function verifyStripeSignature(body: string, sig: string, secret: string) {
  const encoder = new TextEncoder()
  const parts = sig.split(',')
  const ts = parts.find(p => p.startsWith('t='))?.split('=')[1]
  const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1]
  if (!ts || !v1) return false
  const payload = `${ts}.${body}`
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const computed = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === v1
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  const valid = await verifyStripeSignature(body, sig, secret)
  if (!valid) return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })

  const event = JSON.parse(body)
  const supabase = supabaseAdmin()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const email = session.customer_email
      const customerId = session.customer
      if (!email) break

      // Trouver l'user par email
      const { data: users } = await supabase.auth.admin.listUsers()
      const user = users?.users?.find((u: { email?: string }) => u.email === email)
      if (!user) break

      // Récupérer le plan depuis la subscription
      const subId = session.subscription
      const key = process.env.STRIPE_SECRET_KEY!
      const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
        headers: { Authorization: `Bearer ${key}` }
      })
      const sub = await subRes.json()
      const priceId = sub.items?.data?.[0]?.price?.id ?? ''
      const plan = PRICE_TO_PLAN[priceId] ?? 'starter'

      await supabase.from('profiles').upsert({
        id: user.id, email, plan, stripe_customer_id: customerId, subscription_status: 'active'
      })
      break
    }

    case 'customer.subscription.deleted': {
      const customerId = event.data.object.customer
      await supabase.from('profiles')
        .update({ plan: 'starter', subscription_status: 'cancelled' })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'invoice.payment_failed': {
      const customerId = event.data.object.customer
      await supabase.from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'invoice.payment_succeeded': {
      const customerId = event.data.object.customer
      await supabase.from('profiles')
        .update({ subscription_status: 'active' })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
