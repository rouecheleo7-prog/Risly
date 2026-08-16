import { notFound } from 'next/navigation'
import { getMerchantBySlug } from '@/lib/loyalty'
import LoyaltyCardClient from '@/components/loyalty/LoyaltyCardClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const merchant = await getMerchantBySlug(slug)
  return { title: merchant ? `${merchant.business_name} · Carte de fidélité` : 'Carte de fidélité' }
}

export default async function LoyaltyCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const merchant = await getMerchantBySlug(slug)
  if (!merchant) notFound()

  return (
    <LoyaltyCardClient
      slug={slug}
      businessName={merchant.business_name}
      logoUrl={merchant.logo_url}
      primaryColor={merchant.primary_color}
      stampsRequired={merchant.stamps_required}
      rewardText={merchant.reward_text}
    />
  )
}
