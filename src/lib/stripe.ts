import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Backend client — lazy init so build succeeds without env vars
let _stripe: Stripe | null = null
export function getStripeServer(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(key, { apiVersion: '2026-05-27.dahlia' })
  }
  return _stripe
}
// Keep backward compat
export const stripe = new Proxy({} as Stripe, {
  get: (_, prop) => getStripeServer()[prop as keyof Stripe],
})

// Frontend client
let stripePromise: ReturnType<typeof loadStripe> | null = null
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export const PRICE_IDS = {
  starter:  process.env.STRIPE_PRICE_STARTER  ?? 'price_starter',
  pro:      process.env.STRIPE_PRICE_PRO      ?? 'price_pro',
  business: process.env.STRIPE_PRICE_BUSINESS ?? 'price_business',
}
