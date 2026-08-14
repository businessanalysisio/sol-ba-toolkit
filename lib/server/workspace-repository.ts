import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { AuditEvent, CreateRequirementInput, Requirement, UpdateRequirementInput, Workspace } from "@/types/domain"

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message)
  if (data === null) throw new Error("Expected data was not returned")
  return data
}

export class WorkspaceRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listWorkspaces(): Promise<Workspace[]> {
    const { data, error } = await this.client.from("workspaces").select("*").order("updated_at", { ascending: false })
    return requireData(data, error) as Workspace[]
  }

  async createWorkspace(name: string, description?: string): Promise<Workspace> {
    const { data, error } = await this.client.rpc("create_workspace", {
      workspace_name: name,
      workspace_description: description ?? null,
    })
    return requireData(data, error) as Workspace
  }

  async listRequirements(workspaceId: string): Promise<Requirement[]> {
    const { data, error } = await this.client
      .from("requirements")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false })
    return requireData(data, error) as Requirement[]
  }

  async createRequirement(input: CreateRequirementInput, userId: string): Promise<Requirement> {
    const { data, error } = await this.client
      .from("requirements")
      .insert({
        workspace_id: input.workspace_id,
        source_id: input.source_id ?? null,
        created_by: userId,
        title: input.title,
        description: input.description ?? "",
        kind: input.kind ?? "business",
        priority: input.priority ?? "medium",
        acceptance_criteria: input.acceptance_criteria ?? [],
        goal: input.goal ?? null,
        tests: input.tests ?? [],
      })
      .select()
      .single()
    return requireData(data, error) as Requirement
  }

  async getRequirement(workspaceId: string, id: string): Promise<Requirement | null> {
    const { data, error } = await this.client
      .from("requirements")
      .select()
      .eq("workspace_id", workspaceId)
      .eq("id", id)
      .maybeSingle()
    if (error) throw error
    return (data as Requirement) ?? null
  }

  /**
   * Applies a patch and records what changed. The version bump and the audit
   * row are what make the change history trustworthy — an edit that leaves no
   * trace is indistinguishable from no edit.
   */
  async updateRequirement(
    workspaceId: string,
    id: string,
    patch: UpdateRequirementInput,
    userId: string,
  ): Promise<Requirement> {
    const current = await this.getRequirement(workspaceId, id)
    if (!current) throw new Error("Requirement not found.")

    const changed: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(patch)) {
      const before = (current as unknown as Record<string, unknown>)[key]
      if (JSON.stringify(before) !== JSON.stringify(value)) changed[key] = value
    }
    if (Object.keys(changed).length === 0) return current

    const { data, error } = await this.client
      .from("requirements")
      .update({ ...patch, version: current.version + 1, updated_at: new Date().toISOString() })
      .eq("workspace_id", workspaceId)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error

    const statusChanged = "status" in changed
    await this.client.from("audit_events").insert({
      workspace_id: workspaceId,
      actor_id: userId,
      entity_type: "requirement",
      entity_id: id,
      action: statusChanged ? "status_changed" : "edited",
      changes: statusChanged ? { from: current.status, to: patch.status } : changed,
    })

    return data as Requirement
  }

  async listRequirementEvents(workspaceId: string, id: string): Promise<AuditEvent[]> {
    const { data, error } = await this.client
      .from("audit_events")
      .select()
      .eq("workspace_id", workspaceId)
      .eq("entity_type", "requirement")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data ?? []) as AuditEvent[]
  }
}
