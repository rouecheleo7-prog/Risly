import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

function arg(name, fallback) {
  const eqArg = process.argv.find((a) => a.startsWith(`--${name}=`))
  if (eqArg) return eqArg.slice(name.length + 3)
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : fallback
}

function randomPassword() {
  return crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, '').slice(0, 12)
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const email = arg('email')
const businessName = arg('business-name')
let slug = arg('slug')
const password = arg('password', randomPassword())
const primaryColor = arg('color', '#4F46E5')
const stampsRequired = parseInt(arg('stamps', '10'), 10)
const rewardText = arg('reward', 'Une récompense au choix')
const cooldownHours = parseInt(arg('cooldown', '2'), 10)

if (!email || !businessName) {
  console.error('Usage: node --env-file=.env.local scripts/create-merchant.mjs --email=client@exemple.ch --business-name="Café des Alpes" [--slug=cafe-des-alpes] [--password=...] [--color=#4F46E5] [--stamps=10] [--reward="..."] [--cooldown=2]')
  process.exit(1)
}

if (!slug) slug = slugify(businessName)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis. Lancez avec: node --env-file=.env.local scripts/create-merchant.mjs ...')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

async function main() {
  const { data: existing } = await supabase.from('loyalty_merchants').select('id').eq('slug', slug).maybeSingle()
  if (existing) {
    console.error(`Le slug "${slug}" est déjà pris. Choisissez-en un autre avec --slug=...`)
    process.exit(1)
  }

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (userError) {
    console.error('Erreur création du compte :', userError.message)
    process.exit(1)
  }

  const { error: merchantError } = await supabase.from('loyalty_merchants').insert({
    id: userData.user.id,
    slug,
    business_name: businessName,
    primary_color: primaryColor,
    stamps_required: stampsRequired,
    reward_text: rewardText,
    cooldown_hours: cooldownHours,
  })

  if (merchantError) {
    console.error('Erreur création du commerce (le compte utilisateur a été créé, nettoyage en cours) :', merchantError.message)
    await supabase.auth.admin.deleteUser(userData.user.id)
    process.exit(1)
  }

  console.log('')
  console.log('✅ Commerçant créé avec succès')
  console.log('')
  console.log(`   Connexion       : https://risly.ch/auth/login`)
  console.log(`   Email           : ${email}`)
  console.log(`   Mot de passe    : ${password}`)
  console.log(`   Page publique   : https://risly.ch/carte/${slug}`)
  console.log('')
  console.log('   Donnez ces identifiants au commerçant (par exemple par WhatsApp).')
  console.log('')
}

main()
