import "server-only"

import { createClient } from "@supabase/supabase-js"
import { getSupabasePublicEnv, getSupabaseServiceEnv } from "./env"

export function createUserSupabaseClient(accessToken: string) {
  if (!accessToken) throw new Error("An authenticated access token is required")
  const env = getSupabasePublicEnv()

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

export function createServiceSupabaseClient() {
  const env = getSupabaseServiceEnv()
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
