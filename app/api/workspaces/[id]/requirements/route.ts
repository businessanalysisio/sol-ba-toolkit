import { NextResponse } from "next/server"
import { z } from "zod"
import { createUserSupabaseClient } from "@/lib/server/supabase"
import { WorkspaceRepository } from "@/lib/server/workspace-repository"

const createSchema = z.object({
  source_id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().max(20_000).optional(),
  kind: z.enum(["business", "stakeholder", "functional", "non_functional", "transition"]).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  acceptance_criteria: z.array(z.string().trim().min(1).max(2_000)).max(50).optional(),
})

async function authenticate(request: Request) {
  const header = request.headers.get("authorization")
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : null
  if (!token) return null

  const client = createUserSupabaseClient(token)
  const { data, error } = await client.auth.getUser(token)
  if (error || !data.user) return null
  return { repository: new WorkspaceRepository(client), userId: data.user.id }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticate(request)
    if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    const { id } = await params
    if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid workspace ID." }, { status: 400 })
    return NextResponse.json({ requirements: await auth.repository.listRequirements(id) })
  } catch (error) {
    console.error("Unable to list requirements", error)
    return NextResponse.json({ error: "Unable to list requirements." }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticate(request)
    if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    const { id } = await params
    if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid workspace ID." }, { status: 400 })

    const parsed = createSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid requirement details." }, { status: 400 })

    const requirement = await auth.repository.createRequirement(
      { workspace_id: id, ...parsed.data },
      auth.userId,
    )
    return NextResponse.json({ requirement }, { status: 201 })
  } catch (error) {
    console.error("Unable to create requirement", error)
    return NextResponse.json({ error: "Unable to create requirement." }, { status: 500 })
  }
}
