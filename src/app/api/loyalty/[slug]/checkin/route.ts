export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMerchantBySlug, checkinSelfService, normalizePhone, isValidPhone } from '@/lib/loyalty'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const merchant = await getMerchantBySlug(slug)
  if (!merchant) {
    return NextResponse.json({ error: 'Commerce introuvable' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  const rawPhone = body?.phone
  if (typeof rawPhone !== 'string') {
    return NextResponse.json({ error: 'Numéro manquant' }, { status: 400 })
  }

  const phone = normalizePhone(rawPhone)
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: 'Numéro invalide' }, { status: 400 })
  }

  try {
    const result = await checkinSelfService(merchant, phone)
    return NextResponse.json({
      status: result.status,
      stamps: result.customer.stamps,
      stampsRequired: merchant.stamps_required,
      rewardCode: result.customer.reward_code,
      hoursRemaining: 'hoursRemaining' in result ? result.hoursRemaining : undefined,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
