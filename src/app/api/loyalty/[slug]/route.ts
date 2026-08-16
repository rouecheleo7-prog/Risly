export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMerchantBySlug } from '@/lib/loyalty'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const merchant = await getMerchantBySlug(slug)

  if (!merchant) {
    return NextResponse.json({ error: 'Commerce introuvable' }, { status: 404 })
  }

  return NextResponse.json({
    businessName: merchant.business_name,
    logoUrl: merchant.logo_url,
    primaryColor: merchant.primary_color,
    stampsRequired: merchant.stamps_required,
    rewardText: merchant.reward_text,
  })
}
