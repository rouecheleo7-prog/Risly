import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export function normalizePhone(raw: string) {
  const trimmed = raw.trim()
  const plus = trimmed.startsWith('+') ? '+' : ''
  return plus + trimmed.replace(/[^\d]/g, '')
}

export function isValidPhone(normalized: string) {
  return normalized.replace('+', '').length >= 8
}

function randomCode(length = 6) {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // sans 0/O/1/I
  let out = ''
  for (let i = 0; i < length; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}

export type Merchant = {
  id: string
  slug: string
  business_name: string
  logo_url: string | null
  primary_color: string
  stamps_required: number
  reward_text: string
  cooldown_hours: number
}

export type Customer = {
  id: string
  merchant_id: string
  phone: string
  stamps: number
  last_stamp_at: string | null
  reward_code: string | null
  total_rewards_redeemed: number
}

/** Récupère le commerce du commerçant actuellement connecté (via cookies de session). */
export async function getAuthedMerchant(): Promise<Merchant | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const db = createAdminClient()
  const { data } = await db.from('loyalty_merchants').select('*').eq('id', user.id).maybeSingle()
  return (data as Merchant) ?? null
}

export async function getMerchantBySlug(slug: string): Promise<Merchant | null> {
  const db = createAdminClient()
  const { data, error } = await db.from('loyalty_merchants').select('*').eq('slug', slug).maybeSingle()
  if (error || !data) return null
  return data as Merchant
}

async function getCustomer(merchantId: string, phone: string): Promise<Customer | null> {
  const db = createAdminClient()
  const { data } = await db
    .from('loyalty_customers')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('phone', phone)
    .maybeSingle()
  return (data as Customer) ?? null
}

async function createCustomer(merchantId: string, phone: string): Promise<Customer> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('loyalty_customers')
    .insert({ merchant_id: merchantId, phone, stamps: 0 })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as Customer
}

async function logStampEvent(merchantId: string, customerId: string) {
  const db = createAdminClient()
  await db.from('loyalty_stamp_events').insert({ merchant_id: merchantId, customer_id: customerId })
}

async function applyStamp(merchant: Merchant, customer: Customer) {
  const db = createAdminClient()
  const nextStamps = customer.stamps + 1
  const unlocked = nextStamps >= merchant.stamps_required
  const rewardCode = unlocked ? randomCode() : null

  const { data, error } = await db
    .from('loyalty_customers')
    .update({ stamps: nextStamps, last_stamp_at: new Date().toISOString(), reward_code: rewardCode })
    .eq('id', customer.id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)

  await logStampEvent(merchant.id, customer.id)
  return { status: unlocked ? 'reward-unlocked' : 'stamped', customer: data as Customer } as const
}

export type CheckinResult =
  | { status: 'created'; customer: Customer }
  | { status: 'reward-pending'; customer: Customer }
  | { status: 'cooldown'; customer: Customer; hoursRemaining: number }
  | { status: 'stamped'; customer: Customer }
  | { status: 'reward-unlocked'; customer: Customer }

/** Utilisé par la page publique (libre-service, respecte le délai anti-abus). */
export async function checkinSelfService(merchant: Merchant, phone: string): Promise<CheckinResult> {
  let customer = await getCustomer(merchant.id, phone)

  if (!customer) {
    customer = await createCustomer(merchant.id, phone)
    return { status: 'created', customer }
  }

  if (customer.reward_code) {
    return { status: 'reward-pending', customer }
  }

  if (customer.last_stamp_at) {
    const elapsedMs = Date.now() - new Date(customer.last_stamp_at).getTime()
    const cooldownMs = merchant.cooldown_hours * 60 * 60 * 1000
    if (elapsedMs < cooldownMs) {
      const hoursRemaining = Math.ceil((cooldownMs - elapsedMs) / (60 * 60 * 1000))
      return { status: 'cooldown', customer, hoursRemaining }
    }
  }

  return applyStamp(merchant, customer)
}

/** Utilisé par le dashboard (validation manuelle par le commerçant, sans délai anti-abus). */
export async function addStampManual(merchant: Merchant, phone: string): Promise<CheckinResult> {
  let customer = await getCustomer(merchant.id, phone)
  if (!customer) customer = await createCustomer(merchant.id, phone)
  if (customer.reward_code) return { status: 'reward-pending', customer }
  return applyStamp(merchant, customer)
}

export async function redeemReward(merchant: Merchant, phone: string) {
  const db = createAdminClient()
  const customer = await getCustomer(merchant.id, phone)
  if (!customer || !customer.reward_code) throw new Error('Aucune récompense en attente pour ce client.')

  const { error } = await db
    .from('loyalty_customers')
    .update({
      stamps: 0,
      reward_code: null,
      total_rewards_redeemed: (customer.total_rewards_redeemed ?? 0) + 1,
    })
    .eq('id', customer.id)
  if (error) throw new Error(error.message)

  await db.from('loyalty_redemptions').insert({
    merchant_id: merchant.id,
    customer_id: customer.id,
    code: customer.reward_code,
  })

  return true
}
