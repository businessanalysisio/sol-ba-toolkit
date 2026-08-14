import "server-only"

import { z } from "zod"

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

const serviceSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

export function getSupabasePublicEnv() {
  const parsed = publicSchema.safeParse(process.env)
  if (!parsed.success) throw new Error("Supabase is not configured for authenticated server access")
  return parsed.data
}

export function getSupabaseServiceEnv() {
  const parsed = serviceSchema.safeParse(process.env)
  if (!parsed.success) throw new Error("Supabase service access is not configured")
  return parsed.data
}
