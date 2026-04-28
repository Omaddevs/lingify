import { createClient } from '@supabase/supabase-js'

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If env vars are missing the app runs in "demo mode":
// auth is bypassed and all API calls return mock data.
export const IS_DEMO = !supabaseUrl || !supabaseAnonKey

export const supabase = IS_DEMO
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })

if (IS_DEMO) {
  console.warn(
    '[Lingify] Running in DEMO MODE — Supabase not configured.\n' +
    'Copy .env.example → .env and fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY to enable the backend.',
  )
}
