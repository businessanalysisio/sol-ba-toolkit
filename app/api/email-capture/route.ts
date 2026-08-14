import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional().default("website"),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})))

  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Email capture is not configured." }, { status: 503 })
  }

  const supabase = createClient(url, serviceKey)
  const { error } = await supabase.from("email_signups").insert({
    email: parsed.data.email,
    source: parsed.data.source,
  })

  if (error) {
    return NextResponse.json({ error: "Unable to save this email address." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
