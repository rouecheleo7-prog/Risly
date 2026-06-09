import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// Client-side (browser) — safe to use in 'use client' components
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
