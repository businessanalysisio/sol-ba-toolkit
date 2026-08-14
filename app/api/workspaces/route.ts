import { NextResponse } from "next/server"
import { z } from "zod"
import { createUserSupabaseClient } from "@/lib/server/supabase"
import { WorkspaceRepository } from "@/lib/server/workspace-repository"

const createSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2_000).optional(),
})

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization")
  return header?.startsWith("Bearer ") ? header.slice(7).trim() : null
}

async function getAuthenticatedRepository(request: Request) {
  const token = getBearerToken(request)
  if (!token) return null

  const client = createUserSupabaseClient(token)
  const { data, error } = await client.auth.getUser(token)
  if (error || !data.user) return null

  return { repository: new WorkspaceRepository(client), userId: data.user.id }
}

export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedRepository(request)
    if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    return NextResponse.json({ workspaces: await auth.repository.listWorkspaces() })
  } catch (error) {
    console.error("Unable to list workspaces", error)
    return NextResponse.json({ error: "Unable to list workspaces." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedRepository(request)
    if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

    const parsed = createSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid workspace details." }, { status: 400 })

    const workspace = await auth.repository.createWorkspace(parsed.data.name, parsed.data.description)
    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    console.error("Unable to create workspace", error)
    return NextResponse.json({ error: "Unable to create workspace." }, { status: 500 })
  }
}
