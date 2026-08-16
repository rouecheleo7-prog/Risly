export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAuthedMerchant, addStampManual, normalizePhone, isValidPhone } from '@/lib/loyalty'

export async function POST(req: NextRequest) {
  const merchant = await getAuthedMerchant()
  if (!merchant) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
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
    const result = await addStampManual(merchant, phone)
    return NextResponse.json({ status: result.status, stamps: result.customer.stamps })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
