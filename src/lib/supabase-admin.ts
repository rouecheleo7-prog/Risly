import { createClient } from '@supabase/supabase-js'

// Client "service role" — contourne les Row Level Security policies.
// SERVEUR UNIQUEMENT (routes API / Server Components). Ne jamais importer
// ce fichier depuis un composant 'use client'.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
