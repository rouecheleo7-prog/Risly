export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

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

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not set' }, { status: 500 })

    const origin = req.headers.get('origin') ?? 'https://risly.vercel.app'

    // Build Checkout Session via raw fetch (avoids SDK HTTP issues)
    const params = new URLSearchParams({
      'mode': 'subscription',
      'customer_email': email,
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'subscription_data[trial_period_days]': '3',
      'subscription_data[metadata][name]': name,
      'success_url': `${origin}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${origin}/auth/signup`,
      'allow_promotion_codes': promoCode ? 'false' : 'true',
    })

    if (promoCode && promoCode.trim()) {
      // Look up promo code first
      const promoRes = await fetch(
        `https://api.stripe.com/v1/promotion_codes?code=${encodeURIComponent(promoCode.trim().toUpperCase())}&active=true&limit=1`,
        { headers: { 'Authorization': `Bearer ${key}` } }
      )
      const promoData = await promoRes.json()
      if (promoData.data?.length > 0) {
        params.set('discounts[0][promotion_code]', promoData.data[0].id)
        params.delete('allow_promotion_codes')
      } else {
        return NextResponse.json({ error: 'Code promo invalide ou expiré' }, { status: 400 })
      }
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const session = await res.json()

    if (!res.ok) {
      console.error('Stripe error:', session)
      return NextResponse.json({ error: session.error?.message ?? 'Erreur Stripe' }, { status: 500 })
    }

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
