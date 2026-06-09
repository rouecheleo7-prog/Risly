import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer, PRICE_IDS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { name, email, plan, promoCode } = await req.json()

    if (!name || !email || !plan) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS]
    if (!priceId) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    // Create or retrieve customer
    const existingCustomers = await getStripeServer().customers.list({ email, limit: 1 })
    let customer = existingCustomers.data[0]

    if (!customer) {
      customer = await getStripeServer().customers.create({ name, email })
    }

    // Resolve promo code to a promotion_code id if provided
    let promotionCodeId: string | undefined
    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const codes = await getStripeServer().promotionCodes.list({ code: promoCode.trim().toUpperCase(), active: true, limit: 1 })
      if (codes.data.length === 0) {
        return NextResponse.json({ error: 'Code promo invalide ou expiré' }, { status: 400 })
      }
      promotionCodeId = codes.data[0].id
    }

    // Create SetupIntent for payment method collection during trial
    const subscription = await getStripeServer().subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      trial_period_days: 3,
      ...(promotionCodeId ? { promotion_code: promotionCodeId } : {}),
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card', 'link'],
      },
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
    })

    // Return the client secret for the Payment Element
    let clientSecret: string | null = null

    if (subscription.pending_setup_intent) {
      const si = subscription.pending_setup_intent as { client_secret: string }
      clientSecret = si.client_secret
    } else if (subscription.latest_invoice) {
      const invoice = subscription.latest_invoice as { payment_intent?: { client_secret: string } }
      clientSecret = invoice.payment_intent?.client_secret ?? null
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret,
      customerId: customer.id,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
