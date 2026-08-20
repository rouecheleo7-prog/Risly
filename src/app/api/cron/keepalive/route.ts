export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// Appelée automatiquement par Vercel Cron (voir vercel.json) une fois par
// jour. Fait une requête minimale à Supabase pour que le projet ne soit
// jamais considéré inactif et mis en pause / supprimé (plan gratuit).
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const db = createAdminClient()
  const { error } = await db.from('loyalty_merchants').select('id', { count: 'exact', head: true })

  if (error) {
    console.error('Keepalive ping failed:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
