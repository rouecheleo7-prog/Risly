import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.trial_will_end':
      // Envoyer un email de rappel 3 jours avant la fin du trial
      console.log('Trial se termine bientôt pour:', event.data.object.customer)
      break

    case 'customer.subscription.deleted':
      // Désactiver l'accès dashboard
      console.log('Abonnement annulé:', event.data.object.customer)
      break

    case 'invoice.payment_succeeded':
      // Accès confirmé / renouvelé
      console.log('Paiement réussi:', event.data.object.customer)
      break

    case 'invoice.payment_failed':
      // Notifier le client, suspendre l'accès
      console.log('Paiement échoué:', event.data.object.customer)
      break
  }

  return NextResponse.json({ received: true })
}
