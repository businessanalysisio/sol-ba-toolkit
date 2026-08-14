import { NextResponse } from "next/server"
import { z } from "zod"
import { createUserSupabaseClient } from "@/lib/server/supabase"
import { WorkspaceRepository } from "@/lib/server/workspace-repository"
import { canTransition } from "@/lib/requirement-lifecycle"

const patchSchema = z.object({
  title: z.string().trim().min(1).max(240).optional(),
  description: z.string().trim().max(20_000).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  status: z
    .enum(["draft", "review", "approved", "change_requested", "rejected", "implemented", "archived"])
    .optional(),
  acceptance_criteria: z.array(z.string().trim().min(1).max(2_000)).max(50).optional(),
  goal: z.string().trim().max(240).nullable().optional(),
  tests: z.array(z.string().trim().min(1).max(240)).max(50).optional(),
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

function validIds(id: string, requirementId: string) {
  return z.string().uuid().safeParse(id).success && z.string().uuid().safeParse(requirementId).success
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; requirementId: string }> },
) {
  try {
    const auth = await authenticate(request)
    if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    const { id, requirementId } = await params
    if (!validIds(id, requirementId)) return NextResponse.json({ error: "Invalid identifier." }, { status: 400 })

    const requirement = await auth.repository.getRequirement(id, requirementId)
    if (!requirement) return NextResponse.json({ error: "Requirement not found." }, { status: 404 })

    const events = await auth.repository.listRequirementEvents(id, requirementId)
    return NextResponse.json({ requirement, events })
  } catch (error) {
    console.error("Unable to load requirement", error)
    return NextResponse.json({ error: "Unable to load requirement." }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; requirementId: string }> },
) {
  try {
    const auth = await authenticate(request)
    if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    const { id, requirementId } = await params
    if (!validIds(id, requirementId)) return NextResponse.json({ error: "Invalid identifier." }, { status: 400 })

    const parsed = patchSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid requirement details." }, { status: 400 })

    // A status move is checked against the same transition table the UI draws
    // its buttons from, so a hand-rolled request cannot skip the workflow.
    if (parsed.data.status) {
      const current = await auth.repository.getRequirement(id, requirementId)
      if (!current) return NextResponse.json({ error: "Requirement not found." }, { status: 404 })
      if (current.status !== parsed.data.status && !canTransition(current.status, parsed.data.status)) {
        return NextResponse.json(
          { error: `Cannot move a requirement from ${current.status} to ${parsed.data.status}.` },
          { status: 409 },
        )
      }
    }

    const requirement = await auth.repository.updateRequirement(id, requirementId, parsed.data, auth.userId)
    return NextResponse.json({ requirement })
  } catch (error) {
    console.error("Unable to update requirement", error)
    return NextResponse.json({ error: "Unable to update requirement." }, { status: 500 })
  }
}
