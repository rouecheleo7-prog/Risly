export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key)
}

const PRICE_IDS: Record<string, string> = {
  starter:  process.env.STRIPE_PRICE_STARTER  ?? '',
  pro:      process.env.STRIPE_PRICE_PRO      ?? '',
  business: process.env.STRIPE_PRICE_BUSINESS ?? '',
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, plan, promoCode } = await req.json()

    if (!name || !email || !plan) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const stripe = getStripe()

    // Create or retrieve customer
    const existingCustomers = await stripe.customers.list({ email, limit: 1 })
    let customer = existingCustomers.data[0]
    if (!customer) {
      customer = await stripe.customers.create({ name, email })
    }

    // Resolve promo code
    let promotionCodeId: string | undefined
    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const codes = await stripe.promotionCodes.list({ code: promoCode.trim().toUpperCase(), active: true, limit: 1 })
      if (codes.data.length === 0) {
        return NextResponse.json({ error: 'Code promo invalide ou expiré' }, { status: 400 })
      }
      promotionCodeId = codes.data[0].id
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      trial_period_days: 3,
      ...(promotionCodeId ? { promotion_code: promotionCodeId } : {}),
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
      },
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
    })

    let clientSecret: string | null = null
    if (subscription.pending_setup_intent) {
      const si = subscription.pending_setup_intent as { client_secret: string }
      clientSecret = si.client_secret
    } else if (subscription.latest_invoice) {
      const invoice = subscription.latest_invoice as { payment_intent?: { client_secret: string } }
      clientSecret = invoice.payment_intent?.client_secret ?? null
    }

    return NextResponse.json({ subscriptionId: subscription.id, clientSecret, customerId: customer.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('Stripe error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
