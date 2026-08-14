import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { CreateRequirementInput, Requirement, Workspace } from "@/types/domain"

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
      })
      .select()
      .single()
    return requireData(data, error) as Requirement
  }
}
