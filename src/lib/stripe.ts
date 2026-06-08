import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Backend client (server only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

// Frontend client (browser)
let stripePromise: ReturnType<typeof loadStripe> | null = null
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Price IDs — à remplacer avec tes vrais IDs Stripe
export const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER ?? 'price_starter',
  pro:     process.env.STRIPE_PRICE_PRO     ?? 'price_pro',
  business: process.env.STRIPE_PRICE_BUSINESS ?? 'price_business',
}
